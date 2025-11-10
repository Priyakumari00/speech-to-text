import asyncio
import json
import websockets
import numpy as np
import soundfile as sf
from io import BytesIO
from faster_whisper import WhisperModel   # optional

# Adjust model size: "small", "medium", "large-v2" etc.
MODEL_SIZE = "small"

model = WhisperModel(MODEL_SIZE, device="cpu")  # set "cuda" if GPU

# We'll accept raw Opus/WebM bytes from browser; easiest: expect the backend to send already-converted PCM.
# For simplicity, here we accept raw PCM 16-bit little-endian frames in chunks (signed int16).
# If using the Node backend above, you forwarded ArrayBuffer with webm; you need to convert webm->pcm there
# OR change backend to decode using ffmpeg and send PCM frames. For clarity, I will assume backend forwards PCM frames.

async def handler(websocket, path):
    print("Client connected to STT service")
    buffer = bytearray()
    chunk_size_ms = 1500  # 1.5s windows
    sample_rate = 16000

    try:
        async for message in websocket:
            # If message is control JSON:
            if isinstance(message, str):
                try:
                    msg = json.loads(message)
                    if msg.get("event") == "end_of_stream":
                        # transcribe remaining buffer to final
                        if buffer:
                            audio_np = np.frombuffer(buffer, dtype=np.int16).astype(np.float32)/32768.0
                            segments, info = model.transcribe(audio_np, beam_size=5, language=None, word_timestamps=False)
                            final_text = "".join([seg.text for seg in segments])
                            await websocket.send(json.dumps({"type":"final", "text": final_text}))
                            buffer.clear()
                        continue
                except Exception:
                    pass

            # message is binary audio bytes
            if isinstance(message, (bytes, bytearray)):
                print(f"Received audio data: {len(message)} bytes")
                buffer.extend(message)
                # if buffer long enough, take recent chunk and transcribe for partial result
                # compute ms in buffer
                ms = len(buffer) / 2 / sample_rate * 1000  # 2 bytes per sample int16
                print(f"Buffer size: {ms}ms")
                if ms >= chunk_size_ms:
                    # transcribe the whole buffer (or last N seconds)
                    print("Transcribing buffer...")
                    audio_np = np.frombuffer(buffer, dtype=np.int16).astype(np.float32)/32768.0
                    segments, info = model.transcribe(audio_np, beam_size=5)
                    partial_text = "".join([seg.text for seg in segments])
                    print(f"Partial transcription: {partial_text}")
                    # send partial
                    await websocket.send(json.dumps({"type":"partial", "text": partial_text}))
                    # optionally keep last few seconds only to reduce repeated long transcriptions
                    keep_ms = 2000
                    keep_samples = int(sample_rate * keep_ms / 1000) * 2 # bytes
                    if len(buffer) > keep_samples:
                        buffer = buffer[-keep_samples:]
    except websockets.ConnectionClosed:
        print("Connection closed")

start_server = websockets.serve(handler, "0.0.0.0", 9000)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
