"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { promise } from "@/content/code";
import type { MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { MediaImage } from "@/components/ui/MediaImage";

type Side = "you" | "us";

/* The two hands meet at 50.5% of the illustration's width. */
const SEAM = 50.5;

function PromiseList({ lettering, heading, items, align }: {
  lettering: MediaKey;
  heading: string;
  items: { lead: string; text: string }[];
  align: "left" | "right";
}) {
  return (
    <div className={cn(align === "right" && "lg:text-right")}>
      <h3 className="sr-only">{heading}</h3>
      <motion.div
        className={cn("w-[70%] max-w-[300px]", align === "right" && "lg:ml-auto")}
        initial={{ opacity: 0, scale: 0.6, rotate: align === "left" ? -8 : 8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: "spring", stiffness: 220, damping: 12 }}
      >
        <MediaImage name={lettering} alt="" sizes="300px" className="h-auto w-full" />
      </motion.div>
      <ul className="mt-6 space-y-4 text-base leading-relaxed sm:text-lg">
        {items.map((item, i) => (
          <motion.li
            key={item.lead}
            initial={{ opacity: 0, x: align === "left" ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.08 }}
          >
            <strong className="font-extrabold">{item.lead}</strong>
            {item.text && ` ${item.text}`}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Print pages 30-31: the two promises sit either side of the handshake, and
 * the hands meet as you scroll. On mobile a toggle switches between promises.
 */
export function Handshake() {
  const ref = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<Side>("you");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-handshake]", start: "top 85%", end: "center 50%", scrub: 0.6 } })
          .fromTo('[data-hand="left"]', { xPercent: -24, rotate: -4 }, { xPercent: 0, rotate: 0, ease: "power2.out" }, 0)
          .fromTo('[data-hand="right"]', { xPercent: 24, rotate: 4 }, { xPercent: 0, rotate: 0, ease: "power2.out" }, 0)
          .to("[data-hand]", { y: -6, duration: 0.08, yoyo: true, repeat: 3, ease: "sine.inOut" });
      });
    },
    { scope: ref },
  );

  const toggle = (value: Side, label: string) => (
    <button
      type="button"
      aria-pressed={side === value}
      onClick={() => setSide(value)}
      className={cn(
        "flex-1 rounded-full px-4 py-3 text-sm font-extrabold transition-colors",
        side === value ? "bg-ink text-white" : "text-ink/70",
      )}
    >
      {label}
    </button>
  );

  return (
    <div ref={ref} className="overflow-hidden bg-white text-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto mb-10 flex max-w-md gap-1 rounded-full bg-paper p-1.5 lg:hidden">
          {toggle("you", promise.toYou.heading)}
          {toggle("us", promise.toUs.heading)}
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr_1fr] lg:gap-8">
          <div className={cn(side === "you" ? "block" : "hidden", "lg:block")}>
            <PromiseList lettering="lettering/our-promise-to-you" heading={promise.toYou.heading} items={promise.toYou.items} align="left" />
          </div>

          <div data-handshake className="relative order-first mx-auto aspect-[871/888] w-full max-w-[340px] lg:order-none lg:max-w-[460px]">
            {(["left", "right"] as const).map((hand) => (
              <div
                key={hand}
                data-hand={hand}
                className="absolute inset-0"
                style={{ clipPath: hand === "left" ? `inset(0 ${100 - SEAM}% 0 0)` : `inset(0 0 0 ${SEAM}%)` }}
              >
                <MediaImage
                  name="illustrations/handshake"
                  alt={hand === "left" ? "Illustration of two colleagues shaking hands" : ""}
                  fill
                  sizes="(min-width: 1024px) 460px, 90vw"
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          <div className={cn(side === "us" ? "block" : "hidden", "lg:block")}>
            <PromiseList lettering="lettering/your-promise-to-us" heading={promise.toUs.heading} items={promise.toUs.items} align="right" />
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-3xl text-center text-xl leading-relaxed font-semibold sm:text-2xl">{promise.closing}</p>
      </div>
    </div>
  );
}
