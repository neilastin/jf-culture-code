"use client";

import { useRef, type ReactNode } from "react";
import { howWeSucceed } from "@/content/code";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/* Value names get their section colour; the words themselves are unchanged. */
function accent(text: string): ReactNode[] {
  return text.split(/(Together|Open|Proactive)/g).map((part, i) =>
    /^(Together|Open|Proactive)$/.test(part) ? (
      <span key={i} className="mx-[0.1em] inline-block rounded-[0.16em] bg-ink px-[0.24em] py-[0.08em] text-gold">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * The three statements arrive one at a time while the section is pinned.
 * (NEVER SETTLE is a brand sign-off, so it lives in the footer, not beside the values.)
 */
export function Statements() {
  const ref = useRef<HTMLDivElement>(null);
  const { statements } = howWeSucceed;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-statement]");
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 1 },
          scrollTrigger: { trigger: ref.current, start: "top top", end: "+=230%", scrub: 0.7, pin: true },
        });
        items.forEach((item, i) => {
          tl.fromTo(item, { yPercent: 60, autoAlpha: 0, rotate: 2 }, { yPercent: 0, autoAlpha: 1, rotate: 0 });
          if (i < items.length - 1) tl.to(item, { yPercent: -60, autoAlpha: 0, ease: "power2.in" }, "+=0.6");
        });
        tl.to({}, { duration: 0.8 });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-dare-after className="relative overflow-hidden bg-gold text-ink">
      <div className="mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-4 pt-[var(--nav-h)] pb-12 sm:px-8">
        <ol className="grid gap-10 motion-safe:[grid-template-areas:'stack'] motion-safe:gap-0">
          {statements.map((s, i) => (
            <li
              key={i}
              data-statement
              className="font-display text-[clamp(2rem,6.2vw,5.6rem)] leading-[1.22] motion-safe:[grid-area:stack]"
            >
              {accent(s)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
