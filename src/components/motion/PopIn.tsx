"use client";

import { motion, type Transition } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Starting tilt in degrees, for a bit of personality. */
  tilt?: number;
  /** Starting scale. Lower values give a bigger bounce. */
  from?: number;
  /** Animate on mount instead of when scrolled into view. */
  onMount?: boolean;
};

const spring = (delay: number): Transition => ({
  type: "spring",
  stiffness: 240,
  damping: 12,
  mass: 0.9,
  delay,
  opacity: { duration: 0.35, delay },
});

/**
 * Spring "pop" for hand-lettered headlines: scales up with a slight overshoot.
 * MotionConfig reducedMotion="user" turns this into a plain fade.
 */
export function PopIn({ children, className, delay = 0, tilt = -6, from = 0.55, onMount = false }: Props) {
  const hidden = { opacity: 0, scale: from, rotate: tilt };
  const shown = { opacity: 1, scale: 1, rotate: 0 };
  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(onMount ? { animate: shown } : { whileInView: shown, viewport: { once: true, amount: 0.35 } })}
      transition={spring(delay)}
    >
      {children}
    </motion.div>
  );
}
