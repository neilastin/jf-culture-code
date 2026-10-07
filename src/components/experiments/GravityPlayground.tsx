"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { values, valueOrder } from "@/content/code";
import type { ValueId } from "@/content/types";
import { announceEgg } from "@/lib/eggs";

const STYLE: Record<ValueId, string> = {
  together: "bg-together text-white",
  open: "bg-sage text-charcoal",
  proactive: "bg-lime text-ink",
};

/* Each value appears twice: its name (big) and its strapline (smaller). */
const BODIES = valueOrder.flatMap((id) => [
  { id, label: values[id].name, size: 150 },
  { id, label: values[id].strapline, size: 112 },
]);

const GRAVITY = 2200;
const BOUNCE = 0.62;
const AIR = 0.6;

type Body = { x: number; y: number; vx: number; vy: number; r: number; dragging: boolean };

/**
 * Values gravity playground: drag and throw the values around. Switch
 * gravity off and they drift away, which is exactly the point.
 */
export function GravityPlayground() {
  const boxRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const gravityOn = useRef(true);
  const [gravity, setGravity] = useState(true);
  const drag = useRef<{ index: number; dx: number; dy: number; lastX: number; lastY: number; lastT: number } | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let w = box.clientWidth;
    let h = box.clientHeight;
    const scale = () => Math.min(1, w / 600);
    bodies.current = BODIES.map((b, i) => ({
      x: ((i + 0.5) / BODIES.length) * w,
      y: 80 + (i % 2) * 90,
      vx: (i - 2.5) * 30,
      vy: 0,
      r: (b.size * scale()) / 2,
      dragging: false,
    }));

    let last = performance.now();
    let frame = 0;
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;
      const list = bodies.current;
      for (const b of list) {
        if (b.dragging) continue;
        if (gravityOn.current) b.vy += GRAVITY * dt;
        else {
          b.vy -= 30 * dt;
          b.vx += Math.sin(t / 900 + b.r) * 12 * dt;
        }
        b.vx *= Math.exp(-AIR * dt);
        b.vy *= Math.exp(-AIR * 0.5 * dt);
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.y + b.r > h) {
          b.y = h - b.r;
          b.vy = -Math.abs(b.vy) * BOUNCE;
          b.vx *= 0.96;
        }
        if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy = Math.abs(b.vy) * BOUNCE;
        }
        if (b.x - b.r < 0 || b.x + b.r > w) {
          b.x = Math.max(b.r, Math.min(w - b.r, b.x));
          b.vx = -b.vx * BOUNCE;
        }
      }
      // Circle collisions: push apart and exchange momentum along the contact normal.
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const overlap = a.r + b.r - dist;
          if (overlap <= 0) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          const ma = a.dragging ? 1e6 : a.r * a.r;
          const mb = b.dragging ? 1e6 : b.r * b.r;
          const total = ma + mb;
          a.x -= nx * overlap * (mb / total);
          a.y -= ny * overlap * (mb / total);
          b.x += nx * overlap * (ma / total);
          b.y += ny * overlap * (ma / total);
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rel < 0) {
            const impulse = (-(1 + BOUNCE) * rel) / (1 / ma + 1 / mb);
            a.vx -= (impulse / ma) * nx;
            a.vy -= (impulse / ma) * ny;
            b.vx += (impulse / mb) * nx;
            b.vy += (impulse / mb) * ny;
          }
        }
      }
      list.forEach((b, i) => {
        const el = refs.current[i];
        if (el) el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`;
      });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const resize = new ResizeObserver(() => {
      w = box.clientWidth;
      h = box.clientHeight;
      bodies.current.forEach((b, i) => (b.r = (BODIES[i].size * scale()) / 2));
    });
    resize.observe(box);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
    };
  }, []);

  const local = (e: PointerEvent) => {
    const rect = boxRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (i: number, e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = local(e);
    const b = bodies.current[i];
    b.dragging = true;
    drag.current = { index: i, dx: b.x - p.x, dy: b.y - p.y, lastX: p.x, lastY: p.y, lastT: e.timeStamp };
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const p = local(e);
    const now = e.timeStamp;
    const b = bodies.current[d.index];
    const dt = Math.max(0.008, (now - d.lastT) / 1000);
    b.vx = (p.x - d.lastX) / dt;
    b.vy = (p.y - d.lastY) / dt;
    b.x = p.x + d.dx;
    b.y = p.y + d.dy;
    Object.assign(d, { lastX: p.x, lastY: p.y, lastT: now });
  };

  const onUp = () => {
    const d = drag.current;
    if (!d) return;
    bodies.current[d.index].dragging = false;
    drag.current = null;
  };

  const toggleGravity = () => {
    gravityOn.current = !gravityOn.current;
    setGravity(gravityOn.current);
    if (!gravityOn.current) announceEgg("Without our values, everything drifts. Switch gravity back on.");
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-bold text-ink/80">Drag and throw the values. They always find their footing.</p>
        <button
          type="button"
          aria-pressed={!gravity}
          onClick={toggleGravity}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-extrabold text-white transition-transform hover:scale-105"
        >
          {gravity ? "Switch gravity off" : "Switch gravity back on"}
        </button>
      </div>
      <div
        ref={boxRef}
        className="relative h-[460px] touch-none overflow-hidden rounded-[2rem] bg-mint sm:h-[520px]"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {BODIES.map((b, i) => (
          <div
            key={b.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onPointerDown={(e) => onDown(i, e)}
            className={`font-display absolute top-0 left-0 grid cursor-grab place-items-center rounded-full p-3 text-center text-[clamp(0.6rem,1.3vw,0.95rem)] leading-tight shadow-xl select-none active:cursor-grabbing ${STYLE[b.id]}`}
            style={{ width: `min(${b.size}px, ${(b.size / 600) * 100}%)`, aspectRatio: "1", transform: "translate3d(-300px,0,0)" }}
          >
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}
