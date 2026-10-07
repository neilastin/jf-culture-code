"use client";

import { MOTION_REDUCED } from "./gsap";

/**
 * Tiny toolkit for Easter eggs: a toast message and a dependency-free
 * confetti burst in brand colours. Confetti is skipped with reduced motion.
 */

export const EGG_EVENT = "jf-egg";

export function announceEgg(message: string): void {
  window.dispatchEvent(new CustomEvent<string>(EGG_EVENT, { detail: message }));
}

const COLOURS = ["#47ffce", "#d4ff8b", "#675fec", "#f4c625", "#5f65ae", "#9cd6c5", "#ffffff"];

type Piece = { x: number; y: number; vx: number; vy: number; size: number; spin: number; angle: number; colour: string; round: boolean };

export function confetti(origin?: { x: number; y: number }, amount = 160): void {
  if (window.matchMedia(MOTION_REDUCED).matches) return;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:80";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.remove();
  ctx.scale(dpr, dpr);

  const ox = origin?.x ?? window.innerWidth / 2;
  const oy = origin?.y ?? window.innerHeight * 0.6;
  const pieces: Piece[] = Array.from({ length: amount }, (_, i) => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
    const speed = 500 + Math.random() * 700;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 8,
      spin: (Math.random() - 0.5) * 14,
      angle: Math.random() * Math.PI,
      colour: COLOURS[i % COLOURS.length],
      round: i % 3 === 0,
    };
  });

  let last = performance.now();
  const started = last;
  const frame = (t: number) => {
    const dt = Math.min(0.033, (t - last) / 1000);
    last = t;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of pieces) {
      p.vy += 1400 * dt;
      p.vx *= 1 - 1.2 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.angle += p.spin * dt;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.colour;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    }
    if (t - started < 3200) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
