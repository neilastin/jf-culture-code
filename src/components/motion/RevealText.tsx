"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, MOTION_REDUCED, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Delay before the first line moves, in seconds. */
  delay?: number;
};

/** Text that reveals line by line as it scrolls into view (a gentle fade with reduced motion). */
export function RevealText({ as: Tag = "p", className, children, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          aria: "none",
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1,
              delay,
              ease: "expo.out",
              stagger: 0.07,
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            }),
        });
        return () => split.revert();
      });
      mm.add(MOTION_REDUCED, () => {
        gsap.from(el, { autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
