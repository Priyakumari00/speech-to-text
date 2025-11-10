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

> Replace these with your own screenshots or GIFs

**Recording UI**  
![Recording UI](./screenshots/recorder-ui.png)

**Live Transcript**  
![Transcript UI](./screenshots/transcript-ui.png)

---

## ⚡ Live Demo

> If deployed, add link here (Vercel / Render / Railway)  
Example: [Live Demo](https://your-demo-link.com)

---

## 📝 Prerequisites

- Node.js >= 18
- NPM or Yarn
- MongoDB (Atlas or local)
- Python-based STT service running (or any WebSocket STT engine)
- FFmpeg installed and in PATH  
  ```bash
  ffmpeg -version
