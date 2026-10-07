"use client";

import { useRef, type ReactNode } from "react";
import { howWeSucceed } from "@/content/code";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { NeverSettle } from "@/components/ui/NeverSettle";

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
 * The three statements arrive one at a time while the section is pinned,
 * then "NEVER SETTLE" stacks up like the cropped repeat in print.
 */
export function Statements() {
  const ref = useRef<HTMLDivElement>(null);
  const { statements, outro } = howWeSucceed;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-statement]");
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 1 },
          scrollTrigger: { trigger: ref.current, start: "top top", end: "+=280%", scrub: 0.7, pin: true },
        });
        items.forEach((item, i) => {
          tl.fromTo(item, { yPercent: 60, autoAlpha: 0, rotate: 2 }, { yPercent: 0, autoAlpha: 1, rotate: 0 });
          if (i < items.length - 1) tl.to(item, { yPercent: -60, autoAlpha: 0, ease: "power2.in" }, "+=0.6");
        });
        tl.to(items[items.length - 1], { yPercent: -40, autoAlpha: 0, ease: "power2.in" }, "+=0.5")
          .from("[data-settle-line]", { yPercent: 110, stagger: -0.25, ease: "back.out(1.6)", duration: 1.1 }, "<0.2")
          .to({}, { duration: 0.6 });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative overflow-hidden bg-gold text-ink">
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

        <div className="mt-14 motion-safe:absolute motion-safe:inset-x-4 motion-safe:bottom-[12vh] motion-safe:mt-0 sm:motion-safe:inset-x-8">
          <p className="sr-only">{outro}</p>
          <NeverSettle text={outro} reveal="external" className="mx-auto max-w-[1400px] text-[clamp(1.7rem,8.6vw,8.6rem)]" />
        </div>
      </div>
    </div>
  );
}
