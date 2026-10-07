"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { spotlights } from "@/content/feeds";
import { ui, valueMeta } from "@/content/site";
import { cn } from "@/lib/cn";

/** A rotating card of team member stories, with pause control. */
const ROTATE_MS = 6000;

export function PeopleSpotlight() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % spotlights.length), ROTATE_MS);
    return () => window.clearInterval(t);
  }, [paused]);

  const person = spotlights[index];
  return (
    <section
      aria-labelledby="spotlight-title"
      aria-roledescription="carousel"
      className="relative flex flex-col overflow-hidden rounded-[2rem] bg-together p-6 text-white sm:p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="spotlight-title" className="font-display text-xl sm:text-2xl">
          {ui.spotlightHeading}
        </h3>
        <span className="rounded-full border border-dashed border-white/70 px-2.5 py-1 text-[0.7rem] font-extrabold uppercase">{ui.example}</span>
      </div>

      <div className="relative mt-6 min-h-48 flex-1" aria-live={paused ? "polite" : "off"}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={person.id}
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -40, rotate: -2 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <span className="inline-block rounded-full bg-lime px-3 py-1 text-xs font-extrabold text-ink uppercase">{person.kind}</span>
            <blockquote className="mt-4 text-xl leading-snug font-bold sm:text-2xl">&ldquo;{person.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm text-white">
              {person.name}, {person.role} · {person.office} · {valueMeta[person.value].label}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {spotlights.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Show spotlight ${i + 1} of ${spotlights.length}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setIndex(i)}
            className="group grid h-6 min-w-6 place-items-center"
          >
            <span
              className={cn(
                "block h-2.5 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-lime" : "w-2.5 bg-white/50 group-hover:bg-white",
              )}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="ml-auto rounded-full border-2 border-white/70 px-3 py-1 text-xs font-extrabold hover:bg-white hover:text-together"
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </section>
  );
}
