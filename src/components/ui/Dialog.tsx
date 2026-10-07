"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useScrollLock } from "@/components/motion/SmoothScroll";
import { CloseIcon } from "./Icons";

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

/**
 * A native <dialog>: focus trapping, Escape to close and an inert page come
 * for free. Clicking the backdrop closes it too.
 */
export function Dialog({ open, onClose, labelledBy, children, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useScrollLock(open);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[92svh] w-[min(100%-1.5rem,44rem)] overflow-visible rounded-[2rem] bg-transparent p-0 backdrop:bg-ink/75 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      {open && (
        <motion.div
          data-lenis-prevent
          className="relative max-h-[92svh] overflow-y-auto overscroll-contain rounded-[2rem] bg-white text-ink shadow-2xl"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="sticky top-3 right-3 z-20 float-right mt-3 mr-3 grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-lg transition-transform hover:rotate-90"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          {children}
        </motion.div>
      )}
    </dialog>
  );
}
