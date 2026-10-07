"use client";

import { useRef } from "react";
import { values } from "@/content/code";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { MediaImage } from "@/components/ui/MediaImage";

/* The illustration is split into two halves that cross-fade over a soft seam; each half drifts in. */
const HALVES = [
  { key: "left", mask: "linear-gradient(to right, black 44%, transparent 56%)", from: -16 },
  { key: "right", mask: "linear-gradient(to right, transparent 44%, black 56%)", from: 16 },
];

/** Print page 15: the illustrated team drifts together as you scroll. */
export function TogetherDrift() {
  const ref = useRef<HTMLDivElement>(null);
  const { blocks } = values.together;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        HALVES.forEach((h) => {
          gsap.fromTo(
            `[data-half="${h.key}"]`,
            { xPercent: h.from, rotate: h.from / 8 },
            {
              xPercent: 0,
              rotate: 0,
              ease: "none",
              scrollTrigger: { trigger: "[data-drift]", start: "top 85%", end: "center 45%", scrub: 0.6 },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="overflow-hidden bg-together text-white">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div
          data-drift
          className="relative mx-auto aspect-square w-full max-w-[620px] [mask-image:radial-gradient(closest-side,black_80%,transparent)] lg:order-2"
        >
          {HALVES.map((h) => (
            <div
              key={h.key}
              data-half={h.key}
              className="absolute inset-0"
              style={{ maskImage: h.mask, WebkitMaskImage: h.mask }}
            >
              <MediaImage
                name="illustrations/together-people"
                alt={h.key === "left" ? "Illustration of colleagues gathering in small groups to talk and work together" : ""}
                fill
                sizes="(min-width: 1024px) 620px, 92vw"
                className="object-cover"
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
