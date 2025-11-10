import React, { useState } from "react";
import Recorder from "./components/Recorder";

function App() {
  const [transcript, setTranscript] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎙️ Real-Time Speech-to-Text</h1>
      <Recorder setTranscript={setTranscript} />
      <div
        style={{
          marginTop: "30px",
          width: "60%",
          margin: "auto",
          background: "#f9fafb",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          fontSize: "18px",
          minHeight: "120px",
        }}
      >
        {transcript || "Start speaking..."}
      </div>
    </div>
  );
}

export default App;
