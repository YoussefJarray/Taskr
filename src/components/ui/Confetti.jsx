import { useEffect, useRef } from "react";

const COLORS = ["#8B5CF6", "#EC4899", "#06B6D4", "#F59E0B", "#10B981", "#F97316", "#6366F1"];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

/**
 * Full-screen confetti burst. Renders a canvas overlay and self-destructs.
 * @param {number} count - number of confetti particles
 */
export default function Confetti({ count = 80 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: count }, () => ({
      x: randomBetween(0, canvas.width),
      y: randomBetween(-canvas.height * 0.3, -20),
      w: randomBetween(4, 10),
      h: randomBetween(4, 10),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: randomBetween(-3, 3),
      vy: randomBetween(2, 6),
      rot: Math.random() * 360,
      rv: randomBetween(-5, 5),
      opacity: 1,
    }));

    let frame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rot += p.rv;
        if (p.y > canvas.height + 20) { p.opacity -= 0.02; }
        if (p.opacity <= 0) continue;
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    />
  );
}
