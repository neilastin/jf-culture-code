"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { values } from "@/content/code";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { MediaImage } from "@/components/ui/MediaImage";

/*
 * The team illustration is split into four quarters with soft, complementary
 * seams (they add back up to the whole picture once they meet). Each quarter
 * drifts in from its own corner, so the groups come together as you scroll.
 */
const fade = (dir: string, solid: boolean) =>
  `linear-gradient(${dir}, ${solid ? "#000" : "transparent"} 46%, ${solid ? "transparent" : "#000"} 54%)`;

function quarterMask(left: boolean, top: boolean): CSSProperties {
  const image = `${fade("to right", left)}, ${fade("to bottom", top)}`;
  return { maskImage: image, WebkitMaskImage: image, maskComposite: "intersect", WebkitMaskComposite: "source-in" };
}

const QUARTERS = [
  { key: "tl", style: quarterMask(true, true), from: { xPercent: -14, yPercent: -12, rotate: -3 } },
  { key: "tr", style: quarterMask(false, true), from: { xPercent: 14, yPercent: -10, rotate: 3 } },
  { key: "bl", style: quarterMask(true, false), from: { xPercent: -12, yPercent: 12, rotate: 2 } },
  { key: "br", style: quarterMask(false, false), from: { xPercent: 14, yPercent: 10, rotate: -2 } },
];

/** Print page 15: the illustrated team comes together as you scroll. */
export function TogetherDrift() {
  const ref = useRef<HTMLDivElement>(null);
  const { blocks } = values.together;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-drift]", start: "top 90%", end: "center 50%", scrub: 0.6 } });
        QUARTERS.forEach((q) => {
          tl.fromTo(`[data-quarter="${q.key}"]`, { ...q.from, scale: 0.92 }, { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, duration: 1, ease: "power2.out" }, 0);
        });
        // Overlapping soft seams never quite add up to solid, so the whole picture fades in as the quarters lock.
        tl.fromTo("[data-whole]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.85);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="overflow-hidden bg-together text-white">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:py-28">
        <div data-drift className="relative mx-auto aspect-[1482/980] w-full max-w-[760px] lg:order-2">
          <div data-whole className="absolute inset-0">
            <MediaImage
              name="illustrations/together-team"
              alt="Illustration of the Journey Further team gathering in small groups to talk, work and share ideas"
              fill
              sizes="(min-width: 1024px) 760px, 92vw"
              className="object-contain"
            />
          </div>
          {QUARTERS.map((q) => (
            <div key={q.key} data-quarter={q.key} aria-hidden="true" className="absolute inset-0" style={q.style}>
              <MediaImage
                name="illustrations/together-team"
                alt=""
                fill
                sizes="(min-width: 1024px) 760px, 92vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        <div className="space-y-12">
          {blocks.map((b) => (
            <div key={b.heading}>
              <RevealText as="h3" className="font-display text-2xl sm:text-4xl">
                {b.heading}
              </RevealText>
              {b.body.map((p, i) => (
                <RevealText key={i} className="mt-5 text-lg leading-relaxed text-white/95 sm:text-xl">
                  {p}
                </RevealText>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
