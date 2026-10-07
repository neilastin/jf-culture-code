"use client";

import { motion } from "framer-motion";
import { ui, valueMeta } from "@/content/site";
import type { ValueId } from "@/content/types";
import { cn } from "@/lib/cn";
import { createLocalStore, useLocalStore } from "@/lib/localStore";

/* Starting tally so the demo looks lived-in. Labelled as an example in the UI. */
const BASE_TALLY: Record<ValueId, number> = { together: 14, open: 11, proactive: 17 };
const voteStore = createLocalStore<ValueId | null>("pulse-vote", null);
const BAR: Record<ValueId, string> = { together: "bg-together", open: "bg-sage", proactive: "bg-lime" };

export function ValuePulse() {
  const vote = useLocalStore(voteStore);
  const ids: ValueId[] = ["together", "open", "proactive"];
  const tally = ids.map((id) => BASE_TALLY[id] + (vote === id ? 1 : 0));
  const max = Math.max(...tally);

  return (
    <section aria-labelledby="pulse-title" className="rounded-[2rem] bg-white p-6 text-ink shadow-md sm:p-8">
      <h3 id="pulse-title" className="font-display text-xl sm:text-2xl">
        {ui.pulseQuestion}
      </h3>
      <ul className="mt-6 space-y-3">
        {ids.map((id, i) => (
          <li key={id}>
            <button
              type="button"
              aria-pressed={vote === id}
              onClick={() => voteStore.set(vote === id ? null : id)}
              className={cn(
                "relative flex w-full items-center justify-between overflow-hidden rounded-2xl border-2 px-4 py-3 text-left font-extrabold transition-transform active:scale-[0.98]",
                vote === id ? "border-ink" : "border-ink/10 hover:border-ink/40",
              )}
            >
              <motion.span
                aria-hidden="true"
                className={cn("absolute inset-y-0 left-0 opacity-30", BAR[id])}
                initial={false}
                animate={{ width: `${(tally[i] / max) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
              <span className="relative">
                {vote === id && "✓ "}
                {valueMeta[id].label}
              </span>
              <span className="relative tabular-nums">{tally[i]}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs font-semibold text-ink/75">{ui.pulseNote}</p>
    </section>
  );
}
