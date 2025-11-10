import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000");

const Recorder = ({ setTranscript }) => {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on("partial_transcript", (data) => {
      setTranscript(data.text);
    });

    socket.on("final_transcript", (data) => {
      setTranscript((prev) => prev + " " + data.text);
    });

    return () => {
      socket.off("partial_transcript");
      socket.off("final_transcript");
    };
  }, [setTranscript]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.addEventListener("dataavailable", (e) => {
        if (e.data && e.data.size > 0) {
          const reader = new FileReader();
          reader.onload = () => {
            socket.emit("audio_chunk", reader.result);
          };
          reader.readAsArrayBuffer(e.data);
        }
      });

      mediaRecorder.start(1000);
      setRecording(true);
      setError(null);
    } catch (err) {
      setError("🎙️ Please allow microphone access to start recording.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      socket.emit("audio_chunk_end");
      setRecording(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "40px",
        width: "350px",
        margin: "40px auto",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: "1.4rem", color: "#1f2937", fontWeight: 600 }}>
        🎧 Real-time Speech to Text
      </h2>

      <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "0.9rem" }}>
        Click below to start recording
      </p>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <div style={{ marginTop: "25px" }}>
        {!recording ? (
          <button
            onClick={startRecording}
            style={{
              background: "linear-gradient(135deg, #10b981, #34d399)",
              color: "white",
              padding: "14px 28px",
              borderRadius: "50px",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(16,185,129,0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.boxShadow = "0 6px 25px rgba(16,185,129,0.6)")
            }
            onMouseOut={(e) =>
              (e.target.style.boxShadow = "0 4px 15px rgba(16,185,129,0.4)")
            }
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              background: "linear-gradient(135deg, #ef4444, #f87171)",
              color: "white",
              padding: "14px 28px",
              borderRadius: "50px",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(239,68,68,0.4)",
              transition: "all 0.3s ease",
              animation: "pulse 1.2s infinite",
            }}
          >
            ⏹ Stop Recording
          </button>
        )}
      </div>

      {/* Optional glowing mic animation */}
      {recording && (
        <div
          style={{
            marginTop: "20px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#ef4444",
            boxShadow: "0 0 20px rgba(239,68,68,0.7)",
            animation: "blink 1.5s infinite alternate",
          }}
        ></div>
      )}

      <style>
        {`
          @keyframes blink {
            from { opacity: 0.6; transform: scale(1); }
            to { opacity: 1; transform: scale(1.3); }
          }

          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 10px rgba(239,68,68,0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(239,68,68,0.6); }
            100% { transform: scale(1); box-shadow: 0 0 10px rgba(239,68,68,0.4); }
          }
        `}
      </style>
    </div>
  );
};

export default Recorder;
