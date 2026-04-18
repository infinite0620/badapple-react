import { useRef, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ascii, setAscii] = useState("");
  const [started, setStarted] = useState(false);

  const chars = " .'`^\",:;Il!i~+_-?][}{1)(|\\/*tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

  const start = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setStarted(true);
    video.play(); // 👉 영상 + 소리 같이 시작

    const render = () => {
      if (video.paused || video.ended) return;

      ctx.drawImage(video, 0, 0, 120, 60);
      const frame = ctx.getImageData(0, 0, 120, 60);

      let result = "";

      for (let i = 0; i < frame.data.length; i += 4) {
        const r = frame.data[i];
        const g = frame.data[i + 1];
        const b = frame.data[i + 2];

        const gray = (r + g + b) / 3;
        const index = Math.floor((gray / 255) * (chars.length - 1));

        result += chars[index];

        if ((i / 4 + 1) % 120 === 0) result += "\n";
      }

      setAscii(result);
      requestAnimationFrame(render);
    };

    render();
  };

  return (
    <div style={{ background: "black", color: "white", height: "100vh" }}>
      {!started && (
        <button onClick={start} style={{ fontSize: "20px" }}>
          ▶ 실행
        </button>
      )}

      {/* 🎬 영상 (소리 포함) */}
      <video
        ref={videoRef}
        src="/badapple.mp4"
        style={{ display: "none" }}
      />

      <canvas ref={canvasRef} width="120" height="60" style={{ display: "none" }} />

      <pre style={{ fontSize: "6px", lineHeight: "6px" }}>
        {ascii}
      </pre>
    </div>
  );
}

export default App;