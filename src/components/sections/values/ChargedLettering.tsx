"use client";

import { motion, useAnimate, type Variants } from "framer-motion";
import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { confetti } from "@/lib/eggs";
import { MOTION_REDUCED } from "@/lib/gsap";
import { Hint, useHint } from "@/components/ui/Hint";
import { MediaImage } from "@/components/ui/MediaImage";

/* Sparks around the lettering: position (% of the lettering box), size, angle and flicker delay. */
const SPARKS = [
  { left: "-4%", top: "8%", size: "7%", rotate: -30, delay: 0 },
  { left: "30%", top: "-14%", size: "6%", rotate: 10, delay: 0.7 },
  { left: "74%", top: "-12%", size: "7%", rotate: 35, delay: 1.5 },
  { left: "99%", top: "22%", size: "6.5%", rotate: 70, delay: 0.35 },
  { left: "96%", top: "84%", size: "6%", rotate: 120, delay: 1.1 },
  { left: "48%", top: "102%", size: "5.5%", rotate: 170, delay: 1.9 },
  { left: "-3%", top: "78%", size: "6%", rotate: -110, delay: 2.3 },
];

/* Speed lines trailing the lettering as it dashes in. */
const STREAKS = ["18%", "42%", "64%", "84%"];

/* The box itself is the in-view trigger: the lettering starts far off to the left, where it would never count as "in view". */
const dash: Variants = {
  waiting: { opacity: 0, x: "-70%", skewX: 28 },
  here: { opacity: 1, x: "0%", skewX: 0, transition: { type: "spring", stiffness: 210, damping: 11, mass: 0.8, opacity: { duration: 0.2 } } },
};
const streak: Variants = {
  waiting: { scaleX: 1, opacity: 0.9 },
  here: (i: number) => ({ scaleX: 0, opacity: 0, transition: { type: "tween", duration: 0.55, delay: 0.12 + i * 0.04, ease: "easeOut" } }),
};

function Spark({ style, delay }: { style: CSSProperties; delay: number }) {
  return (
    <svg viewBox="0 0 20 32" aria-hidden="true" className="spark absolute overflow-visible" style={{ ...style, animationDelay: `${delay}s` }}>
      <path d="M11 1 L4 15 L11 15 L6 31" fill="none" stroke="var(--color-lime)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 1 L4 15 L11 15 L6 31" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * "PROACTIVE / MAKE IT HAPPEN" with restless energy: it dashes in with speed
 * lines, crackles with sparks, fidgets every few seconds as if it can't sit
 * still, and gives a jolt when tapped.
 */
export function ChargedLettering() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const boxRef = useRef<HTMLDivElement>(null);
  const [surge, setSurge] = useState(false);
  const [hint, dismissHint] = useHint(boxRef, 3200);

  const jolt = async (e: MouseEvent<HTMLButtonElement>) => {
    dismissHint();
    setSurge(true);
    window.setTimeout(() => setSurge(false), 900);
    confetti({ x: e.clientX, y: e.clientY }, 36);
    if (window.matchMedia(MOTION_REDUCED).matches) return;
    await animate(
      scope.current,
      { y: ["0%", "-12%", "0%", "-4%", "0%"], rotate: [0, -3, 2, -1, 0], scale: [1, 1.08, 0.97, 1.02, 1] },
      { type: "tween", duration: 0.6, ease: "easeOut" },
    );
  };

  return (
    <motion.div ref={boxRef} className="relative h-full w-full" initial="waiting" whileInView="here" viewport={{ once: true, amount: 0.5 }}>
      <motion.div className="absolute inset-0" variants={dash}>
        {STREAKS.map((top, i) => (
          <motion.span
            key={top}
            custom={i}
            variants={streak}
            aria-hidden="true"
            className="absolute right-[96%] h-[3.5%] origin-right rounded-full bg-lime"
            style={{ top, width: `${38 - i * 6}%` }}
          />
        ))}

        <div ref={scope} className="absolute inset-0">
          <div className="absolute inset-0 motion-safe:animate-restless">
            <MediaImage name="lettering/proactive" alt="" fill sizes="(min-width: 1024px) 50vw, 95vw" className="object-fill" />
            <div className={surge ? "sparks-surge" : undefined}>
              {SPARKS.map((s) => (
                <Spark key={`${s.left}-${s.top}`} delay={s.delay} style={{ left: s.left, top: s.top, width: s.size, rotate: `${s.rotate}deg` }} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <button type="button" onClick={jolt} aria-label="Give Proactive a jolt" className="pointer-events-auto absolute inset-0 cursor-pointer rounded-3xl" />
      <Hint show={hint} tone="light" className="absolute -bottom-10 left-1/2 -translate-x-1/2 sm:-bottom-12">
        Tap for a jolt
      </Hint>
    </motion.div>
  );
}
