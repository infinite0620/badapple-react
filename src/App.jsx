import { useRef, useState, useEffect } from "react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [ascii, setAscii] = useState("");
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState("normal");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [explosions, setExplosions] = useState([]);

  const WIDTH = 120;
  const HEIGHT = 60;

  const chars =
    " .'`^\",:;Il!i~+_-?][}{1)(|\\/*tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

  // 🎯 키보드 모드 변경
  useEffect(() => {
    window.onkeydown = (e) => {
      if (e.key === "1") setMode("normal");
      if (e.key === "2") setMode("glitch");
      if (e.key === "3") setMode("matrix");
    };
  }, []);

  const start = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setStarted(true);
    video.play();

    const render = () => {
      if (video.paused || video.ended) return;

      ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);
      const frame = ctx.getImageData(0, 0, WIDTH, HEIGHT);

      let result = "";

      for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH; j++) {
          const idx = (i * WIDTH + j) * 4;

          const r = frame.data[idx];
          const g = frame.data[idx + 1];
          const b = frame.data[idx + 2];

          const gray = (r + g + b) / 3;
          let index = Math.floor((gray / 255) * (chars.length - 1));
          let char = chars[index];

          // 💀 마우스 깨짐 효과
          const dx = j - mouse.x / 8;
          const dy = i - mouse.y / 12;
          if (Math.sqrt(dx * dx + dy * dy) < 4) {
            char = "#";
          }

          // 💥 폭발 효과
          explosions.forEach((exp) => {
            const ex = exp.x / 8;
            const ey = exp.y / 12;
            const d = Math.sqrt((j - ex) ** 2 + (i - ey) ** 2);
            if (d < 5) char = "@";
          });

          // ⚡ glitch 모드
          if (mode === "glitch" && Math.random() < 0.05) {
            char = chars[Math.floor(Math.random() * chars.length)];
          }

          // 🧠 matrix 모드
          if (mode === "matrix" && Math.random() < 0.05) {
            char = "0";
          }

          result += char;
        }
        result += "\n";
      }

      setAscii(result);
      requestAnimationFrame(render);
    };

    render();
  };

  return (
    <div
      style={{
        background: "black",
        color: mode === "matrix" ? "#00ff00" : "white",
        height: "100vh",
        overflow: "hidden",
      }}
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
      onClick={(e) =>
        setExplosions([...explosions, { x: e.clientX, y: e.clientY }])
      }
    >
      {!started && (
        <button
          onClick={start}
          style={{
            fontSize: "20px",
            padding: "10px 20px",
            position: "absolute",
            zIndex: 2,
          }}
        >
          ▶ 실행
        </button>
      )}

      {/* 🎮 UI */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
        <p>1: 기본 | 2: glitch | 3: matrix</p>
        <p>클릭: 폭발 💥</p>
        <p>마우스: 화면 깨짐 😈</p>
      </div>

      <video
        ref={videoRef}
        src="/badapple.mp4"
        style={{ display: "none" }}
      />

      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ display: "none" }}
      />

      <pre
        style={{
          fontSize: "6px",
          lineHeight: "6px",
          margin: 0,
        }}
      >
        {ascii}
      </pre>
    </div>
  );
}

export default App;