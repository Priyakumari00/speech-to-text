import asyncio
import websockets
import json
from vosk import Model, KaldiRecognizer
import sys
import os

# Load the Vosk model
model_path = os.path.expanduser("~/.cache/vosk/vosk-model-small-en-us-0.15")
model = Model(model_path)
print("🚀 WebSocket server started at ws://localhost:9000")

async def recognize_audio(websocket):
    recognizer = KaldiRecognizer(model, 16000)
    recognizer.SetWords(True)
    print("🎧 Client connected")
    try:
        async for message in websocket:
            # If message is text (control), skip binary decoding
            if isinstance(message, str):
                try:
                    data = json.loads(message)
                    if data.get("event") == "end_of_stream":
                        # finalize transcription
                        final = recognizer.FinalResult()
                        await websocket.send(json.dumps({"type": "final", "text": json.loads(final).get("text", "")}))
                        recognizer = KaldiRecognizer(model, 16000)
                    continue
                except json.JSONDecodeError:
                    continue

            # if message is binary (actual audio)
            if isinstance(message, (bytes, bytearray)):
                if recognizer.AcceptWaveform(message):
                    result_json = recognizer.Result()
                    print(f"Vosk Result: {result_json}")
                    result = json.loads(result_json)
                    await websocket.send(json.dumps({"type": "final", "text": result.get("text", "")}))
                else:
                    partial_json = recognizer.PartialResult()
                    print(f"Vosk Partial Result: {partial_json}")
                    partial = json.loads(partial_json)
                    await websocket.send(json.dumps({"type": "partial", "text": partial.get("partial", "")}))
    except websockets.exceptions.ConnectionClosed:
        print("❌ Client disconnected")

async def main():
    async with websockets.serve(recognize_audio, "0.0.0.0", 9000, max_size=None, ping_interval=None):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
