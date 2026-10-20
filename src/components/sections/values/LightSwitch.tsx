"use client";

import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { values } from "@/content/code";
import { cn } from "@/lib/cn";
import { announceEgg, confetti } from "@/lib/eggs";
import { MOTION_REDUCED } from "@/lib/gsap";
import { MediaImage } from "@/components/ui/MediaImage";

const DISCO_FLIPS = 6;
const DISCO_WINDOW_MS = 4000;
const DISCO_MS = 6000;

/**
 * Print page 25, made literal: nothing happens unless someone makes it happen.
 * The section starts in the dark with only the switch in a pool of light.
 * Press it and the hand flips it from "Waiting to act" to "Make it happen",
 * and the light floods out from the switch to reveal everything around it.
 * Easter egg: flip it six times in quick succession for disco mode.
 */
export function LightSwitch() {
  const v = values.proactive;
  const [on, setOn] = useState(false);
  const [disco, setDisco] = useState(false);
  const flips = useRef<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const [switchScope, animate] = useAnimate<HTMLDivElement>();

  // Keep the pool of light centred on the switch, wherever the layout puts it.
  useEffect(() => {
    const section = sectionRef.current;
    const dark = darkRef.current;
    const target = switchScope.current;
    if (!section || !dark || !target) return;
    const place = () => {
      const s = section.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      dark.style.setProperty("--lx", `${t.left - s.left + t.width / 2}px`);
      dark.style.setProperty("--ly", `${t.top - s.top + t.height / 2}px`);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(section);
    return () => observer.disconnect();
  }, [switchScope]);

  const flip = async (e: MouseEvent<HTMLButtonElement>) => {
    const next = !on;
    const now = Date.now();
    flips.current = [...flips.current.filter((t) => now - t < DISCO_WINDOW_MS), now];
    if (flips.current.length >= DISCO_FLIPS && !disco) {
      flips.current = [];
      setDisco(true);
      setOn(true);
      confetti({ x: e.clientX, y: e.clientY }, 120);
      announceEgg("Disco mode 🪩 You really did make it happen.");
      window.setTimeout(() => setDisco(false), DISCO_MS);
      return;
    }
    if (window.matchMedia(MOTION_REDUCED).matches) {
      setOn(next);
      return;
    }
    // The hand pushes in, the switch clicks over at the bottom of the press, then everything springs back.
    await animate(switchScope.current, { scale: 0.95, x: "-2%", y: "1.5%" }, { type: "tween", duration: 0.12, ease: "easeIn" });
    setOn(next);
    if (next) confetti({ x: e.clientX, y: e.clientY }, 40);
    await animate(switchScope.current, { scale: 1, x: "0%", y: "0%" }, { type: "spring", stiffness: 500, damping: 14 });
  };

  const [first, second] = v.blocks;
  const lit = on || disco;

  return (
    <div
      ref={sectionRef}
      className={cn("relative isolate overflow-hidden bg-lime-field text-ink", disco && "motion-safe:animate-[disco_1.6s_linear_infinite]")}
    >
      <AnimatePresence>
        {lit && (
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
        <div className="order-2 lg:order-none">
          <h3 className="font-display text-2xl sm:text-4xl">{first.heading}</h3>
          {first.body.map((p, i) => (
            <p key={i} className="mt-5 text-lg leading-relaxed sm:text-xl">
              {p}
            </p>
          ))}
          <MediaImage
            name="photos/active-contribution"
            alt="A colleague laughing at her desk"
            sizes="(min-width: 1024px) 420px, 92vw"
            className="mt-8 h-auto w-full rounded-3xl shadow-xl"
          />
        </div>

        <div className="relative z-20 order-1 flex flex-col items-center lg:order-none">
          <p
            className={cn(
              "font-display max-w-sm text-center text-xl leading-tight transition-colors duration-700 sm:text-2xl",
              lit ? "text-ink" : "text-white",
            )}
          >
            {lit ? "That's how it works here." : "Nothing happens until someone makes it happen."}
          </p>

          <div className="relative mt-8 w-full max-w-[400px]">
            <AnimatePresence>
              {lit && (
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
            <div ref={switchScope} className="relative">
              <div className={cn(!lit && "motion-safe:animate-[nudge_5s_ease-in-out_2s_infinite]")}>
                <button type="button" aria-pressed={on} onClick={flip} className="relative block w-full cursor-pointer rounded-[2rem]">
                  <span className="sr-only">
                    {on ? "Switch the lights off" : "Flip the switch to make it happen"}. {v.pullGraphic.replace(" / ", ". ")}.
                  </span>
                  {/* Only one hand is ever visible: the "off" art hides completely while the switch is on. */}
                  <MediaImage
                    name="illustrations/light-off"
                    alt=""
                    sizes="(min-width: 1024px) 400px, 80vw"
                    className={cn(
                      "h-auto w-full drop-shadow-[0_20px_30px_rgb(0_0_0/0.5)] transition-opacity duration-100",
                      on ? "opacity-0" : "opacity-100",
                    )}
                  />
                  <MediaImage
                    name="illustrations/light-on"
                    alt=""
                    sizes="(min-width: 1024px) 400px, 80vw"
                    className={cn(
                      "absolute inset-0 h-auto w-full drop-shadow-[0_0_50px_rgb(255_255_255/0.9)] transition-opacity duration-100",
                      on ? "opacity-100" : "opacity-0",
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          <p aria-hidden="true" className="font-display mt-6 text-center text-sm">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={lit ? "on" : "off"}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2",
                  lit ? "border-2 border-ink text-ink" : "bg-lime text-ink shadow-[0_0_30px_rgb(212_255_139/0.5)]",
                )}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
              >
                {lit ? (
                  "Lights on. Make it happen ⚡"
                ) : (
                  <>
                    <span className="motion-safe:animate-float">☝️</span> Go on, flip the switch
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>

        <div className="order-3 lg:order-none lg:pt-40">
          <h3 className="font-display text-2xl sm:text-4xl">{second.heading}</h3>
          {second.body.map((p, i) => (
            <p key={i} className="mt-5 text-lg leading-relaxed sm:text-xl">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* The dark. A pool of light sits on the switch; switching on floods it out to everything. */}
      <div ref={darkRef} aria-hidden="true" className={cn("lights-off pointer-events-none absolute inset-0 z-10 bg-[#19181a]", lit && "is-on")} />
    </div>
  );
}
