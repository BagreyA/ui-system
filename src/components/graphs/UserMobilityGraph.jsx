import { useEffect, useRef } from "react";

const ueColors = [
  "#00A7C1",
  "#FF6B6B",
  "#ffb938",
  "#83ff83",
  "#d146ff",
];

export default function UserMobilityGraph({ width, height }) {
  const canvasRef = useRef(null);
  const usersRef = useRef([]);

  // инициализация 5 UE
  useEffect(() => {
    usersRef.current = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
      color: ueColors[i % ueColors.length],
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let animationId;

    function update() {
      const users = usersRef.current;

      // движение (random walk)
      users.forEach((u) => {
        u.x += u.dx;
        u.y += u.dy;

        // отскок от границ
        if (u.x < 0 || u.x > 100) u.dx *= -1;
        if (u.y < 0 || u.y > 100) u.dy *= -1;

        // чуть хаоса
        u.dx += (Math.random() - 0.5) * 0.1;
        u.dy += (Math.random() - 0.5) * 0.1;

        // ограничение скорости
        u.dx = Math.max(-2, Math.min(2, u.dx));
        u.dy = Math.max(-2, Math.min(2, u.dy));
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // фон
      ctx.fillStyle = "#0b1220";
      ctx.fillRect(0, 0, width, height);

      const users = usersRef.current;

      users.forEach((u, i) => {
        const x = (u.x / 100) * width;
        const y = (u.y / 100) * height;

        // точка
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = u.color;
        ctx.fill();

        // label
        ctx.fillStyle = "#fff";
        ctx.font = "10px sans-serif";
        ctx.fillText(`UE${i + 1}`, x + 8, y + 4);
      });
    }

    function loop() {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    }

    loop();

    return () => cancelAnimationFrame(animationId);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%" }}
    />
  );
}