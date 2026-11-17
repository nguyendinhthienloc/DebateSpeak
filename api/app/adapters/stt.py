"""SCRUM-46 contract and local streaming STT adapter spike."""

from collections.abc import AsyncIterator
from pathlib import Path
from typing import Protocol, runtime_checkable
import wave

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class WordTiming(BaseModel):
    """Word-level timing and confidence for WPM and disfluency scoring."""

    model_config = ConfigDict(strict=True, extra="forbid", allow_inf_nan=False)

    word: str
    start_ms: int = Field(ge=0)
    end_ms: int = Field(ge=0)
    confidence: float = Field(ge=0.0, le=1.0)

    @field_validator("word")
    @classmethod
    def nonblank_word(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("word must not be blank")
        return value

    @model_validator(mode="after")
    def validate_duration(self) -> "WordTiming":
        if self.end_ms < self.start_ms:
            raise ValueError("end_ms must be greater than or equal to start_ms")
        return self


class STTEvent(BaseModel):
    """A streaming transcription event (partial hypothesis or finalized segment)."""

    model_config = ConfigDict(strict=True, extra="forbid", allow_inf_nan=False)

    text: str
    is_final: bool
    words: list[WordTiming] = Field(default_factory=list)
    confidence: float | None = Field(default=None, ge=0.0, le=1.0)


@runtime_checkable
class STTStream(Protocol):
    """An open bidirectional audio streaming session for a single speaker.

    Exposes per-speaker streaming recognition. LiveKit routes audio on
    independent participant tracks to preserve deterministic speaker attribution.
    """

    async def send_audio(self, pcm16: bytes) -> None:
        """Push a chunk of 16-bit linear PCM audio into the recognizer."""
        ...

    def events(self) -> AsyncIterator[STTEvent]:
        """Async stream of partial and finalized transcription events."""
        ...

    async def close(self) -> None:
        """Flush remaining buffers and close the recognizer stream."""
        ...


@runtime_checkable
class STTAdapter(Protocol):
    """Provider-agnostic speech-to-text factory protocol from architecture section 7.3."""

    async def open_stream(
        self,
        *,
        language: str = "en",
        hints: list[str] | None = None,
    ) -> STTStream:
        """Open a new recognition stream with optional vocabulary hints."""
        ...


def read_wav_pcm16(wav_path: str | Path) -> tuple[bytes, int, int]:
    """Read a standard WAV file and validate PCM16 format.

    Returns:
        tuple[bytes, int, int]: (raw_pcm_bytes, sample_rate_hz, channels)
    Raises:
        ValueError: If the file is not a valid 16-bit linear PCM WAV.
    """
    path = Path(wav_path)
    if not path.is_file():
        raise FileNotFoundError(f"WAV file not found: {path}")

    with wave.open(str(path), "rb") as wav_file:
        channels = wav_file.getnchannels()
        sampwidth = wav_file.getsampwidth()
        framerate = wav_file.getframerate()
        nframes = wav_file.getnframes()

        if sampwidth != 2:
            raise ValueError(f"Expected 16-bit PCM (sample width 2), got {sampwidth * 8}-bit")

        raw_pcm = wav_file.readframes(nframes)
        return raw_pcm, framerate, channels


class LocalMockSTTStream:
    """Test-double stream that receives PCM16 audio and yields deterministic events.

    Simulates realistic streaming recognition:
    - Buffers audio chunks received via send_audio
    - Emits interim hypotheses (is_final=False)
    - Emits a final transcript segment (is_final=True) with word timings upon close
    """

    def __init__(
        self,
        *,
        language: str = "en",
        hints: list[str] | None = None,
        mock_transcript: str = "Debate is essential for critical thinking",
        mock_words: list[WordTiming] | None = None,
    ) -> None:
        self.language = language
        self.hints = hints or []
        self.mock_transcript = mock_transcript
        self.mock_words = mock_words or self._default_words(mock_transcript)
        self.received_bytes = bytearray()
        self.closed = False

    def _default_words(self, text: str) -> list[WordTiming]:
        words = text.split()
        if not words:
            return []
        interval = 400
        timings = []
        for i, w in enumerate(words):
            timings.append(
                WordTiming(
                    word=w,
                    start_ms=i * interval,
                    end_ms=(i + 1) * interval,
                    confidence=0.95,
                )
            )
        return timings

    async def send_audio(self, pcm16: bytes) -> None:
        if self.closed:
            raise RuntimeError("Cannot send audio to a closed STTStream")
        if not isinstance(pcm16, (bytes, bytearray)):
            raise TypeError("Audio chunk must be bytes")
        self.received_bytes.extend(pcm16)

    async def close(self) -> None:
        self.closed = True

    async def events(self) -> AsyncIterator[STTEvent]:
        # Yield partial hypothesis if audio was received
        if self.received_bytes:
            tokens = self.mock_transcript.split()
            if len(tokens) >= 2:
                mid = len(tokens) // 2
                partial_text = " ".join(tokens[:mid])
                yield STTEvent(
                    text=partial_text,
                    is_final=False,
                    words=self.mock_words[:mid],
                    confidence=0.88,
                )
            # Yield final transcript segment
            yield STTEvent(
                text=self.mock_transcript,
                is_final=True,
                words=self.mock_words,
                confidence=0.96,
            )


class LocalMockSTTAdapter:
    """Test-double adapter implementing STTAdapter for local testing and spikes."""

    def __init__(
        self,
        mock_transcript: str = "Debate is essential for critical thinking",
        mock_words: list[WordTiming] | None = None,
    ) -> None:
        self.mock_transcript = mock_transcript
        self.mock_words = mock_words
        self.opened_streams: list[LocalMockSTTStream] = []

    async def open_stream(
        self,
        *,
        language: str = "en",
        hints: list[str] | None = None,
    ) -> STTStream:
        stream = LocalMockSTTStream(
            language=language,
            hints=hints,
            mock_transcript=self.mock_transcript,
            mock_words=self.mock_words,
        )
        self.opened_streams.append(stream)
        return stream


async def transcribe_wav_file(
    adapter: STTAdapter,
    wav_path: str | Path,
    *,
    language: str = "en",
    hints: list[str] | None = None,
    chunk_ms: int = 100,
) -> list[STTEvent]:
    """Spike runner: streams a local WAV file in real-time chunks through an STTAdapter.

    Validates audio format, splits into linear PCM16 chunks, feeds into the stream,
    closes the stream, and collects all emitted STT events.
    """
    raw_pcm, framerate, channels = read_wav_pcm16(wav_path)

    bytes_per_sample = 2
    chunk_bytes = int((framerate * channels * bytes_per_sample * chunk_ms) / 1000)
    if chunk_bytes <= 0:
        chunk_bytes = 3200

    stream = await adapter.open_stream(language=language, hints=hints)

    offset = 0
    while offset < len(raw_pcm):
        chunk = raw_pcm[offset : offset + chunk_bytes]
        await stream.send_audio(chunk)
        offset += chunk_bytes

    await stream.close()

    results: list[STTEvent] = []
    async for event in stream.events():
        results.append(event)

    return results
