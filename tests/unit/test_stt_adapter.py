import asyncio
import wave
from pathlib import Path

import pytest
from app.adapters.stt import (
    LocalMockSTTAdapter,
    STTAdapter,
    STTEvent,
    STTStream,
    WordTiming,
    read_wav_pcm16,
    transcribe_wav_file,
)
from pydantic import ValidationError

SAMPLE_WAV_PATH = Path("tests/fixtures/sample_debate.wav")


def test_word_timing_valid():
    wt = WordTiming(word="debate", start_ms=0, end_ms=450, confidence=0.98)
    assert wt.word == "debate"
    assert wt.start_ms == 0
    assert wt.end_ms == 450
    assert wt.confidence == 0.98


def test_word_timing_zero_duration_allowed():
    wt = WordTiming(word="ah", start_ms=100, end_ms=100, confidence=0.9)
    assert wt.start_ms == wt.end_ms == 100


def test_word_timing_rejects_inverted_duration():
    with pytest.raises(
        ValidationError, match="end_ms must be greater than or equal to start_ms"
    ):
        WordTiming(word="invalid", start_ms=500, end_ms=400, confidence=0.9)


@pytest.mark.parametrize("word", ["", "   ", "\n\t"])
def test_word_timing_rejects_blank_word(word):
    with pytest.raises(ValidationError, match="word must not be blank"):
        WordTiming(word=word, start_ms=0, end_ms=100, confidence=0.9)


@pytest.mark.parametrize("start_ms,end_ms", [(-1, 100), (0, -5)])
def test_word_timing_rejects_negative_timestamps(start_ms, end_ms):
    with pytest.raises(ValidationError):
        WordTiming(word="test", start_ms=start_ms, end_ms=end_ms, confidence=0.9)


@pytest.mark.parametrize("confidence", [-0.1, 1.01, 2.0, -1.0])
def test_word_timing_rejects_out_of_range_confidence(confidence):
    with pytest.raises(ValidationError):
        WordTiming(word="test", start_ms=0, end_ms=100, confidence=confidence)


def test_word_timing_rejects_extra_fields():
    with pytest.raises(ValidationError):
        WordTiming(
            word="test", start_ms=0, end_ms=100, confidence=0.9, extra="disallowed"
        )


def test_stt_event_interim_hypothesis():
    event = STTEvent(text="Debate is", is_final=False, confidence=0.85)
    assert event.text == "Debate is"
    assert not event.is_final
    assert event.confidence == 0.85
    assert event.words == []


def test_stt_event_finalized_segment_with_words():
    words = [
        WordTiming(word="Debate", start_ms=0, end_ms=400, confidence=0.95),
        WordTiming(word="matters", start_ms=420, end_ms=800, confidence=0.97),
    ]
    event = STTEvent(text="Debate matters", is_final=True, words=words, confidence=0.96)
    assert event.text == "Debate matters"
    assert event.is_final
    assert len(event.words) == 2
    assert event.words[0].word == "Debate"
    assert event.words[1].word == "matters"


@pytest.mark.parametrize("confidence", [-0.01, 1.05])
def test_stt_event_rejects_invalid_confidence(confidence):
    with pytest.raises(ValidationError):
        STTEvent(text="test", is_final=True, confidence=confidence)


def test_stt_adapter_and_stream_satisfy_protocols():
    adapter = LocalMockSTTAdapter()
    assert isinstance(adapter, STTAdapter)

    stream = asyncio.run(adapter.open_stream(language="en", hints=["debate", "motion"]))
    assert isinstance(stream, STTStream)


def test_stt_stream_audio_and_events():
    async def run():
        adapter = LocalMockSTTAdapter(
            mock_transcript="Universities should offer four day weeks"
        )
        stream = await adapter.open_stream(language="en")

        pcm_chunk = b"\x00\x00" * 1600  # 100ms of 16kHz 16-bit silence
        await stream.send_audio(pcm_chunk)
        await stream.send_audio(pcm_chunk)
        await stream.close()

        events = []
        async for ev in stream.events():
            events.append(ev)

        assert len(events) == 2
        # First event is partial
        assert not events[0].is_final
        assert events[0].text == "Universities should offer"
        # Second event is final
        assert events[1].is_final
        assert events[1].text == "Universities should offer four day weeks"
        assert len(events[1].words) == 6

    asyncio.run(run())


def test_stt_stream_closed_rejects_further_audio():
    async def run():
        adapter = LocalMockSTTAdapter()
        stream = await adapter.open_stream()
        await stream.close()
        with pytest.raises(
            RuntimeError, match="Cannot send audio to a closed STTStream"
        ):
            await stream.send_audio(b"\x00\x00" * 100)

    asyncio.run(run())


def test_stt_stream_rejects_non_bytes():
    async def run():
        adapter = LocalMockSTTAdapter()
        stream = await adapter.open_stream()
        with pytest.raises(TypeError, match="Audio chunk must be bytes"):
            await stream.send_audio("not-bytes-audio")  # type: ignore

    asyncio.run(run())


def test_read_wav_pcm16_fixture():
    assert SAMPLE_WAV_PATH.exists(), f"Fixture missing: {SAMPLE_WAV_PATH}"
    pcm, rate, channels = read_wav_pcm16(SAMPLE_WAV_PATH)
    assert rate == 16000
    assert channels == 1
    assert len(pcm) > 0
    # 2.0s * 16000 samples/s * 2 bytes/sample = 64000 bytes
    assert len(pcm) == 64000


def test_read_wav_pcm16_file_not_found(tmp_path):
    missing_file = tmp_path / "nonexistent.wav"
    with pytest.raises(FileNotFoundError, match="WAV file not found"):
        read_wav_pcm16(missing_file)


def test_read_wav_pcm16_rejects_non_16bit(tmp_path):
    bad_wav = tmp_path / "8bit.wav"
    with wave.open(str(bad_wav), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(1)  # 8-bit instead of 16-bit
        w.setframerate(16000)
        w.writeframes(b"\x80" * 160)

    with pytest.raises(ValueError, match="Expected 16-bit PCM"):
        read_wav_pcm16(bad_wav)


def test_transcribe_wav_file_spike():
    async def run():
        adapter = LocalMockSTTAdapter(
            mock_transcript="Should universities offer a four-day week?",
        )
        events = await transcribe_wav_file(
            adapter=adapter,
            wav_path=SAMPLE_WAV_PATH,
            language="en",
            hints=["universities", "four-day week"],
            chunk_ms=100,
        )

        assert len(events) >= 1
        final_event = events[-1]
        assert final_event.is_final
        assert final_event.text == "Should universities offer a four-day week?"
        assert len(final_event.words) == 6
        assert final_event.words[0].word == "Should"
        assert final_event.words[-1].word == "week?"
        assert final_event.confidence > 0.9

        # Verify adapter recorded the stream
        assert len(adapter.opened_streams) == 1
        stream = adapter.opened_streams[0]
        assert stream.closed
        assert len(stream.received_bytes) == 64000  # full audio streamed
        assert stream.language == "en"
        assert stream.hints == ["universities", "four-day week"]

    asyncio.run(run())
