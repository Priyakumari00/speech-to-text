# 🎙️ Real-time Speech-to-Text MERN App

[![MERN](https://img.shields.io/badge/Stack-MERN-blue)](https://mern.io/) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

A **real-time speech-to-text web application** built using the **MERN stack** and **WebSocket streaming**. Speak into your microphone and get **instant live transcripts**! The backend uses **FFmpeg** to convert WebM audio chunks to PCM for STT processing.

---

## 🚀 Features

- 🎧 Real-time audio transcription.
- 🔤 Supports multi-lingual input (Hindi + English).
- 💬 Partial transcripts while speaking.
- ✅ Final transcripts saved in MongoDB.
- 🌐 Responsive frontend UI built with React.
- ⚡ Low-latency streaming using Socket.io.
- 🛠️ FFmpeg for audio conversion (WebM → PCM, 16kHz, mono).

---

## 🛠 Tech Stack

| Frontend | Backend | Database | Audio Processing | Communication |
|----------|--------|----------|-----------------|---------------|
| React + Vite | Node.js + Express | MongoDB Atlas / Local | FFmpeg | Socket.io / WebSocket |

---

## 📷 Screenshots



**Recording UI**  
![Recording UI](Gallery)

---

## 📝 Prerequisites

- Node.js >= 18
- NPM or Yarn
- MongoDB (Atlas or local)
- Python-based STT service running (or any WebSocket STT engine)
- FFmpeg installed and in PATH  
  ```bash
  ffmpeg -version
---
💻 Setup

1️⃣ Clone the repository
```
git clone <your-repo-url>
cd speech-to-text-mern
```
2️⃣ Backend Setup
```
cd backend
npm install
```
Create a .env file in backend/:
```
PORT=4000
MONGO_URI=<your-mongodb-uri>
STT_WS_URL=ws://localhost:5000  # URL of your STT WebSocket service
```
Start the backend:
```
npm start
```
---
3️⃣ Frontend Setup
```
cd ../frontend
npm install
```
Create a .env file in frontend/:
```
VITE_BACKEND_URL=http://localhost:4000
```
Start the frontend:
```
npm run dev
```
---
🧑‍💻 Author
Priya Kumari
MERN Stack Developer | AI/ML Enthusiast

---






