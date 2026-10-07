"use client";

import { motion } from "framer-motion";
import { ui } from "@/content/site";
import { cn } from "@/lib/cn";
import { useStories } from "@/components/stories/StoriesProvider";
import { PlusIcon } from "@/components/ui/Icons";

/** The "Share a story" call to action. */
export function ShareButton({ compact = false }: { compact?: boolean }) {
  const { openShare } = useStories();
  return (
    <motion.button
      type="button"
      onClick={openShare}
      whileHover={{ scale: 1.05, rotate: -1.5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full bg-lime font-extrabold text-ink shadow-lg",
        compact ? "px-5 py-2.5 text-sm" : "px-7 py-4 text-lg",
      )}
    >
      <span className={cn("grid place-items-center rounded-full bg-ink text-lime transition-transform duration-300 group-hover:rotate-90", compact ? "h-6 w-6" : "h-8 w-8")}>
        <PlusIcon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </span>
      {ui.shareStory}
    </motion.button>
  );
}
