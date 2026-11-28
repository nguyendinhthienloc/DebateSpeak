"""Unit tests for Audio & Speech AI Pipeline (workers/audio_pipeline.py).

Validates:
1. Deterministic speaker attribution (AGENTS.md §4.3): 100% accurate track-to-speaker binding.
2. Independent parallel track processing without cross-talk.
3. Graceful fallback failover when primary cloud adapter fails.
4. Pydantic validation on SpeakerTranscriptSegment.
5. Zero hardcoded absolute paths invariant.
"""

import re
from pathlib import Path

import pytest
from app.adapters.stt import (
    LocalMockSTTAdapter,
    STTAdapter,
    STTStream,
    WordTiming,
)

from workers.audio_pipeline import (
    AudioPipelineManager,
    SpeakerAudioTrack,
    SpeakerTranscriptSegment,
)

FIXTURE_WAV = Path(__file__).resolve().parent.parent / "fixtures" / "sample_debate.wav"


class FailingSTTAdapter(STTAdapter):
    """Test double that simulates cloud network connection failure."""

    async def open_stream(
        self,
        *,
        language: str = "en",
        hints: list[str] | None = None,
    ) -> STTStream:
        raise ConnectionError(
            "Cloud STT provider unreachable (Simulated Network Error)"
        )


@pytest.fixture
def mock_wav_pcm() -> bytes:
    """Provide valid 16kHz mono PCM16 test audio bytes."""
    assert FIXTURE_WAV.is_file(), f"Fixture not found at {FIXTURE_WAV}"
    import wave

    with wave.open(str(FIXTURE_WAV), "rb") as wf:
        return wf.readframes(wf.getnframes())


@pytest.mark.asyncio
async def test_single_speaker_track_attribution(mock_wav_pcm: bytes) -> None:
    """Ensure a speaker track emits transcript segments strictly attributed to that speaker."""
    adapter = LocalMockSTTAdapter(
        mock_transcript="Universities should offer four-day weeks"
    )
    track = SpeakerAudioTrack(
        room_id="room-debate-001",
        speaker_id="user-alex-123",
        speaker_stance="AFFIRMATIVE",
        track_sid="track-mic-alex",
        adapter=adapter,
        hints=["four-day week", "education"],
    )

    # Push PCM chunks
    chunk_size = 3200  # 100ms chunks at 16kHz
    for offset in range(0, len(mock_wav_pcm), chunk_size):
        await track.push_audio(mock_wav_pcm[offset : offset + chunk_size])

    await track.close()

    segments: list[SpeakerTranscriptSegment] = []
    async for segment in track.events():
        segments.append(segment)

    assert len(segments) >= 1
    for seg in segments:
        assert seg.room_id == "room-debate-001"
        assert seg.speaker_id == "user-alex-123"
        assert seg.speaker_stance == "AFFIRMATIVE"
        assert seg.track_sid == "track-mic-alex"
        assert seg.confidence >= 0.0 and seg.confidence <= 1.0
        assert seg.end_ms >= seg.start_ms
        assert len(seg.text) > 0

    # Verify final segment exists
    final_segs = [s for s in segments if s.is_final]
    assert len(final_segs) == 1
    assert len(final_segs[0].words) > 0


@pytest.mark.asyncio
async def test_deterministic_speaker_isolation_two_speakers(
    mock_wav_pcm: bytes,
) -> None:
    """Ensure parallel tracks for Affirmative and Negative maintain 100% deterministic isolation."""
    adapter_aff = LocalMockSTTAdapter(mock_transcript="Affirmative opening statement")
    adapter_neg = LocalMockSTTAdapter(
        mock_transcript="Negative cross-examination rebuttal"
    )

    track_aff = SpeakerAudioTrack(
        room_id="room-championship-finals",
        speaker_id="debater-affirmative-alex",
        speaker_stance="AFFIRMATIVE",
        track_sid="track-webrtc-aff",
        adapter=adapter_aff,
    )

    track_neg = SpeakerAudioTrack(
        room_id="room-championship-finals",
        speaker_id="debater-negative-jordan",
        speaker_stance="NEGATIVE",
        track_sid="track-webrtc-neg",
        adapter=adapter_neg,
    )

    # Interleave audio pushes to simulate simultaneous debater activity
    chunk = mock_wav_pcm[:6400]
    await track_aff.push_audio(chunk)
    await track_neg.push_audio(chunk)
    await track_aff.push_audio(chunk)
    await track_neg.push_audio(chunk)

    await track_aff.close()
    await track_neg.close()

    segments_aff = [seg async for seg in track_aff.events()]
    segments_neg = [seg async for seg in track_neg.events()]

    assert len(segments_aff) > 0
    assert len(segments_neg) > 0

    # Deterministic Speaker Attribution Verification (AGENTS.md Section 4.3)
    for seg in segments_aff:
        assert seg.speaker_id == "debater-affirmative-alex"
        assert seg.speaker_stance == "AFFIRMATIVE"
        assert seg.track_sid == "track-webrtc-aff"
        assert "Affirmative" in seg.text or "debate" in seg.text.lower()

    for seg in segments_neg:
        assert seg.speaker_id == "debater-negative-jordan"
        assert seg.speaker_stance == "NEGATIVE"
        assert seg.track_sid == "track-webrtc-neg"
        assert "Negative" in seg.text or "debate" in seg.text.lower()


@pytest.mark.asyncio
async def test_automatic_fallback_when_primary_fails(mock_wav_pcm: bytes) -> None:
    """Ensure pipeline automatically failovers to local mock fallback without throwing error."""
    failing_adapter = FailingSTTAdapter()
    fallback_adapter = LocalMockSTTAdapter(
        mock_transcript="Offline fallback debate speech"
    )

    track = SpeakerAudioTrack(
        room_id="room-network-chaos",
        speaker_id="debater-sam",
        speaker_stance="AFFIRMATIVE",
        track_sid="track-sam-mic",
        adapter=failing_adapter,
        fallback_adapter=fallback_adapter,
    )

    # Pushing audio should trigger failover rather than crashing
    await track.push_audio(mock_wav_pcm[:6400])
    await track.close()

    assert track.is_using_fallback is True

    segments = [seg async for seg in track.events()]
    assert len(segments) > 0
    final_seg = next(s for s in segments if s.is_final)
    assert final_seg.speaker_id == "debater-sam"
    assert "Offline fallback" in final_seg.text or len(final_seg.text) > 0


@pytest.mark.asyncio
async def test_audio_pipeline_manager_lifecycle() -> None:
    """Verify AudioPipelineManager orchestrates multi-track lifecycle."""
    adapter = LocalMockSTTAdapter()
    manager = AudioPipelineManager(room_id="room-manager-test", default_adapter=adapter)

    track1 = manager.register_speaker_track(
        speaker_id="user-1",
        speaker_stance="AFFIRMATIVE",
        track_sid="track-1",
    )
    track2 = manager.register_speaker_track(
        speaker_id="user-2",
        speaker_stance="NEGATIVE",
        track_sid="track-2",
    )

    assert manager.get_track("track-1") is track1
    assert manager.get_track("track-2") is track2
    assert manager.get_track("unknown-track") is None

    # Idempotent re-registration returns existing track
    assert (
        manager.register_speaker_track(
            speaker_id="user-1",
            speaker_stance="AFFIRMATIVE",
            track_sid="track-1",
        )
        is track1
    )

    await manager.close_all()
    assert manager.get_track("track-1") is None


def test_speaker_transcript_segment_validation() -> None:
    """Validate strict bounds and error rejection on SpeakerTranscriptSegment."""
    from pydantic import ValidationError

    # Valid segment
    seg = SpeakerTranscriptSegment(
        room_id="room-1",
        speaker_id="user-1",
        speaker_stance="AFFIRMATIVE",
        track_sid="track-1",
        text="Hello world",
        is_final=True,
        start_ms=0,
        end_ms=1000,
        confidence=0.92,
        words=[WordTiming(word="Hello", start_ms=0, end_ms=500, confidence=0.95)],
    )
    assert seg.text == "Hello world"

    # Negative start_ms must fail
    with pytest.raises(ValidationError):
        SpeakerTranscriptSegment(
            room_id="room-1",
            speaker_id="user-1",
            speaker_stance="AFFIRMATIVE",
            track_sid="track-1",
            text="Hello",
            is_final=True,
            start_ms=-10,
            end_ms=500,
            confidence=0.9,
        )

    # Invalid confidence (> 1.0) must fail
    with pytest.raises(ValidationError):
        SpeakerTranscriptSegment(
            room_id="room-1",
            speaker_id="user-1",
            speaker_stance="AFFIRMATIVE",
            track_sid="track-1",
            text="Hello",
            is_final=True,
            start_ms=0,
            end_ms=500,
            confidence=1.5,
        )


def test_zero_hardcoded_paths_in_worker_code() -> None:
    """AGENTS.md Section 1 invariant check: ensure no absolute paths exist in worker."""
    worker_file = (
        Path(__file__).resolve().parent.parent.parent / "workers" / "audio_pipeline.py"
    )
    content = worker_file.read_text(encoding="utf-8")

    forbidden_patterns = [
        r"[A-Za-z]:\\",  # Windows absolute path
        r"/home/[a-zA-Z0-9_-]+",  # Linux home absolute path
        r"/Users/[a-zA-Z0-9_-]+",  # macOS home absolute path
    ]

    for pattern in forbidden_patterns:
        match = re.search(pattern, content)
        assert match is None, (
            f"Found hardcoded absolute path matching '{pattern}': {match}"
        )
