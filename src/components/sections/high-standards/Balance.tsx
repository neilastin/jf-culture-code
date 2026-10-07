"use client";

import { useRef } from "react";
import { announceEgg } from "@/lib/eggs";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FULL_PAGE, rectStyle } from "@/components/stage/geometry";
import { MediaImage } from "@/components/ui/MediaImage";

/* The beam pivots on the presenter, who stands at x≈277 in the photo. */
const BEAM_RECT = [18, 150, 536, 352] as const;

function Pan({ word, onPress }: { word: string; onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`Add weight to High ${word.replace(".", "")}`}
      className="pointer-events-auto flex h-full w-[37.8%] cursor-pointer flex-col items-center justify-end pb-[9%]"
    >
      <MediaImage name="lettering/high" alt="" sizes="(min-width: 1024px) 260px, 30vw" className="h-auto w-[78%]" />
      <span
        className="font-display mt-[2%] text-[3.9cqw] text-lime [-webkit-text-stroke:0.035em_var(--color-charcoal)]"
        style={{ textShadow: "0.05em 0.06em 0 var(--color-charcoal), 0.09em 0.11em 0 rgb(33 33 33 / 0.6)" }}
      >
        {word}
      </span>
    </button>
  );
}

/**
 * "High Standards. High Care." on a see-saw. Scrolling nudges the beam with
 * the scroll speed, and it always springs back to level: both matter equally.
 * Easter egg: click a side to pile on weight. It still comes back level.
 */
export function Balance() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const beam = ref.current;
        if (!beam) return;
        const trigger = ScrollTrigger.create({
          trigger: beam,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const tilt = gsap.utils.clamp(-9, 9, self.getVelocity() / -260);
            gsap.killTweensOf(beam);
            gsap
              .timeline()
              .to(beam, { rotation: tilt, duration: 0.25, ease: "power2.out" })
              .to(beam, { rotation: 0, duration: 1.6, ease: "elastic.out(1, 0.3)" });
          },
        });
        return () => trigger.kill();
      });
    },
    { scope: ref },
  );

  const weigh = (side: -1 | 1) => {
    const beam = ref.current;
    if (!beam) return;
    gsap.killTweensOf(beam);
    gsap
      .timeline()
      .to(beam, { rotation: side * 16, duration: 0.35, ease: "power3.out" })
      .to(beam, { rotation: 0, duration: 2.2, ease: "elastic.out(1, 0.25)" }, "+=0.15");
    announceEgg("Nice try. Both matter equally. ⚖️");
  };

  return (
    <div data-layer="lettering" className="pointer-events-none absolute inset-0">
      <div ref={ref} className="absolute origin-[50%_96.5%]" style={rectStyle(BEAM_RECT, FULL_PAGE)}>
        <div className="flex h-full justify-between">
          <Pan word="Standards." onPress={() => weigh(-1)} />
          <Pan word="Care." onPress={() => weigh(1)} />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[7%] rounded-full bg-charcoal shadow-[0_6px_0_rgb(0_0_0/0.25)]">
          <div className="mx-[2%] mt-[0.4%] h-[35%] rounded-full bg-lime" />
        </div>
      </div>
    </div>
  );
}
