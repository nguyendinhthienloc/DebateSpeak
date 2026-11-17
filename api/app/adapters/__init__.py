"""Provider-independent contracts for external services."""

from app.adapters.llm import LLMAdapter, LLMResult, validate_completion
from app.adapters.stt import (
    LocalMockSTTAdapter,
    LocalMockSTTStream,
    STTAdapter,
    STTEvent,
    STTStream,
    WordTiming,
    read_wav_pcm16,
    transcribe_wav_file,
)

__all__ = [
    "LLMAdapter",
    "LLMResult",
    "LocalMockSTTAdapter",
    "LocalMockSTTStream",
    "STTAdapter",
    "STTEvent",
    "STTStream",
    "WordTiming",
    "read_wav_pcm16",
    "transcribe_wav_file",
    "validate_completion",
]
