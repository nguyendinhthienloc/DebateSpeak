import sys
from pathlib import Path

# Add 'api' directory to Python path dynamically
api_dir = Path(__file__).resolve().parent / "api"
if str(api_dir) not in sys.path:
    sys.path.insert(0, str(api_dir))

import asyncio
from app.adapters.stt import LocalMockSTTAdapter, transcribe_wav_file


async def main():
    print("=" * 60)
    print("DebateSpeak AI - STTAdapter Local WAV Transcription Spike")
    print("=" * 60)

    wav_file = Path("tests/fixtures/sample_debate.wav")
    transcript = "Should universities offer a four-day week?"

    print(f"Input WAV: {wav_file} (PCM 16kHz Mono 16-bit)")
    print(f"Simulated Speech: \"{transcript}\"\n")

    adapter = LocalMockSTTAdapter(mock_transcript=transcript)
    events = await transcribe_wav_file(
        adapter=adapter,
        wav_path=wav_file,
        language="en",
        hints=["universities", "four-day week"],
        chunk_ms=100,
    )

    for i, event in enumerate(events, 1):
        status = "FINAL" if event.is_final else "PARTIAL"
        print(f"[{status}] Event {i}: \"{event.text}\" (confidence: {event.confidence})")
        for word in event.words:
            print(f"   - {word.word:<15} [{word.start_ms}ms -> {word.end_ms}ms] (conf: {word.confidence})")
        print()

    print("=" * 60)
    print("Spike Completed Successfully!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
