require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const ffmpeg = require('fluent-ffmpeg');
const { Readable } = require('stream');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Mongo connected"));

const TranscriptSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  meta: Object
});
const Transcript = mongoose.model('Transcript', TranscriptSchema);

// WebM to PCM converter using fluent-ffmpeg
function convertWebMToPCM(webmBuffer) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const inputStream = Readable.from([webmBuffer]);
    
    const command = ffmpeg(inputStream)
      .inputFormat('webm')
      .audioCodec('pcm_s16le')
      .audioFrequency(16000)
      .audioChannels(1)
      .format('s16le')
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      })
      .on('end', () => {
        console.log('FFmpeg conversion completed');
        resolve(Buffer.concat(chunks));
      });
    
    const outputStream = command.pipe();
    outputStream.on('data', (chunk) => {
      chunks.push(chunk);
    });
  });
}

// Connect to STT service (Python) via websocket
const sttWs = new WebSocket(process.env.STT_WS_URL);

sttWs.on('open', ()=>console.log('Connected to STT service'));

io.on('connection', (socket) => {
  console.log('client connected', socket.id);

  // when we get raw audio chunk (ArrayBuffer)
  socket.on('audio_chunk', async (arrayBuffer) => {
    console.log('received audio chunk from client, size:', arrayBuffer.byteLength);
    try {
      const pcmBuffer = await convertWebMToPCM(Buffer.from(arrayBuffer));
      // forward PCM to STT service
      if (sttWs.readyState === WebSocket.OPEN) {
        sttWs.send(pcmBuffer);
        console.log('forwarded PCM audio chunk to STT service');
      }
    } catch (err) {
      console.error('WebM to PCM conversion failed:', err);
    }
  });

  socket.on('audio_chunk_end', async () => {
    // signal finalization to stt service
    if (sttWs.readyState === WebSocket.OPEN) {
      sttWs.send(JSON.stringify({ event: 'end_of_stream' }));
    }
  });

  // receive transcripts from STT service and forward to client
  // We'll register an incoming message handler on the STT ws below
});

sttWs.on('message', async (msg) => {
  let parsed;
  try { parsed = JSON.parse(msg); } catch(e) { parsed = null; }
  if (parsed?.type === 'partial') {
    console.log('Sending partial transcript to clients:', parsed.text);
    // broadcast partial to all connected clients
    io.emit('partial_transcript', { text: parsed.text });
  } else if (parsed?.type === 'final') {
    console.log('Sending final transcript to clients:', parsed.text);
    io.emit('final_transcript', { text: parsed.text });
    // save to DB
    await Transcript.create({ text: parsed.text, meta: parsed.meta || {} });
  } else {
    // may be binary or other messages — ignore
  }
});

server.listen(process.env.PORT || 4000, () => console.log("Backend running on 4000"));
