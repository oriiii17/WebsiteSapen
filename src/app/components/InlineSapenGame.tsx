"use client";

import { useEffect, useRef, useState } from "react";
import { Gamepad2, Trophy } from "lucide-react";

export default function InlineSapenGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sapen_game_hi");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (!isRunning || isGameOver) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let basketX = canvas.width / 2 - 32;
    const basketW = 64;
    const basketH = 14;
    const items: { x: number; y: number; isHazard: boolean }[] = [];
    let reqId = 0;

    const handleMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      basketX = Math.max(0, Math.min(canvas.width - basketW, clientX - rect.left - basketW / 2));
    };
    const onMouse = (event: MouseEvent) => handleMove(event.clientX);
    const onTouch = (event: TouchEvent) => {
      if (event.touches[0]) handleMove(event.touches[0].clientX);
    };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("touchmove", onTouch, { passive: true });

    const spawn = window.setInterval(() => {
      items.push({ x: Math.random() * (canvas.width - 24), y: -10, isHazard: Math.random() < 0.25 });
    }, 550);

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.roundRect(basketX, canvas.height - basketH - 12, basketW, basketH, 7);
      ctx.fill();

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.y += 3.8;
        ctx.beginPath();
        ctx.arc(item.x + 10, item.y + 10, 10, 0, Math.PI * 2);
        ctx.fillStyle = item.isHazard ? "#dc2626" : "#0f766e";
        ctx.fill();

        if (item.y + 18 >= canvas.height - basketH - 12 && item.x + 16 >= basketX && item.x <= basketX + basketW) {
          if (item.isHazard) {
            cancelAnimationFrame(reqId);
            setIsGameOver(true);
            window.clearInterval(spawn);
            return;
          }
          setScore((current) => {
            const next = current + 10;
            setHighScore((best) => {
              const max = Math.max(best, next);
              localStorage.setItem("sapen_game_hi", max.toString());
              return max;
            });
            return next;
          });
          items.splice(i, 1);
          i--;
        } else if (item.y > canvas.height) {
          items.splice(i, 1);
          i--;
        }
      }
      reqId = requestAnimationFrame(update);
    };
    reqId = requestAnimationFrame(update);

    return () => {
      window.clearInterval(spawn);
      cancelAnimationFrame(reqId);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("touchmove", onTouch);
    };
  }, [isRunning, isGameOver]);

  return (
    <div className="game-panel">
      <div className="game-scorebar">
        <span className="game-name"><Gamepad2 aria-hidden="true" size={16} /> Panen Berkah Sapen</span>
        <span className="game-record"><Trophy aria-hidden="true" size={14} /> Rekor: {highScore} Poin</span>
      </div>
      <div className="game-canvas-frame">
        <canvas ref={canvasRef} width={340} height={380} className="game-canvas" aria-label="Area permainan Panen Berkah Sapen" />
        {!isRunning && (
          <div className="game-cover">
            <h4>Mulai Panen Raya</h4>
            <p>Tangkap hasil panen hijau (+10) dan hindari batu merah.</p>
            <button onClick={() => { setIsRunning(true); setScore(0); setIsGameOver(false); }}>Mulai Permainan</button>
          </div>
        )}
        {isGameOver && (
          <div className="game-cover game-cover--result">
            <span className="game-over-label">GAME OVER!</span>
            <div className="game-score">{score}</div>
            <button onClick={() => { setIsGameOver(false); setScore(0); }}>Main Lagi</button>
          </div>
        )}
      </div>
    </div>
  );
}
