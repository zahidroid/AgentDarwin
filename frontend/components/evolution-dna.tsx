"use client";

import { useEffect, useRef } from "react";

interface EvolutionDnaProps {
  label?: string;
  size?: number;
}

export function EvolutionDna({ label = "Evolving…", size = 80 }: EvolutionDnaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size * 2;

    let frame = 0;
    let raf: number;

    const teal   = "#00d4aa";
    const amber  = "#f59e0b";
    const violet = "#8b5cf6";
    const strands = [teal, amber, violet];

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const h  = canvas.height;
      const t  = frame * 0.04;

      // Draw 3 DNA strands with staggered phase
      for (let s = 0; s < 3; s++) {
        const phase = (s * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.strokeStyle = strands[s];
        ctx.lineWidth = 2;
        ctx.shadowColor = strands[s];
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.85;

        for (let y = 0; y <= h; y += 2) {
          const angle = (y / h) * Math.PI * 4 + t + phase;
          const x = cx + Math.cos(angle) * (size * 0.35);
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw rungs (connections between strands)
      ctx.globalAlpha = 0.4;
      const rungSpacing = 18;
      for (let y = rungSpacing; y < h; y += rungSpacing) {
        const a1 = (y / h) * Math.PI * 4 + t;
        const a2 = a1 + (Math.PI * 2) / 3;
        const x1 = cx + Math.cos(a1) * (size * 0.35);
        const x2 = cx + Math.cos(a2) * (size * 0.35);
        ctx.beginPath();
        ctx.strokeStyle = teal;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 4;
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      frame++;
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={canvasRef} style={{ width: size, height: size * 2 }} />
      <p className="text-xs font-semibold text-[#00d4aa] tracking-widest uppercase animate-live">
        {label}
      </p>
    </div>
  );
}
