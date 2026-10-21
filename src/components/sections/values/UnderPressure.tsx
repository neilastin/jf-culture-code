"use client";

import { useAnimate } from "framer-motion";
import { useRef, useState } from "react";
import { values } from "@/content/code";
import { announceEgg } from "@/lib/eggs";
import { cn } from "@/lib/cn";
import { gsap, MOTION_OK, MOTION_REDUCED, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Hint } from "@/components/ui/Hint";
import { MediaImage } from "@/components/ui/MediaImage";

/*
 * Layout of the graphic, as fractions of its own box (aspect 0.88). The boot's
 * heel lands exactly where the cracks start, between the N and the D.
 */
const IMPACT = { left: "47%", top: "47.2%" };
const LINES = [-105, -80, -55, 55, 80, 105];

/**
 * "We come together under pressure": the words land, then the boot comes
 * down and stamps on UNDER PRESSURE, which cracks as the whole section
 * shakes. Easter egg: click the boot to stomp again.
 */
export function UnderPressure() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const pinRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  /** True once the first stomp has landed, which brings up the "stomp again / replay" prompts. */
  const [ready, setReady] = useState(false);
  const busy = useRef(false);
  const stomps = useRef(0);

  const impact = async () => {
    const reduced = window.matchMedia(MOTION_REDUCED).matches;
    animate("[data-cracked]", { opacity: 1 }, { duration: reduced ? 0.4 : 0 });
    if (reduced) return;
    animate("[data-words]", { scaleY: [0.86, 1.04, 1], scaleX: [1.05, 0.99, 1] }, { type: "tween", duration: 0.45, ease: "easeOut" });
    animate(
      "[data-line]",
      { opacity: [0, 1, 0], scaleY: [0.2, 1, 0.6], y: ["0%", "-60%", "-90%"] },
      { type: "tween", duration: 0.5, ease: "easeOut" },
    );
    animate(
      scope.current,
      { x: [0, -14, 12, -9, 6, -3, 0], y: [0, 8, -5, 3, -1, 0], rotate: [0, -0.4, 0.35, -0.2, 0] },
      { type: "tween", duration: 0.55, ease: "easeOut" },
    );
    await animate("[data-boot]", { y: ["0%", "-5%", "0%"] }, { type: "tween", duration: 0.35, ease: "easeOut" });
  };

  const stomp = async (first: boolean) => {
    if (busy.current) return;
    busy.current = true;
    const reduced = window.matchMedia(MOTION_REDUCED).matches;
    if (reduced) {
      // Everything simply fades into its final place.
      animate("[data-wct]", { scale: 1, rotate: 0 }, { duration: 0 });
      animate("[data-words]", { y: "0%" }, { duration: 0 });
      animate("[data-boot]", { y: "0%", rotate: 0 }, { duration: 0 });
      await Promise.all([
        animate("[data-wct]", { opacity: 1 }, { duration: 0.5 }),
        animate("[data-words]", { opacity: 1 }, { duration: 0.5 }),
        animate("[data-boot]", { opacity: 1 }, { duration: 0.5 }),
      ]);
      await impact();
      busy.current = false;
      return;
    }
    if (first) {
      animate("[data-wct]", { opacity: [0, 1], scale: [0.4, 1], rotate: [-12, 0] }, { type: "spring", stiffness: 260, damping: 13 });
      await animate("[data-words]", { opacity: [0, 1], y: ["-40%", "0%"] }, { type: "spring", stiffness: 300, damping: 16, delay: 0.25 });
      await animate(
        "[data-boot]",
        { opacity: [0, 1], y: ["-140%", "-22%"], rotate: [-10, -6] },
        { type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      );
    } else {
      await animate("[data-boot]", { y: "-22%", rotate: -6 }, { type: "tween", duration: 0.3, ease: "easeOut" });
    }
    // Wind up, then stamp.
    await animate("[data-boot]", { y: "-30%", rotate: -9 }, { type: "tween", duration: 0.22, ease: "easeInOut" });
    await animate("[data-boot]", { y: "0%", rotate: 0 }, { type: "tween", duration: 0.11, ease: [0.7, 0, 1, 0.6] });
    await impact();
    busy.current = false;
    setReady(true);
  };

  /** Clears the stage and plays the whole sequence again, from the words landing to the stomp. */
  const replay = async () => {
    if (busy.current) return;
    await Promise.all(["[data-wct]", "[data-words]", "[data-boot]", "[data-cracked]"].map((sel) => animate(sel, { opacity: 0 }, { duration: 0.25 })));
    await stomp(true);
  };

  /*
   * The section holds still in the middle of the screen while the sequence plays, so a quick
   * scroll can't skip it. (No hold with reduced motion: it simply plays when it comes into view.)
   */
  useGSAP(
    () => {
      const begin = () => {
        if (started.current) return;
        started.current = true;
        void stomp(true);
      };
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const t = ScrollTrigger.create({ trigger: pinRef.current, start: "center center+=32", end: "+=85%", pin: true, onEnter: begin });
        return () => t.kill();
      });
      mm.add(MOTION_REDUCED, () => {
        const t = ScrollTrigger.create({ trigger: pinRef.current, start: "top 60%", onEnter: begin });
        return () => t.kill();
      });
    },
    { scope: pinRef },
  );

  const again = () => {
    stomps.current += 1;
    if (stomps.current === 3) announceEgg("Still standing. We come together under pressure. 💪");
    void stomp(false);
  };

  return (
    <div ref={pinRef} className="relative z-10 overflow-x-clip bg-paper px-4 pb-24 sm:px-8">
      {/*
       * On tablets and up the whole piece (photo, the lettering standing proud of it, and the prompts)
       * is sized to the screen height, so it fits in full while it's held in place for the stomp.
       * The top padding is a % of this box's own width, matching how far the lettering pokes up.
       */}
      <div ref={scope} className="mx-auto w-full pt-[22%] sm:max-w-[min(1100px,calc((100svh-11.5rem)*1.5))] sm:pt-[11%]">
        <figure className="relative w-full">
          <div className="overflow-hidden rounded-[2rem] shadow-2xl">
            <MediaImage
              name="photos/under-pressure"
              alt="Colleagues clapping and cheering in the audience at a team event"
              sizes="(min-width: 1100px) 1100px, 100vw"
              className="h-auto w-full"
            />
          </div>

          <div className="absolute -right-[3%] bottom-[2%] aspect-[0.88] w-[70%] max-w-[580px] sm:bottom-[5%] sm:w-[54%]">
            <div data-wct className="absolute top-[1%] right-[0%] w-[40%]" style={{ opacity: 0, transform: "scale(0.4) rotate(-12deg)" }}>
              <MediaImage
                name="lettering/we-come-together"
                alt=""
                sizes="(min-width: 1100px) 240px, 22vw"
                className="h-auto w-full drop-shadow-[0_12px_18px_rgb(0_0_0/0.35)]"
              />
            </div>

            <div data-words className="absolute bottom-0 left-[10%] w-[88%] origin-bottom" style={{ opacity: 0, transform: "translateY(-40%)" }}>
              <MediaImage
                name="lettering/under-pressure"
                alt=""
                sizes="(min-width: 1100px) 520px, 48vw"
                className="h-auto w-full drop-shadow-[0_18px_24px_rgb(0_0_0/0.35)]"
              />
              <div data-cracked className="absolute inset-0" style={{ opacity: 0 }}>
                <MediaImage name="lettering/under-pressure-cracked" alt="" sizes="(min-width: 1100px) 520px, 48vw" className="h-auto w-full" />
              </div>
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute" style={IMPACT}>
              {LINES.map((angle) => (
                <span key={angle} className="absolute top-0 left-0 h-0 w-0" style={{ transform: `rotate(${angle}deg)` }}>
                  <span
                    data-line
                    className="absolute bottom-[2.2rem] -left-[3px] block h-6 w-[6px] origin-bottom rounded-full bg-charcoal sm:h-9"
                    style={{ opacity: 0 }}
                  />
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={again}
              aria-label="Stomp again"
              data-boot
              className="absolute top-[2.8%] left-[14.8%] w-[46%] origin-[70%_95%] cursor-pointer"
              style={{ opacity: 0, transform: "translateY(-140%) rotate(-10deg)" }}
            >
              <MediaImage
                name="illustrations/boot"
                alt=""
                sizes="(min-width: 1100px) 270px, 25vw"
                className="h-auto w-full drop-shadow-[0_20px_22px_rgb(0_0_0/0.35)]"
              />
            </button>

            {/* Once the boot has landed: stomp again, or replay the whole sequence. */}
            <div className="absolute top-full left-1/2 mt-3 flex -translate-x-1/2 flex-col items-center gap-1">
              <Hint show={ready}>Tap the boot to stomp again</Hint>
              <button
                type="button"
                onClick={replay}
                tabIndex={ready ? 0 : -1}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold whitespace-nowrap text-ink/60 transition-[opacity,color] duration-500 hover:text-ink",
                  ready ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <span aria-hidden="true" className="text-base leading-none">
                  ↻
                </span>
                or replay the whole thing
              </button>
            </div>
          </div>
          <figcaption className="sr-only">{values.together.pullGraphic}</figcaption>
        </figure>
      </div>
    </div>
  );
}
