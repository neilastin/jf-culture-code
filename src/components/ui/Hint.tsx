"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/cn";
import { TapIcon } from "./Icons";

/**
 * Shows a hint a little while after `target` scrolls into view, until the
 * visitor has tried the feature (call `dismiss`). Hints never come back once dismissed.
 */
export function useHint(target: RefObject<Element | null>, delay = 1800): [boolean, () => void] {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = target.current;
    if (!el || done) return;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry.isIntersecting) timer = window.setTimeout(() => setShow(true), delay);
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [target, delay, done]);

  const dismiss = useCallback(() => {
    setDone(true);
    setShow(false);
  }, []);

  return [show && !done, dismiss];
}

type Props = {
  show: boolean;
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
};

/**
 * A small, quiet "try me" pill. Decorative (the control it points at has its
 * own label), so it's hidden from screen readers.
 */
export function Hint({ show, children, className, tone = "dark" }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          aria-hidden="true"
          className={cn(
            "pointer-events-none z-20 inline-flex items-center gap-1.5 rounded-full py-1.5 pr-3.5 pl-2.5 text-xs font-extrabold whitespace-nowrap shadow-lg sm:text-sm",
            tone === "dark" ? "bg-ink text-lime" : "bg-white text-ink",
            className,
          )}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <TapIcon className="h-5 w-5 motion-safe:animate-tap" />
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
