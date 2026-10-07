"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * A pull quote that lights up word by word as you scroll. It repeats a line
 * from the copy above, so it is hidden from screen readers.
 */
export function BigQuote({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.12, y: 18 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
          },
        );
        gsap.from("[data-word-last]", {
          scale: 0.6,
          rotate: -6,
          ease: "elastic.out(1, 0.4)",
          duration: 1.4,
          scrollTrigger: { trigger: ref.current, start: "bottom 60%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div className="bg-teal px-4 py-24 sm:px-8 lg:py-40">
      <div ref={ref} aria-hidden="true" className="mx-auto max-w-[1400px]">
        <p className="font-display text-[clamp(2.2rem,7.2vw,7rem)] leading-[0.98] text-ink">
          {words.map((w, i) => (
            <span
              key={i}
              data-word
              {...(i === words.length - 1 ? { "data-word-last": true } : {})}
              className="mr-[0.25em] inline-block origin-left"
            >
              {w}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
