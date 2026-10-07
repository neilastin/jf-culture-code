"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent, type MouseEvent } from "react";
import { promise } from "@/content/code";
import { cn } from "@/lib/cn";
import { announceEgg, confetti } from "@/lib/eggs";
import { createLocalStore, useLocalStore } from "@/lib/localStore";

type Pledge = { id: string; name: string; promise: string };

const pledgeStore = createLocalStore<Pledge[]>("pledges", []);
const PROMISES = promise.toUs.items.map((p) => p.lead.replace(/:$/, ""));
const TILTS = [-3, 2, -1.5, 3, -2.5, 1];
const CARD = ["bg-lime", "bg-teal", "bg-mint", "bg-gold", "bg-[#c9c6ff]"];

/** "Sign the Code": pick the promise you're making and add your name to the wall. */
export function SignTheCode() {
  const pledges = useLocalStore(pledgeStore);
  const [name, setName] = useState("");
  const [choice, setChoice] = useState(PROMISES[0]);

  const sign = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pledge = { id: Date.now().toString(36), name: name.trim() || "A Journey Further human", promise: choice };
    pledgeStore.set((prev) => [pledge, ...prev].slice(0, 24));
    setName("");
    announceEgg("Signed. Now go and live it. ✍️");
  };

  const celebrate = (e: MouseEvent<HTMLButtonElement>) => confetti({ x: e.clientX, y: e.clientY }, 60);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <form onSubmit={sign} className="space-y-5 rounded-[2rem] bg-white p-6 shadow-lg sm:p-8">
        <fieldset>
          <legend className="text-base font-extrabold">{promise.toUs.heading}: which one are you making?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PROMISES.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={choice === p}
                onClick={() => setChoice(p)}
                className={cn(
                  "rounded-full border-2 px-4 py-2 text-sm font-extrabold transition-colors",
                  choice === p ? "border-ink bg-ink text-lime" : "border-ink/15 hover:border-ink/50",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="pledge-name" className="text-base font-extrabold">
            Your name
          </label>
          <input
            id="pledge-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="Sign here"
            className="mt-2 w-full rounded-2xl border-2 border-ink/15 px-4 py-3 text-2xl italic hover:border-ink/35"
          />
        </div>
        <button type="submit" onClick={celebrate} className="rounded-full bg-lime px-6 py-3 text-lg font-extrabold shadow-md transition-transform hover:scale-105">
          Sign the Code
        </button>
        <p className="text-xs font-semibold text-ink/75">Stored on this device only.</p>
      </form>

      <ul className="grid content-start gap-3 sm:grid-cols-2" aria-label="Signatures">
        {pledges.length === 0 && <li className="rounded-3xl border-2 border-dashed border-ink/25 p-8 text-center font-bold sm:col-span-2">Nothing here yet. Be the first.</li>}
        {pledges.map((p, i) => (
          <motion.li
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: TILTS[i % TILTS.length] }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className={cn("rounded-2xl p-5 shadow-md", CARD[i % CARD.length])}
          >
            <p className="text-2xl font-bold italic">{p.name}</p>
            <p className="mt-1 text-sm font-extrabold uppercase">Promises to: {p.promise}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
