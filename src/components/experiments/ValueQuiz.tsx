"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type MouseEvent } from "react";
import { valueOrder, values } from "@/content/code";
import { valueMeta } from "@/content/site";
import type { ValueId } from "@/content/types";
import { cn } from "@/lib/cn";
import { announceEgg, confetti } from "@/lib/eggs";
import { CrossIcon, TickIcon } from "@/components/ui/Icons";

type Round = { value: ValueId; right: string; wrong: string; rightFirst: boolean };

/** Splits a "Please don't do this" paragraph into its sentences. */
const sentences = (text: string) => text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [text];

/* Every option is real Culture Code copy: a Value in Action example vs a "Please don't do this" line. */
const ROUNDS: Round[] = buildRounds();

function buildRounds(): Round[] {
  return valueOrder.flatMap((id, v) => {
    const { clients, people, dont } = values[id].valueInAction;
    const wrongs = sentences(dont);
    return [clients, people].map((right, i) => ({
      value: id,
      right,
      wrong: wrongs[i % wrongs.length],
      rightFirst: (v + i) % 2 === 0,
    }));
  });
}

/** "Spot the value": pick which of two moments is the value in action. */
export function ValueQuiz() {
  const rounds = ROUNDS;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<"right" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= rounds.length;
  const round = rounds[Math.min(index, rounds.length - 1)];

  const choose = (choice: "right" | "wrong", e: MouseEvent<HTMLButtonElement>) => {
    if (picked) return;
    setPicked(choice);
    if (choice === "right") {
      setScore((s) => s + 1);
      confetti({ x: e.clientX, y: e.clientY }, 50);
    }
  };

  const next = () => {
    const finished = index + 1 >= rounds.length;
    setPicked(null);
    setIndex((i) => i + 1);
    if (finished) announceEgg(score === rounds.length ? "Perfect score. You live the Code. 🏆" : "Nice. Every moment's a chance to live the values.");
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setPicked(null);
  };

  if (done) {
    return (
      <div className="rounded-[2rem] bg-ink p-8 text-center text-white sm:p-12">
        <p className="font-display text-5xl text-lime sm:text-7xl">
          {score}/{rounds.length}
        </p>
        <p className="mt-4 text-xl font-bold">{score === rounds.length ? "Perfect. You could have written the Code." : "Good going. Now go and spot some for real."}</p>
        <button type="button" onClick={restart} className="mt-8 rounded-full bg-lime px-6 py-3 font-extrabold text-ink transition-transform hover:scale-105">
          Play again
        </button>
      </div>
    );
  }

  const options = round.rightFirst
    ? ([["right", round.right], ["wrong", round.wrong]] as const)
    : ([["wrong", round.wrong], ["right", round.right]] as const);

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-xl leading-snug sm:text-3xl">
          Which one is <span className="inline-block rounded-lg bg-ink px-2 py-0.5 text-lime">{valueMeta[round.value].label}</span> in action?
        </p>
        <p className="text-sm font-bold text-ink/75 tabular-nums">
          Round {index + 1} of {rounds.length} · Score {score}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="mt-6 grid gap-4 md:grid-cols-2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
        >
          {options.map(([kind, text]) => {
            const reveal = picked !== null;
            return (
              <motion.button
                key={kind}
                type="button"
                onClick={(e) => choose(kind, e)}
                disabled={reveal}
                whileHover={reveal ? undefined : { y: -4 }}
                animate={reveal && picked === kind && kind === "wrong" ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
                transition={{ type: "tween", duration: 0.4 }}
                className={cn(
                  "flex h-full flex-col gap-3 rounded-3xl border-2 p-5 text-left text-base leading-relaxed transition-colors sm:p-6 sm:text-lg",
                  !reveal && "border-ink/15 hover:border-ink",
                  reveal && kind === "right" && "border-via-line bg-via",
                  reveal && kind === "wrong" && "border-dont-line bg-dont",
                )}
              >
                {reveal && (
                  <span className="font-display flex items-center gap-2 text-sm">
                    {kind === "right" ? <TickIcon className="h-6 w-6" /> : <CrossIcon className="h-6 w-6" />}
                    {kind === "right" ? "Value in action" : "Please don't do this"}
                  </span>
                )}
                {text}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex min-h-12 items-center justify-between gap-4" aria-live="polite">
        {picked && (
          <>
            <p className="text-lg font-extrabold">{picked === "right" ? "Spot on." : "Not quite. That's one from the \"please don't\" list."}</p>
            <button type="button" onClick={next} className="rounded-full bg-ink px-6 py-3 font-extrabold text-white transition-transform hover:scale-105">
              {index + 1 < rounds.length ? "Next" : "See your score"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
