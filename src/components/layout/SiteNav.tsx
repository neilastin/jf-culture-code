"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { navSections, PART_COUNT, ui } from "@/content/site";
import { cn } from "@/lib/cn";
import { useScrollTo } from "@/components/motion/SmoothScroll";
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
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const activeSection = navSections.find((s) => s.id === active) ?? navSections[0];
  const activePart = activeSection.part;
  const activeLabel = activeSection.part ? activeSection.label : "";

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
            {activePart && (
              <span className="font-display rounded-md bg-part px-2 py-1 text-[0.6rem] text-charcoal tabular-nums">
                Part {activePart} / {PART_COUNT}
              </span>
            )}
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

          {/* Share a story lives in the last section for launch; the brand sits here instead. */}
          <span aria-hidden="true" className="font-display ml-auto text-sm whitespace-nowrap text-white drop-shadow-[0_1px_6px_rgb(0_0_0/0.25)] sm:text-base">
            Journey Further
          </span>
        </nav>

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-teal"
          style={{ scaleX: progress }}
        />
      </header>

      {/*
       * Section rail, desktop only. Grouped by the Code's six parts: each part shows its number, the
       * active part shows its name, and the three values sit inside Part 4 as smaller dots.
       */}
      <nav aria-label="Sections" className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 xl:block">
        <ol className="flex flex-col items-end gap-1">
          {navSections.map((s) => {
            const isActive = s.id === active;
            const partActive = s.part !== undefined && s.part === activePart;
            return (
              <li key={s.id} className={cn("flex w-full justify-end", !s.sub && (s.part ?? 0) > 1 && "mt-1.5")}>
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex min-w-7 items-center justify-end gap-2.5 py-0.5"
                >
                  {/* Hover shows any label; arriving in a section flashes its label for a moment, then it gets out of the way. */}
                  <span
                    key={isActive ? `on-${s.id}` : s.id}
                    aria-hidden="true"
                    className={cn(
                      "font-display pointer-events-none rounded-full bg-ink/90 px-3 py-1.5 text-[0.6rem] text-white opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                      isActive && "motion-safe:animate-[flash-label_2.6s_ease_forwards]",
                    )}
                  >
                    {s.part && !s.sub ? `Part ${s.part} · ` : ""}
                    {s.label}
                  </span>
                  {/* Parts get a numbered disc with its own fill, so the number reads on light and dark pages alike. */}
                  {s.part && !s.sub ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "font-display grid place-items-center rounded-full border-2 text-[0.55rem] leading-none tabular-nums shadow-[0_0_0_1px_rgb(0_0_0/0.2)] transition-all duration-300 ease-[var(--ease-spring)]",
                        isActive
                          ? "h-7 w-7 border-white bg-teal text-charcoal"
                          : partActive
                            ? "h-5 w-5 border-white bg-teal text-charcoal"
                            : "h-5 w-5 border-white/90 bg-charcoal text-white group-hover:bg-white group-hover:text-charcoal",
                      )}
                    >
                      {s.part}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "mx-[3px] block rounded-full border-2 border-white/90 shadow-[0_0_0_1px_rgb(0_0_0/0.2)] transition-all duration-300 ease-[var(--ease-spring)]",
                        s.sub ? "mr-[5px] h-2 w-2" : "h-3 w-3",
                        isActive ? (s.sub ? "h-4 bg-teal" : "h-5 bg-teal") : partActive ? "bg-teal/70" : "bg-charcoal group-hover:bg-white",
                      )}
                    />
                  )}
                  <span className="sr-only">{s.part ? `Part ${s.part}: ${s.label}` : s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
