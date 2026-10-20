"use client";

import { motion, type Variants } from "framer-motion";
import { whoWeAre } from "@/content/code";
import { RevealText } from "@/components/motion/RevealText";
import { ValuesGravity } from "./ValuesGravity";

/** Deterministic scatter so server and client render the same starting positions. */
const word: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: -160 - ((i * 53) % 140),
    x: ((i * 37) % 90) - 45,
    rotate: ((i * 47) % 70) - 35,
  }),
  shown: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 140, damping: 9, mass: 1.1, delay: i * 0.07, opacity: { duration: 0.2, delay: i * 0.07 } },
  }),
};

/**
 * "Our values are our gravity": the heading words fall and settle into place
 * as the panel arrives (the panel is the trigger, because the words start
 * outside the viewport). Below, the values live in a full-width gravity
 * playground with room to throw them around.
 */
export function Obsessive() {
  const { obsessive } = whoWeAre;
  const words = obsessive.heading.split(" ");

  return (
    <div className="bg-paper px-4 pb-20 sm:px-8 lg:pb-32">
      <motion.div
        className="mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] bg-mint px-5 pt-10 pb-8 text-ink sm:px-10 sm:pt-12 sm:pb-10 lg:px-12"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-14">
          <h3 className="font-display text-3xl sm:text-5xl">
            <span className="sr-only">{obsessive.heading}</span>
            {words.map((w, i) => (
              <motion.span key={i} custom={i} variants={word} aria-hidden="true" className="mr-[0.28em] inline-block">
                {w}
              </motion.span>
            ))}
          </h3>
          <RevealText className="mt-6 text-lg leading-relaxed sm:text-xl lg:mt-1" delay={0.3}>
            {obsessive.body}
          </RevealText>
        </div>

        <div className="mt-8 lg:mt-10">
          <ValuesGravity />
        </div>
      </motion.div>
    </div>
  );
}
