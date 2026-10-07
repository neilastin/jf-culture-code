"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { navSections, ui } from "@/content/site";
import { cn } from "@/lib/cn";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { useStories } from "@/components/stories/StoriesProvider";
import { PlusIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";

/** Tracks which section is in the middle of the viewport. */
function useActiveSection(): string {
  const [active, setActive] = useState(navSections[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of navSections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

function useScrolledPast(px: number): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > px);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [px]);
  return past;
}

export function SiteNav() {
  const active = useActiveSection();
  const scrolled = useScrolledPast(40);
  const scrollTo = useScrollTo();
  const { openShare } = useStories();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const activeLabel = navSections.find((s) => s.id === active)?.label ?? "";
  const activeIndex = navSections.findIndex((s) => s.id === active);

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-full bg-charcoal px-4 py-2 text-sm font-bold text-white focus:translate-y-0"
      >
        {ui.skipToContent}
      </a>

      <header
        className={cn(
          "focus-light fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] transition-colors duration-500",
          scrolled ? "bg-ink/88 shadow-lg shadow-black/10 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <nav aria-label="Culture Code" className="mx-auto flex h-full max-w-[1680px] items-center gap-4 px-4 sm:px-8">
          <button
            type="button"
            onClick={() => scrollTo("cover")}
            className="h-8 shrink-0 transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-105 sm:h-9"
            aria-label="Back to the top"
          >
            <Logo className="block h-full" />
          </button>

          <div
            className={cn(
              "hidden min-w-0 flex-1 items-center gap-3 text-sm font-semibold transition-opacity md:flex",
              scrolled ? "text-white opacity-100" : "opacity-0",
            )}
            aria-live="polite"
          >
            <span className="font-display text-[0.65rem] text-teal tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} / {String(navSections.length).padStart(2, "0")}
            </span>
            <span className="relative h-5 flex-1 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={activeLabel}
                  className="absolute inset-0 truncate"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                >
                  {activeLabel}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <button
            type="button"
            onClick={openShare}
            className="group ml-auto inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2.5 text-sm font-extrabold text-charcoal shadow-md shadow-black/15 transition-transform duration-300 ease-[var(--ease-spring)] hover:-rotate-2 hover:scale-105 active:scale-95"
          >
            <PlusIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            {ui.shareStory}
          </button>
        </nav>

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-teal"
          style={{ scaleX: progress }}
        />
      </header>

      {/* Section rail: desktop only */}
      <nav
        aria-label="Sections"
        className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 xl:block"
      >
        <ol className="flex flex-col items-end gap-2.5">
          {navSections.map((s) => {
            const isActive = s.id === active;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center gap-3 py-0.5"
                >
                  <span aria-hidden="true" className="font-display pointer-events-none rounded-full bg-ink/90 px-3 py-1.5 text-[0.6rem] text-white opacity-0 shadow transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {s.label}
                  </span>
                  <span
                    className={cn(
                      "block rounded-full border-2 border-white/80 shadow-[0_0_0_1px_rgb(0_0_0/0.25)] transition-all duration-300 ease-[var(--ease-spring)]",
                      isActive ? "h-6 w-2.5 bg-teal" : "h-2.5 w-2.5 bg-ink/40 group-hover:bg-white",
                    )}
                  />
                  <span className="sr-only">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
