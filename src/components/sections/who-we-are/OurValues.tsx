"use client";

import { motion, type Variants } from "framer-motion";
import { whoWeAre } from "@/content/code";
import { valueMeta } from "@/content/site";
import type { ValueId } from "@/content/types";
import { cn } from "@/lib/cn";
import { RevealText } from "@/components/motion/RevealText";

const CARD_STYLE: Record<ValueId, string> = {
  together: "bg-together text-white",
  open: "bg-mint text-ink",
  proactive: "bg-lime-field text-ink",
};

const letter: Variants = {
  rest: { y: 0, rotate: 0 },
  hover: (i: number) => ({
    y: [0, -14, 0],
    rotate: [0, i % 2 ? 6 : -6, 0],
    transition: { type: "tween", duration: 0.45, delay: i * 0.035, ease: "easeOut" },
  }),
};

/**
 * Print page 7, set plainly as the approved fix: Together, Open, Proactive.
 * Each card's letters bounce on hover.
 */
export function OurValues() {
  const { values } = whoWeAre;
  const ids: ValueId[] = ["together", "open", "proactive"];
  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-8 lg:pb-24">
        <RevealText as="h3" className="font-display text-3xl sm:text-5xl">
          {values.heading}
        </RevealText>
        <RevealText className="mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl">{values.body}</RevealText>

        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {ids.map((id, cardIndex) => {
            const meta = valueMeta[id];
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: "spring", stiffness: 160, damping: 16, delay: cardIndex * 0.12 }}
              >
                <motion.div
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  className={cn(
                    "flex h-full min-h-56 flex-col justify-between rounded-[2rem] p-7 shadow-lg transition-[transform,box-shadow] duration-500 ease-[var(--ease-spring)] hover:-translate-y-2 hover:shadow-2xl sm:p-9",
                    CARD_STYLE[id],
                  )}
                >
                  <span className="font-display flex text-[clamp(2.2rem,11vw,3.4rem)] md:text-[clamp(1.1rem,2.5vw,3rem)]">
                    <span className="sr-only">{meta.label}</span>
                    {meta.label.split("").map((ch, i) => (
                      <motion.span key={i} custom={i} variants={letter} className="inline-block" aria-hidden="true">
                        {ch}
                      </motion.span>
                    ))}
                  </span>
                  <span className="mt-10 text-xl font-bold sm:text-2xl">{meta.strapline}</span>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
