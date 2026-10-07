"use client";

import Link from "next/link";
import { signOff } from "@/content/code";
import { navSections, ui } from "@/content/site";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { useStories } from "@/components/stories/StoriesProvider";
import { NeverSettle } from "@/components/ui/NeverSettle";

/** Back cover: lime field, stacked NEVER SETTLE, sign-off. No placeholder copy. */
export function SiteFooter() {
  const scrollTo = useScrollTo();
  const { openShare, admin, setAdmin } = useStories();

  return (
    <footer className="bg-lime-field text-ink">
      <div className="mx-auto max-w-[1680px] px-4 pt-16 pb-10 sm:px-8 lg:pt-24">
        <p className="font-display text-[clamp(1.6rem,7.4vw,8rem)] leading-none whitespace-nowrap">Journey Further</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-display text-2xl sm:text-4xl">{signOff}</p>
            <button
              type="button"
              onClick={openShare}
              className="mt-8 rounded-full bg-ink px-6 py-3.5 font-extrabold text-lime transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-105 hover:-rotate-1"
            >
              {ui.shareStory}
            </button>
            <Link
              href="/experimental"
              className="mt-8 ml-3 inline-block rounded-full border-2 border-ink px-6 py-3 font-extrabold transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-105 hover:rotate-1"
            >
              🧪 Experimental ideas
            </Link>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-base font-bold">
              {navSections.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => scrollTo(s.id)} className="text-left underline-offset-4 hover:underline">
                    {s.label}
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => scrollTo("values-in-the-wild")} className="text-left underline-offset-4 hover:underline">
                  {ui.wallHeading}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <NeverSettle text="Never Settle" className="mt-16 text-[clamp(1.7rem,8.6vw,9.4rem)]" />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/25 pt-6 text-sm font-semibold">
          <p>Prototype for the online Culture Code. Example stories are labelled and use placeholder names.</p>
          <button
            type="button"
            aria-pressed={admin}
            onClick={() => setAdmin(!admin)}
            className="rounded-full border-2 border-ink/40 px-4 py-2 text-xs font-extrabold hover:border-ink"
          >
            Moderation demo: {admin ? "on" : "off"}
          </button>
        </div>
      </div>
    </footer>
  );
}
