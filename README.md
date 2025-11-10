# Real-time Speech-to-Text MERN Application

A real-time **speech-to-text web application** built with **MERN stack** and **WebSocket streaming**. The app allows users to speak into their microphone and receive live transcripts. FFmpeg converts the WebM audio chunks to PCM for the STT service.

---

## Features

- Real-time speech-to-text transcription.
- Supports multi-lingual input (Hindi + English).
- Partial and final transcripts.
- MongoDB storage for final transcripts.
- Responsive and clean frontend UI using React.
- Node.js backend with WebSocket integration for real-time streaming.
- FFmpeg for audio conversion from WebM → PCM (16kHz, mono).

---

## Tech Stack

- **Frontend:** React, Vite, Socket.io-client
- **Backend:** Node.js, Express, Socket.io, Fluent-FFmpeg
- **Database:** MongoDB (Atlas or local)
- **Audio Processing:** FFmpeg
- **STT Service:** WebSocket-based (Python or other STT engine)

---

## Prerequisites

- Node.js >= 18
- NPM or Yarn
- MongoDB URI
- Python-based STT service running (or any WebSocket STT service)
- FFmpeg installed and available in PATH  
  *(Check with `ffmpeg -version` in terminal)*

---

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd speech-to-text-mern
