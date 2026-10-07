"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { useStories } from "./StoriesProvider";

/** Moderation demo: shows how the People team would approve, feature or remove stories. */
export function AdminBar() {
  const { admin, setAdmin, stories, receiveIncoming, resetDemo, setFilters } = useStories();
  const scrollTo = useScrollTo();
  const pending = stories.filter((s) => s.status === "pending").length;

  return (
    <AnimatePresence>
      {admin && (
        <motion.aside
          aria-label="Moderation demo"
          className="focus-light fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-3xl flex-wrap items-center gap-2 rounded-3xl bg-purple p-3 text-white shadow-2xl sm:rounded-full sm:pl-6"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <p className="mr-auto text-sm font-extrabold">
            Moderation mode · <span className="tabular-nums">{pending}</span> pending
          </p>
          <button
            type="button"
            onClick={() => {
              setFilters((f) => ({ ...f, query: "" }));
              scrollTo("values-in-the-wild");
            }}
            className="rounded-full bg-white/15 px-3 py-2 text-xs font-extrabold hover:bg-white/25"
          >
            Review stories
          </button>
          <button type="button" onClick={() => receiveIncoming()} className="rounded-full bg-white/15 px-3 py-2 text-xs font-extrabold hover:bg-white/25">
            Simulate a new story
          </button>
          <button type="button" onClick={resetDemo} className="rounded-full bg-white/15 px-3 py-2 text-xs font-extrabold hover:bg-white/25">
            Reset demo
          </button>
          <button type="button" onClick={() => setAdmin(false)} className="rounded-full bg-white px-3 py-2 text-xs font-extrabold text-purple">
            Exit
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
