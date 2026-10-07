"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { announceEgg, confetti, EGG_EVENT } from "@/lib/eggs";

const SECRET_PHRASE = "neversettle";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const TOAST_MS = 3800;

/**
 * Site-wide Easter eggs: type "never settle" (or the Konami code) anywhere,
 * and a toast for the smaller eggs hidden around the page.
 */
export function EasterEggs() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let typed = "";
    let keys: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      keys = [...keys, e.key].slice(-KONAMI.length);
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) typed = (typed + e.key.toLowerCase()).slice(-SECRET_PHRASE.length);
      if (typed === SECRET_PHRASE || keys.join() === KONAMI.join()) {
        typed = "";
        keys = [];
        confetti(undefined, 240);
        announceEgg("Never settle. Journey further. 🎉");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let timer = 0;
    const onEgg = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(null), TOAST_MS);
    };
    window.addEventListener(EGG_EVENT, onEgg);
    return () => {
      window.removeEventListener(EGG_EVENT, onEgg);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[calc(var(--nav-h)+1rem)] z-[70] flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.p
            key={message}
            className="rounded-full bg-ink px-6 py-3 text-center text-base font-extrabold text-lime shadow-2xl"
            initial={{ y: -30, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
