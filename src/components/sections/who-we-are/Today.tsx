"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { whoWeAre } from "@/content/code";
import { FOUNDED, todayStats } from "@/content/site";
import { cn } from "@/lib/cn";
import { RevealText } from "@/components/motion/RevealText";
import { MediaImage } from "@/components/ui/MediaImage";
import { RightNow } from "./RightNow";

const TILE_COLOURS = ["bg-teal", "bg-lime", "bg-mint", "bg-gold"];
const DAY = 24 * 60 * 60 * 1000;
const format = (n: number) => n.toLocaleString("en-GB");

/** Counts up from zero when it scrolls into view (instantly with reduced motion). */
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  // Reduced motion still runs through here, with no duration, so render output never depends on it.
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: reduce ? 0 : 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular-nums" aria-hidden="true">
      {format(shown)}
    </span>
  );
}

/** Current time in whole seconds, ticking; null during server render and hydration. */
const subscribeToSeconds = (onTick: () => void) => {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
};
function useSecondClock(): number | null {
  return useSyncExternalStore(
    subscribeToSeconds,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}

/** How old Journey Further is, live, counted from the founding date. */
function DaysOld() {
  const seconds = useSecondClock();
  const founded = new Date(`${FOUNDED}T00:00:00`).getTime();
  const age = seconds === null ? null : seconds * 1000 - founded;
  const days = age === null ? null : Math.floor(age / DAY);
  const rest = age === null ? 0 : age % DAY;
  const pad = (n: number) => String(n).padStart(2, "0");
  const clock = `${pad(Math.floor(rest / 3_600_000))}:${pad(Math.floor(rest / 60_000) % 60)}:${pad(Math.floor(rest / 1000) % 60)}`;

  return (
    <>
      <p className="font-display text-[clamp(2.2rem,5.4vw,4.6rem)] leading-none">
        {days === null ? <span aria-hidden="true">&nbsp;</span> : <Counter value={days} />}
        {days !== null && <span className="sr-only">{format(days)} days</span>}
      </p>
      <p className="mt-2 text-base font-bold sm:text-xl">days young</p>
      <p className="mt-1 font-mono text-sm font-bold tabular-nums opacity-75" aria-hidden="true">
        {days === null ? " " : `+ ${clock} and counting`}
      </p>
    </>
  );
}

function Tile({ index, children }: { index: number; children: ReactNode }) {
  return (
    <li
      className={cn(
        "flex min-h-40 flex-col items-center justify-center rounded-3xl p-5 text-center transition-transform duration-500 ease-[var(--ease-spring)] hover:-translate-y-2 hover:-rotate-1 sm:min-h-44 sm:p-6",
        TILE_COLOURS[index],
      )}
    >
      {children}
    </li>
  );
}

/**
 * Today: the copy beside its heading, then the team photo and the counters
 * as one block, then a live look at every office in its own panel.
 */
export function Today() {
  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-8 lg:pb-28">
        {/* Heading, a big lead line, then the detail: stacked and kept to a comfortable measure at every width. */}
        <div className="max-w-4xl space-y-4">
          <RevealText as="h3" className="font-display text-3xl sm:text-5xl">
            {whoWeAre.today.heading}
          </RevealText>
          <RevealText className="text-xl leading-snug font-semibold sm:text-2xl lg:text-[1.7rem]">{whoWeAre.today.body[0]}</RevealText>
          <RevealText className="text-lg leading-relaxed text-ink/85 sm:text-xl">{whoWeAre.today.body[1]}</RevealText>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <li className="relative col-span-2 min-h-64 overflow-hidden rounded-3xl shadow-lg sm:min-h-80 lg:row-span-2 lg:min-h-0">
            <MediaImage
              name="photos/today-all-hands"
              alt="The team gathered for a company presentation in the Leeds office"
              fill
              sizes="(min-width: 1024px) 680px, 92vw"
              className="object-cover"
            />
          </li>
          {todayStats.map((stat, i) => (
            <Tile key={stat.label} index={i}>
              <p className="font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-none">
                <Counter value={stat.value} />
                <span className="sr-only">
                  {stat.value} {stat.label}
                </span>
              </p>
              <p aria-hidden="true" className="mt-2 text-base font-bold sm:text-xl">
                {stat.label}
              </p>
            </Tile>
          ))}
          <Tile index={3}>
            <DaysOld />
          </Tile>
        </ul>

        <RightNow />
      </div>
    </div>
  );
}
