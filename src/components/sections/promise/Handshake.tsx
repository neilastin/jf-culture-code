"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { promise } from "@/content/code";
import type { MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { MediaImage } from "@/components/ui/MediaImage";

/*
 * The two people are separate layers on one canvas. In the art their hands
 * are a small gap apart; each steps in by STEP% of the width so the hands
 * clasp, with a little burst where they meet.
 */
const STEP = 7.4;
const MEET = { left: "48.2%", top: "38.5%" };
const BURST = [-70, -35, 0, 35, 70];

/**
 * One promise on its own dark card, so the hand-lettering reads. Each item is
 * a lead (in the card's accent) with its explanation underneath; an item with
 * no explanation becomes the card's sign-off.
 */
function PromiseCard({
  lettering,
  heading,
  items,
  accent,
  from,
}: {
  lettering: MediaKey;
  heading: string;
  items: { lead: string; text: string }[];
  accent: "lime" | "mint";
  from: "left" | "right";
}) {
  const list = items.filter((item) => item.text);
  const signOff = items.find((item) => !item.text);
  return (
    <motion.div
      className="flex h-full flex-col rounded-[2rem] bg-ink p-6 text-white shadow-2xl sm:p-8"
      initial={{ opacity: 0, x: from === "left" ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 110, damping: 18 }}
    >
      <h3 className="sr-only">{heading}</h3>
      <MediaImage name={lettering} alt="" sizes="260px" className="mx-auto h-auto w-[62%] max-w-[240px]" />
      <ul className="mt-6 divide-y divide-white/12 border-y border-white/12">
        {list.map((item) => (
          <li key={item.lead} className="py-4">
            <p className={cn("text-base font-extrabold sm:text-lg", accent === "lime" ? "text-lime" : "text-mint")}>{item.lead}</p>
            <p className="mt-1 text-sm leading-relaxed text-white/80 sm:text-base">{item.text}</p>
          </li>
        ))}
      </ul>
      {signOff && (
        <p className={cn("font-display mt-auto pt-6 text-lg leading-tight sm:text-xl", accent === "lime" ? "text-lime" : "text-mint")}>
          {signOff.lead}
        </p>
      )}
    </motion.div>
  );
}

/**
 * Print pages 30-31: the two promises sit on cards either side of the handshake, and
 * the hands meet as you scroll. On narrow screens the two cards simply stack.
 */
export function Handshake() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // A gentle bounce in their step while they walk towards each other.
        const walk = { progress: 0 };
        const step = () => {
          const lift = Math.abs(Math.sin(walk.progress * Math.PI * 5)) * -1.4 * (1 - walk.progress);
          gsap.set("[data-person]", { yPercent: lift });
        };
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-handshake]", start: "top 85%", end: "center 45%", scrub: 0.6 } })
          .fromTo(
            '[data-person="left"]',
            { x: 0, xPercent: -30, rotate: -2 },
            { x: 0, xPercent: STEP, rotate: 0, ease: "power1.out", duration: 1 },
            0,
          )
          .fromTo(
            '[data-person="right"]',
            { x: 0, xPercent: 30, rotate: 2 },
            { x: 0, xPercent: -STEP, rotate: 0, ease: "power1.out", duration: 1 },
            0,
          )
          .fromTo(walk, { progress: 0 }, { progress: 1, ease: "power1.out", duration: 1, onUpdate: step }, 0)
          // The shake itself, then a little burst to seal the deal.
          .to("[data-person]", { yPercent: -0.8, duration: 0.06, yoyo: true, repeat: 3, ease: "sine.inOut" })
          .fromTo(
            "[data-burst]",
            { autoAlpha: 0, scaleY: 0.2 },
            { autoAlpha: 1, scaleY: 1, duration: 0.12, stagger: 0.02, ease: "back.out(3)" },
            "<0.1",
          )
          .to({}, { duration: 0.1 });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="overflow-hidden bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 lg:py-28">
        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-6">
          <div>
            <PromiseCard
              lettering="lettering/our-promise-to-you"
              heading={promise.toYou.heading}
              items={promise.toYou.items}
              accent="lime"
              from="left"
            />
          </div>

          <div
            data-handshake
            className="relative order-first mx-auto aspect-[895/1141] w-full max-w-[280px] self-center overflow-hidden lg:order-none lg:max-w-[400px]"
          >
            {/* The man's hand goes over the woman's, so he's drawn last. */}
            {(["right", "left"] as const).map((side) => (
              <div key={side} data-person={side} className="absolute inset-0" style={{ transform: `translateX(${side === "left" ? STEP : -STEP}%)` }}>
                <MediaImage
                  name={`illustrations/handshake-${side}`}
                  alt={side === "left" ? "Illustration of two colleagues stepping forward to shake hands" : ""}
                  fill
                  sizes="(min-width: 1024px) 420px, 80vw"
                  className="object-contain"
                />
              </div>
            ))}
            <div aria-hidden="true" className="pointer-events-none absolute" style={MEET}>
              {BURST.map((angle) => (
                <span key={angle} className="absolute top-0 left-0 h-0 w-0" style={{ transform: `rotate(${angle}deg)` }}>
                  <span
                    data-burst
                    className="absolute bottom-[1.6rem] -left-[2.5px] block h-5 w-[5px] origin-bottom rounded-full bg-gold opacity-0 sm:h-6"
                  />
                </span>
              ))}
            </div>
          </div>

          <div>
            <PromiseCard
              lettering="lettering/your-promise-to-us"
              heading={promise.toUs.heading}
              items={promise.toUs.items}
              accent="mint"
              from="right"
            />
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-4xl text-center text-xl leading-snug font-bold text-balance sm:text-2xl lg:mt-16 lg:text-[1.75rem]">
          {promise.closing}
        </p>
      </div>
    </div>
  );
}
