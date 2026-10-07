"use client";

import { useEffect, useRef } from "react";
import { valueMeta } from "@/content/site";
import type { ValueId } from "@/content/types";
import { MOTION_REDUCED } from "@/lib/gsap";

const IDS: ValueId[] = ["together", "open", "proactive"];

const BALL_STYLE: Record<ValueId, string> = {
  together: "bg-together text-white",
  open: "bg-sage text-charcoal",
  proactive: "bg-lime text-ink",
};

/* Physics, in pixels and seconds. */
const GRAVITY = 2600;
const BOUNCE = 0.52; // share of speed kept on each bounce
const SETTLE_SPEED = 90; // below this, a landing ball stops bouncing
const FLOAT_LIFT = 22; // upward pull while drifting
const FLOAT_MAX_RISE = 36; // top drift speed
const REST_BEFORE_FLOAT = [3.2, 4.6, 3.9]; // seconds on the ground before each value starts to drift
const DROP_STAGGER = [0.15, 0.4, 0.65];

type Ball = {
  x: number; // centre, from the container's left
  y: number; // height of the ball's bottom above the ground
  vx: number;
  vy: number; // positive is up
  mode: "waiting" | "falling" | "resting" | "floating";
  timer: number;
  squash: number;
  phase: number;
};

/**
 * "Our values are our gravity". Left alone, the values slowly float away;
 * click one and gravity brings it back down to earth, with a bounce.
 */
export function GravityValues() {
  const boxRef = useRef<HTMLDivElement>(null);
  const ballRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const balls = useRef<Ball[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reduced = window.matchMedia(MOTION_REDUCED).matches;
    let width = box.clientWidth;
    let height = box.clientHeight;
    let size = ballRefs.current[0]?.offsetWidth ?? 120;

    const slotX = (i: number) => (width / IDS.length) * (i + 0.5);
    balls.current = IDS.map((_, i) => ({
      x: slotX(i),
      y: reduced ? 0 : height + size,
      vx: 0,
      vy: 0,
      mode: reduced ? "resting" : "waiting",
      timer: reduced ? Infinity : DROP_STAGGER[i],
      squash: 0,
      phase: i * 2.1,
    }));

    const draw = () => {
      balls.current.forEach((b, i) => {
        const el = ballRefs.current[i];
        if (!el) return;
        const squashY = 1 - b.squash;
        const squashX = 1 + b.squash * 0.8;
        const tilt = b.mode === "floating" ? Math.sin(b.phase) * 8 : 0;
        el.style.opacity = b.mode === "waiting" ? "0" : "1";
        el.style.transform = `translate3d(${b.x - size / 2}px, ${-b.y}px, 0) rotate(${tilt}deg) scale(${squashX}, ${squashY})`;
      });
    };

    const step = (dt: number) => {
      const top = height - size;
      for (const [i, b] of balls.current.entries()) {
        b.squash *= Math.exp(-dt * 14);
        if (b.mode === "waiting") {
          b.timer -= dt;
          if (b.timer <= 0) b.mode = "falling";
          continue;
        }
        if (b.mode === "falling") {
          b.vy -= GRAVITY * dt;
          b.y += b.vy * dt;
          b.x += b.vx * dt;
          b.vx *= Math.exp(-dt * 3);
          if (b.y <= 0) {
            b.y = 0;
            const impact = -b.vy;
            b.squash = Math.min(0.28, impact / 4000);
            if (impact < SETTLE_SPEED) {
              b.vy = 0;
              b.mode = "resting";
              b.timer = REST_BEFORE_FLOAT[i];
            } else {
              b.vy = impact * BOUNCE;
            }
          }
          continue;
        }
        if (b.mode === "resting") {
          b.timer -= dt;
          if (b.timer <= 0) {
            b.mode = "floating";
            b.vy = 0;
            b.vx = (i - 1) * 6 + (i === 1 ? 5 : 0);
          }
          continue;
        }
        // Floating: drift up and sideways, bobbing gently once it reaches the top.
        b.phase += dt * 1.3;
        b.vy = Math.min(FLOAT_MAX_RISE, b.vy + FLOAT_LIFT * dt);
        b.y = Math.min(top + Math.sin(b.phase) * 6, b.y + b.vy * dt);
        b.x += (b.vx + Math.sin(b.phase * 0.7) * 10) * dt;
        const min = size / 2;
        const max = width - size / 2;
        if (b.x < min || b.x > max) {
          b.x = Math.max(min, Math.min(max, b.x));
          b.vx = -b.vx;
        }
      }
    };

    let frame = 0;
    let last = 0;
    let running = false;
    const loop = (t: number) => {
      const dt = Math.min(0.033, (t - last) / 1000 || 0);
      last = t;
      step(dt);
      draw();
      if (running) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    // Only simulate while the panel is on screen.
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.2 });
    visibility.observe(box);

    const resize = new ResizeObserver(() => {
      width = box.clientWidth;
      height = box.clientHeight;
      size = ballRefs.current[0]?.offsetWidth ?? size;
      draw();
    });
    resize.observe(box);
    draw();

    return () => {
      stop();
      visibility.disconnect();
      resize.disconnect();
    };
  }, []);

  /** Gravity takes hold: the value drops back to the ground and bounces. */
  const ground = (i: number) => {
    const b = balls.current[i];
    if (!b || b.mode === "resting" || b.mode === "waiting") return;
    b.mode = "falling";
    b.vy = Math.min(b.vy, 0);
    b.vx *= 0.4;
  };

  return (
    <div className="relative mt-10 flex flex-col lg:mt-0">
      <div ref={boxRef} className="relative h-72 sm:h-80 lg:h-full lg:min-h-80">
        {IDS.map((id, i) => (
          <button
            key={id}
            ref={(el) => {
              ballRefs.current[i] = el;
            }}
            type="button"
            onClick={() => ground(i)}
            aria-label={`${valueMeta[id].label}: bring it back down to earth`}
            className={`font-display absolute bottom-0 left-0 grid aspect-square w-[28%] max-w-40 origin-bottom cursor-pointer place-items-center rounded-full text-[clamp(0.7rem,1.5vw,1.05rem)] shadow-xl will-change-transform hover:brightness-110 ${BALL_STYLE[id]}`}
            style={{ transform: "translate3d(-200%, 0, 0)" }}
          >
            {valueMeta[id].label}
          </button>
        ))}
      </div>
      <span aria-hidden="true" className="h-1 rounded-full bg-ink/25" />
      <p className="mt-3 text-center text-sm font-bold text-ink/80">Click a value to keep your feet on the ground.</p>
    </div>
  );
}
