"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { Box } from "./geometry";

type Props = {
  /** Sets the aspect ratio. Omit it to size the stage with classes instead. */
  box?: Box;
  className?: string;
  children: ReactNode;
  /** How far lettering drifts against the photo, as a fraction of stage height. */
  depth?: number;
};

/**
 * A layered print composition. Photo and cut-out layers ("scene") move
 * together; lettering layers drift against them, so people sit in front of
 * the headline as they do in print.
 */
export function Stage({ box, className, children, depth = 0.07 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = ref.current;
        if (!el) return;
        const shift = () => el.offsetHeight * depth;
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
            defaults: { ease: "none" },
          })
          .fromTo('[data-layer="scene"]', { y: () => -shift() * 0.35, scale: 1.07 }, { y: () => shift() * 0.35, scale: 1.07 }, 0)
          .fromTo('[data-layer="lettering"]', { y: () => shift() }, { y: () => -shift() }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={cn("stage relative overflow-hidden", className)}
      style={box ? { aspectRatio: `${box.w} / ${box.h}` } : undefined}
    >
      {children}
    </div>
  );
}
