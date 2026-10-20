"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { values, valueOrder } from "@/content/code";
import type { ValueId } from "@/content/types";
import { announceEgg } from "@/lib/eggs";
import { MOTION_REDUCED } from "@/lib/gsap";

const STYLE: Record<ValueId, string> = {
  together: "bg-together text-white",
  open: "bg-sage text-charcoal",
  proactive: "bg-lime text-ink",
};

/* Each value appears twice: its name (big) and its strapline (smaller). Sizes are for a 700px-wide box. */
const BODIES = valueOrder.flatMap((id) => [
  { id, label: values[id].name, size: 168 },
  { id, label: values[id].strapline, size: 124 },
]);

const DESIGN_WIDTH = 700;
const GRAVITY = 2200;
const BOUNCE = 0.62;
const AIR = 0.6;

/** `inside` turns true once a value has dropped into the box; only then does the lid hold it in. */
type Body = { x: number; y: number; vx: number; vy: number; r: number; dragging: boolean; inside: boolean };

/**
 * Values gravity: drag and throw the values around. Switch gravity off and
 * they drift away, which is exactly the point. The values drop in when the
 * box scrolls into view, and the simulation sleeps while it's off screen.
 */
export function ValuesGravity() {
  const boxRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const gravityOn = useRef(true);
  const [gravity, setGravity] = useState(true);
  const drag = useRef<{ index: number; dx: number; dy: number; lastX: number; lastY: number; lastT: number } | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reduced = window.matchMedia(MOTION_REDUCED).matches;
    let w = box.clientWidth;
    let h = box.clientHeight;
    const scale = () => Math.max(0.55, Math.min(1.25, w / DESIGN_WIDTH));
    const sizeAll = () =>
      bodies.current.forEach((b, i) => {
        b.r = (BODIES[i].size * scale()) / 2;
        const el = refs.current[i];
        if (el) el.style.width = `${b.r * 2}px`;
      });

    // Start above the box (or already resting on the floor with reduced motion).
    bodies.current = BODIES.map((_, i) => ({
      x: ((i + 0.5) / BODIES.length) * w,
      y: reduced ? h : -120 - i * 90,
      vx: reduced ? 0 : (i - 2.5) * 40,
      vy: 0,
      r: 0,
      dragging: false,
      inside: reduced,
    }));
    sizeAll();
    if (reduced) bodies.current.forEach((b) => (b.y = h - b.r));

    let last = 0;
    let frame = 0;
    let running = false;
    const draw = () =>
      bodies.current.forEach((b, i) => {
        const el = refs.current[i];
        if (el) el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`;
      });

    const loop = (t: number) => {
      const dt = last ? Math.min(0.033, (t - last) / 1000) : 0;
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
        if (b.y - b.r >= 0) b.inside = true;
        if (b.inside && b.y - b.r < 0) {
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
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    draw();
    const visible = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.2 });
    visible.observe(box);

    const resize = new ResizeObserver(() => {
      w = box.clientWidth;
      h = box.clientHeight;
      sizeAll();
      if (!running) draw();
    });
    resize.observe(box);
    return () => {
      stop();
      visible.disconnect();
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
      <div className="relative">
        {/* The gravity switch sits in the corner of the play area, part of the toy rather than a header. */}
        <button
          type="button"
          role="switch"
          aria-checked={gravity}
          onClick={toggleGravity}
          className="absolute top-3 right-3 z-10 inline-flex items-center gap-2.5 rounded-full bg-ink py-1.5 pr-1.5 pl-3.5 text-xs font-extrabold text-white shadow-lg transition-transform hover:scale-105 sm:top-4 sm:right-4 sm:text-sm"
        >
          Gravity
          <span className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${gravity ? "bg-lime" : "bg-white/25"}`}>
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ease-[var(--ease-spring)] ${gravity ? "translate-x-5" : ""}`}
            />
          </span>
        </button>
        <div
          ref={boxRef}
          aria-hidden="true"
          className="relative h-[380px] touch-none overflow-hidden rounded-[1.75rem] bg-white/45 shadow-[inset_0_2px_12px_rgb(0_0_0/0.08)] sm:h-[460px] lg:h-[520px]"
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
              className={`font-display absolute top-0 left-0 grid aspect-square cursor-grab place-items-center rounded-full p-3 text-center text-[clamp(0.62rem,1.35vw,1.1rem)] leading-tight shadow-xl select-none active:cursor-grabbing ${STYLE[b.id]}`}
              style={{ width: `${(b.size / DESIGN_WIDTH) * 100}%`, transform: "translate3d(-400px,-400px,0)" }}
            >
              {b.label}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-base font-bold text-ink/80">
        <span aria-hidden="true" className="text-xl motion-safe:animate-float">
          👆
        </span>
        Grab a value and throw it. They always find their footing.
      </p>
    </div>
  );
}
