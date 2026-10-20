"use client";

import { useRef } from "react";
import type { MediaKey } from "@/content/media";
import { cover } from "@/content/code";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { rectStyle, type Box, type Rect } from "@/components/stage/geometry";
import { MediaImage } from "@/components/ui/MediaImage";
import { PageFurniture } from "@/components/ui/PageFurniture";

/** Visible window of print page 2, below its running head. */
const BOX: Box = { x: 10, y: 88, w: 575, h: 486 };

type Piece = { key: string; media: MediaKey; rect: Rect; rotate?: number; from: gsap.TweenVars };

/** Some print layers are rotated: place them by centre, true size and angle (from the PDF). */
const turned = (cx: number, cy: number, w: number, h: number): Rect => [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];

/* Each phrase of the stacked print lettering gets its own entrance. */
const PIECES: Piece[] = [
  { key: "matters", media: "lettering/title/this-matters", rect: turned(217, 163.5, 332.8, 99.6), rotate: 4.5, from: { x: -80, autoAlpha: 0 } },
  { key: "than", media: "lettering/title/than-your", rect: turned(454.5, 147.5, 211.2, 76.6), rotate: 4.5, from: { x: 80, autoAlpha: 0 } },
  { key: "job", media: "lettering/title/job-description", rect: [27, 162, 568, 259], from: { scale: 1.9, autoAlpha: 0, ease: "back.out(2)" } },
  { key: "great", media: "lettering/title/great", rect: turned(221.5, 281.5, 186, 60.6), rotate: -4, from: { yPercent: -160, rotate: -14, autoAlpha: 0, ease: "back.out(2.2)" } },
  { key: "strategy", media: "lettering/title/strategy", rect: turned(225.5, 332, 184, 46), rotate: -4, from: { xPercent: 70, rotate: 9, autoAlpha: 0, ease: "back.out(1.8)" } },
  { key: "fails", media: "lettering/title/fails", rect: turned(407.5, 301.5, 227.2, 151.4), rotate: 16.25, from: { scale: 2.8, rotate: 24, autoAlpha: 0, ease: "power4.in" } },
  { key: "without", media: "lettering/title/without", rect: turned(303, 373, 178.1, 90.1), rotate: 4, from: { scaleX: 0, autoAlpha: 0, ease: "back.out(2.5)" } },
  { key: "culture", media: "lettering/title/great-culture", rect: [61, 373, 535, 540], from: { y: 60, scale: 0.5, autoAlpha: 0, ease: "elastic.out(1, 0.55)" } },
  { key: "ours", media: "lettering/title/this-is-ours", rect: [169, 486, 430, 559], from: { clipPath: "inset(0% 100% 0% 0%)", ease: "power2.inOut" } },
];

/** Print page 2 as kinetic type: each phrase lands as you scroll, and the sentence acts itself out. */
export function Statement() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: "+=150%", scrub: 0.7, pin: true },
        });
        PIECES.forEach((p, i) => {
          tl.from(`[data-piece="${p.key}"]`, { duration: 1, ease: "power3.out", ...p.from }, i * 0.55);
        });
        // The story in motion: when FAILS lands, "great strategy" buckles; "great culture" props it back up.
        const strategy = ['[data-piece="great"]', '[data-piece="strategy"]'];
        const landed = (key: string) => PIECES.findIndex((p) => p.key === key) * 0.55 + 1;
        tl.to(strategy, { rotate: (i) => (i ? 9 : 6), yPercent: (i) => (i ? 22 : 12), duration: 0.3, ease: "power2.in", stagger: 0.05 }, landed("fails") - 0.3)
          .to(strategy, { rotate: 0, yPercent: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" }, landed("culture") - 0.35);
        tl.to({}, { duration: 0.8 });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="statement"
      aria-label="Cover statement"
      className="ripples relative flex min-h-[100svh] flex-col overflow-hidden"
    >

      <div className="relative mx-auto w-full max-w-[1680px] px-4 pt-[calc(var(--nav-h)+0.75rem)] sm:px-8">
        <PageFurniture tone="dark" label="Culture Code" />
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 py-6">
        <p className="sr-only">{cover.statement.join(" ")}</p>
        <div
          aria-hidden="true"
          className="relative w-full max-w-[min(calc((100svh-9rem)*1.18),1100px)]"
          style={{ aspectRatio: `${BOX.w} / ${BOX.h}` }}
        >
          {PIECES.map((p) => (
            <div key={p.key} className="absolute" style={{ ...rectStyle(p.rect, BOX), rotate: p.rotate ? `${p.rotate}deg` : undefined }}>
              <div data-piece={p.key} className="relative h-full w-full">
                <MediaImage name={p.media} alt="" fill sizes="(min-width: 1100px) 1100px, 100vw" className="object-fill" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
