"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * How much of each line shows, measured in cap heights. The bottom line is
 * whole; the lines above are cropped from below, so only the tops of the
 * letters peek out, as on the print back cover.
 */
const ROWS = [0.36, 0.7, 1];
const GAP = "0.12cap";

type Props = {
  text: string;
  className?: string;
  /** "inView" rises the lines in with Framer Motion; "external" leaves `data-settle-line` for a GSAP timeline. */
  reveal?: "inView" | "external";
};

/** The stacked, cropped NEVER SETTLE repeat. Decorative: pair it with real text for screen readers. */
export function NeverSettle({ text, className, reveal = "inView" }: Props) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("font-display leading-none whitespace-nowrap", className)}
      initial={reveal === "inView" ? "hidden" : undefined}
      whileInView={reveal === "inView" ? "shown" : undefined}
      viewport={{ once: true, amount: 0.6 }}
    >
      {ROWS.map((fraction, i) => (
        <span
          key={i}
          className="block overflow-hidden"
          style={fraction < 1 ? { height: `${fraction}cap`, marginBottom: GAP } : undefined}
        >
          <motion.span
            data-settle-line
            className="block [text-box:trim-both_cap_alphabetic]"
            variants={{
              hidden: { y: "110%" },
              shown: { y: 0, transition: { type: "spring", stiffness: 160, damping: 18, delay: (ROWS.length - 1 - i) * 0.12 } },
            }}
          >
            {text}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
