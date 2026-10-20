"use client";

import { motion, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { whoWeAre } from "@/content/code";
import type { MediaKey } from "@/content/media";
import { valueMeta } from "@/content/site";
import type { ValueId } from "@/content/types";
import { cn } from "@/lib/cn";
import { RevealText } from "@/components/motion/RevealText";
import { Hint, useHint } from "@/components/ui/Hint";
import { MediaImage } from "@/components/ui/MediaImage";

const CARD_STYLE: Record<ValueId, string> = {
  together: "bg-together text-white",
  open: "bg-mint text-ink",
  proactive: "bg-lime-field text-ink",
};

const LETTERING: Record<ValueId, MediaKey> = {
  together: "lettering/value-together",
  open: "lettering/open",
  proactive: "lettering/proactive",
};

const letter: Variants = {
  rest: { y: 0, rotate: 0 },
  hover: (i: number) => ({
    y: [0, -14, 0],
    rotate: [0, i % 2 ? 6 : -6, 0],
    transition: { type: "tween", duration: 0.45, delay: i * 0.035, ease: "easeOut" },
  }),
};

const FACE =
  "flex flex-col rounded-[2rem] p-7 shadow-lg [grid-area:1/1] [backface-visibility:hidden] motion-reduce:transition-opacity motion-reduce:duration-500 sm:p-9";

/**
 * One value card. Tap it and it flips in place to show the value's own
 * hand-lettered graphic, big. Nothing on the page moves, so nobody loses their place.
 */
function ValueCard({ id, index, onFlip }: { id: ValueId; index: number; onFlip: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const meta = valueMeta[id];

  const toggle = () => {
    setFlipped((f) => !f);
    onFlip();
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 160, damping: 16, delay: index * 0.12 }}
      className="[perspective:1400px]"
    >
      <motion.div
        initial="rest"
        animate="rest"
        whileHover="hover"
        className="group relative grid h-full transition-transform duration-500 ease-[var(--ease-spring)] hover:-translate-y-2"
      >
        <motion.div
          className="grid h-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 13 }}
        >
          <div
            inert={flipped}
            className={cn(FACE, "min-h-56 justify-between group-hover:shadow-2xl", CARD_STYLE[id], flipped && "motion-reduce:opacity-0")}
          >
            <span className="font-display flex text-[clamp(2.2rem,11vw,3.4rem)] md:text-[clamp(1.1rem,2.5vw,3rem)]">
              <span className="sr-only">{meta.label}</span>
              {meta.label.split("").map((ch, i) => (
                <motion.span key={i} custom={i} variants={letter} className="inline-block" aria-hidden="true">
                  {ch}
                </motion.span>
              ))}
            </span>
            <span className="mt-10 flex items-end justify-between gap-4">
              <span className="text-xl font-bold sm:text-2xl">{meta.strapline}</span>
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-current/40 text-lg transition-transform duration-500 group-hover:rotate-180"
              >
                ↻
              </span>
            </span>
          </div>

          <div
            inert={!flipped}
            className={cn(
              FACE,
              "items-center justify-center border-4 border-ink bg-white p-5 motion-safe:[transform:rotateY(180deg)] sm:p-6",
              !flipped && "motion-reduce:opacity-0",
            )}
          >
            <MediaImage
              name={LETTERING[id]}
              alt={`${meta.label}: ${meta.strapline}`}
              sizes="(min-width: 768px) 420px, 85vw"
              className="h-auto max-h-48 w-auto max-w-full object-contain"
            />
          </div>
        </motion.div>

        <button
          type="button"
          onClick={toggle}
          aria-pressed={flipped}
          aria-label={flipped ? `Flip ${meta.label} back` : `Flip ${meta.label} for more`}
          className="absolute inset-0 z-10 cursor-pointer rounded-[2rem]"
        />
      </motion.div>
    </motion.li>
  );
}

/**
 * Print page 7, set plainly as the approved fix: Together, Open, Proactive.
 * Each card's letters bounce on hover, and a tap flips it over.
 */
export function OurValues() {
  const { values: intro } = whoWeAre;
  const ids: ValueId[] = ["together", "open", "proactive"];
  const listRef = useRef<HTMLUListElement>(null);
  const [hint, dismissHint] = useHint(listRef, 1600);

  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-8 lg:pb-24">
        <RevealText as="h3" className="font-display text-3xl sm:text-5xl">
          {intro.heading}
        </RevealText>
        <RevealText className="mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl">{intro.body}</RevealText>

        <div className="relative mt-10">
          <Hint show={hint} className="absolute -top-5 right-4">
            Tap a value to flip it
          </Hint>
          <ul ref={listRef} className="grid gap-4 md:grid-cols-3 md:gap-5">
            {ids.map((id, i) => (
              <ValueCard key={id} id={id} index={i} onFlip={dismissHint} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
