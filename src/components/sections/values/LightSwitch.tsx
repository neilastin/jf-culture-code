"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type MouseEvent } from "react";
import { values } from "@/content/code";
import { cn } from "@/lib/cn";
import { announceEgg, confetti } from "@/lib/eggs";
import { RevealText } from "@/components/motion/RevealText";
import { MediaImage } from "@/components/ui/MediaImage";

/**
 * Print page 25. The light switch is a real switch: flipping it powers the
 * whole section up, because acting is the expectation.
 * Easter egg: flip it six times in quick succession for disco mode.
 */
const DISCO_FLIPS = 6;
const DISCO_WINDOW_MS = 4000;
const DISCO_MS = 6000;

export function LightSwitch() {
  const v = values.proactive;
  const [on, setOn] = useState(false);
  const [disco, setDisco] = useState(false);
  const flips = useRef<number[]>([]);

  const flip = (e: MouseEvent<HTMLButtonElement>) => {
    setOn((x) => !x);
    const now = Date.now();
    flips.current = [...flips.current.filter((t) => now - t < DISCO_WINDOW_MS), now];
    if (flips.current.length >= DISCO_FLIPS && !disco) {
      flips.current = [];
      setDisco(true);
      setOn(true);
      confetti({ x: e.clientX, y: e.clientY }, 120);
      announceEgg("Disco mode 🪩 You really did make it happen.");
      window.setTimeout(() => setDisco(false), DISCO_MS);
    }
  };
  const [first, second] = v.blocks;
  const [permission, expectation] = v.pullGraphic.split(" / ");

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-colors duration-700",
        on || disco ? "bg-lime-field text-ink" : "bg-ink text-white",
        disco && "motion-safe:animate-[disco_1.6s_linear_infinite]",
      )}
    >
      <AnimatePresence>
        {on && (
          <motion.div
            aria-hidden="true"
            className="halftone pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[1fr_0.9fr_1fr] lg:gap-10 lg:py-28">
        <div>
          <RevealText as="h3" className="font-display text-2xl sm:text-4xl">
            {first.heading}
          </RevealText>
          {first.body.map((p, i) => (
            <RevealText key={i} className="mt-5 text-lg leading-relaxed sm:text-xl">
              {p}
            </RevealText>
          ))}
          <MediaImage
            name="photos/active-contribution"
            alt="A colleague laughing at her desk"
            sizes="(min-width: 1024px) 420px, 92vw"
            className={cn(
              "mt-8 h-auto w-full rounded-3xl shadow-xl transition-[filter] duration-700",
              on ? "grayscale-0" : "grayscale brightness-75",
            )}
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[420px]">
            <AnimatePresence>
              {on && (
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-[-25%] rounded-full bg-[repeating-conic-gradient(from_0deg,rgb(255_255_255/0.75)_0deg_10deg,transparent_10deg_24deg)] [mask-image:radial-gradient(closest-side,black,transparent)]"
                  initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 140, damping: 14 }}
                />
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              aria-pressed={on}
              onClick={flip}
              className="relative block w-full cursor-pointer rounded-[2rem]"
              whileHover={{ rotate: -2, scale: 1.02 }}
              whileTap={{ scale: 0.94, rotate: 2 }}
              animate={on ? { scale: [1, 1.08, 1], rotate: [0, -4, 0] } : { scale: 1, rotate: 0 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.45 }}
            >
              <span className="sr-only">
                {on ? "Switch off" : "Flip the switch"}: {permission}. {expectation}.
              </span>
              <MediaImage
                name="illustrations/light-switch"
                alt=""
                sizes="(min-width: 1024px) 420px, 80vw"
                className={cn(
                  "h-auto w-full transition-[filter] duration-500",
                  on ? "drop-shadow-[0_0_60px_rgb(255_255_255/0.9)]" : "brightness-90 drop-shadow-[0_20px_30px_rgb(0_0_0/0.5)]",
                )}
              />
            </motion.button>
          </div>

          <p aria-hidden="true" className="font-display mt-6 text-center text-sm">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={on ? "on" : "off"}
                className="inline-block rounded-full border-2 border-current px-4 py-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
              >
                {on ? "Make it happen ⚡" : "Go on, flip it"}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>

        <div className="lg:pt-40">
          <RevealText as="h3" className="font-display text-2xl sm:text-4xl">
            {second.heading}
          </RevealText>
          {second.body.map((p, i) => (
            <RevealText key={i} className="mt-5 text-lg leading-relaxed sm:text-xl">
              {p}
            </RevealText>
          ))}
        </div>
      </div>
    </div>
  );
}
