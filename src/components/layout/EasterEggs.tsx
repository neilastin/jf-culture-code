"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { announceEgg, confetti, EGG_EVENT } from "@/lib/eggs";
import { CloseIcon } from "@/components/ui/Icons";

const SECRET_PHRASE = "neversettle";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const TOAST_MS = 3800;
const DARE_DELAY_MS = 1200;
const DARE_MS = 12000;
/** Only dare people who have a keyboard to type on. */
const HAS_KEYBOARD = "(hover: hover) and (pointer: fine)";

/**
 * Site-wide Easter eggs: type "never settle" (or the Konami code) anywhere,
 * and a toast for the smaller eggs hidden around the page. Once you've
 * scrolled past How We Succeed, a little note dares you to try it.
 */
export function EasterEggs() {
  const [message, setMessage] = useState<string | null>(null);
  const [dare, setDare] = useState(false);

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
        setDare(false);
        confetti(undefined, 240);
        announceEgg("Never settle. Journey further. 🎉");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The dare appears once, shortly after the How We Succeed statements scroll away above.
  useEffect(() => {
    const target = document.querySelector("[data-dare-after]");
    if (!target || !window.matchMedia(HAS_KEYBOARD).matches) return;
    let show = 0;
    let hide = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting || entry.boundingClientRect.top > 0) return;
      observer.disconnect();
      show = window.setTimeout(() => setDare(true), DARE_DELAY_MS);
      hide = window.setTimeout(() => setDare(false), DARE_DELAY_MS + DARE_MS);
    });
    observer.observe(target);
    return () => {
      observer.disconnect();
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
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
    <>
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

      <AnimatePresence>
        {dare && (
          <motion.aside
            aria-label="A dare"
            className="fixed bottom-5 left-5 z-[60] flex max-w-xs items-start gap-3 rounded-2xl bg-ink py-3.5 pr-3 pl-5 text-white shadow-2xl"
            initial={{ y: 40, opacity: 0, rotate: -4 }}
            animate={{ y: 0, opacity: 1, rotate: -1.5 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <p className="text-base leading-snug font-bold">
              I dare you to type <span className="font-display text-lime">&ldquo;neversettle&rdquo;</span>. Go on.
            </p>
            <button
              type="button"
              onClick={() => setDare(false)}
              aria-label="No thanks"
              className="focus-light -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
