"use client";

import { motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";
import type { ValueInAction as ValueInActionCopy } from "@/content/code";
import type { MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";
import { PopIn } from "@/components/motion/PopIn";
import { CrossIcon, TickIcon } from "@/components/ui/Icons";
import { MediaImage } from "@/components/ui/MediaImage";

type Props = {
  valueName: string;
  copy: ValueInActionCopy;
  lettering: MediaKey;
  /** The value's own lettering, repeated here as a reminder of which value this is. */
  valueLettering: MediaKey;
  /** One photo, or two shown as a pair of overlapping cards. */
  images: { media: MediaKey; alt: string }[];
};

function DoCard({ heading, body }: { heading: string; body: string }) {
  return (
    <div>
      <h4 className="font-display flex items-center gap-3 text-xl sm:text-2xl">
        <TickIcon className="h-7 w-7 shrink-0" />
        {heading}
      </h4>
      <p className="mt-3 text-base leading-relaxed sm:text-lg">{body}</p>
    </div>
  );
}

/**
 * Value in Action: one card that flips between "Do this" (Clients and People)
 * and "Please don't do this".
 */
export function ValueInAction({ valueName, copy, lettering, valueLettering, images }: Props) {
  const [side, setSide] = useState<"do" | "dont">("do");
  const id = useId();
  const flipped = side === "dont";

  const tab = (value: "do" | "dont", label: string, icon: ReactNode) => (
    <button
      type="button"
      role="tab"
      id={`${id}-${value}-tab`}
      aria-selected={side === value}
      aria-controls={`${id}-${value}`}
      onClick={() => setSide(value)}
      className={cn(
        "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-extrabold transition-colors sm:text-base",
        side === value ? "text-ink" : "text-ink/75 hover:text-ink",
      )}
    >
      {side === value && (
        <motion.span
          layoutId={`${id}-pill`}
          className={cn("absolute inset-0 -z-10 rounded-full shadow", value === "do" ? "bg-via" : "bg-dont")}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {icon}
      {label}
    </button>
  );

  return (
    <div className="bg-white text-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 lg:py-28">
        <h3 className="sr-only">Value in Action: {valueName}</h3>
        <PopIn className="w-[78%] max-w-2xl lg:w-[48%]" tilt={-3}>
          <MediaImage name={lettering} alt="" sizes="(min-width: 1024px) 680px, 78vw" className="h-auto w-full" />
        </PopIn>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <div role="tablist" aria-label="Value in Action" className="flex max-w-xl gap-1 rounded-full bg-paper p-1.5">
              {tab("do", "Value in action", <TickIcon className="h-5 w-5" />)}
              {tab("dont", "Please don't do this", <CrossIcon className="h-5 w-5" />)}
            </div>

            <div className="relative mt-5 [perspective:1600px]">
              <motion.div
                className="grid [transform-style:preserve-3d]"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 14 }}
              >
                <div
                  id={`${id}-do`}
                  role="tabpanel"
                  aria-labelledby={`${id}-do-tab`}
                  inert={flipped}
                  className={cn(
                    "space-y-8 rounded-[1.75rem] border-2 border-via-line bg-via p-6 [grid-area:1/1] [backface-visibility:hidden] motion-reduce:transition-opacity motion-reduce:duration-500 sm:p-9",
                    flipped && "motion-reduce:opacity-0",
                  )}
                >
                  <DoCard heading="Clients" body={copy.clients} />
                  <DoCard heading="People" body={copy.people} />
                </div>
                <div
                  id={`${id}-dont`}
                  role="tabpanel"
                  aria-labelledby={`${id}-dont-tab`}
                  inert={!flipped}
                  className={cn(
                    "flex flex-col justify-center rounded-[1.75rem] border-2 border-dont-line bg-dont p-6 [grid-area:1/1] [backface-visibility:hidden] sm:p-9",
                    "motion-safe:[transform:rotateY(180deg)] motion-reduce:transition-opacity motion-reduce:duration-500",
                    !flipped && "motion-reduce:opacity-0",
                  )}
                >
                  <h4 className="font-display flex items-center gap-3 text-xl sm:text-2xl">
                    <CrossIcon className="h-7 w-7 shrink-0" />
                    Please Don&apos;t Do This
                  </h4>
                  <p className="mt-4 text-lg leading-relaxed sm:text-xl">{copy.dont}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/*
           * The value's own lettering straddles the top edge of the photo. It sits outside the photo's
           * motion, so on "Please don't do this" the photo greys and tilts while the lettering stays bright.
           */}
          <div className="relative order-first mt-24 sm:mt-32 lg:order-none lg:-mt-32 lg:self-stretch">
            <motion.div
              className={cn("relative h-full", images.length === 1 ? "overflow-hidden rounded-[1.75rem] shadow-xl" : "flex flex-col pt-6")}
              animate={{ rotate: flipped ? -2 : 0, scale: flipped ? 0.97 : 1, filter: flipped ? "grayscale(0.85)" : "grayscale(0)" }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
            >
              {images.length === 1 ? (
                <MediaImage
                  name={images[0].media}
                  alt={images[0].alt}
                  sizes="(min-width: 1024px) 520px, 92vw"
                  className="h-full max-h-[620px] min-h-[440px] w-full object-cover lg:min-h-0"
                />
              ) : (
                images.map((img, i) => (
                  <MediaImage
                    key={img.media}
                    name={img.media}
                    alt={img.alt}
                    sizes="(min-width: 1024px) 460px, 82vw"
                    className={cn(
                      "h-auto w-[88%] rounded-[1.5rem] border-[6px] border-white shadow-xl",
                      i === 0 ? "-rotate-2 self-start" : "relative -mt-[9%] rotate-2 self-end",
                    )}
                  />
                ))
              )}
            </motion.div>
            <PopIn
              className="absolute top-0 left-1/2 z-10 flex h-44 w-[100%] -translate-x-1/2 -translate-y-1/2 justify-center sm:h-56"
              tilt={6}
              from={0.3}
              delay={0.2}
            >
              <motion.div
                className="flex h-full w-full justify-center"
                animate={flipped ? { rotate: [0, -4, 3, 0], y: [0, -6, 0] } : { rotate: 0, y: 0 }}
                transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
              >
                <MediaImage
                  name={valueLettering}
                  alt=""
                  sizes="(min-width: 1024px) 520px, 90vw"
                  className="h-full w-auto max-w-full object-contain drop-shadow-[0_12px_18px_rgb(0_0_0/0.3)]"
                />
              </motion.div>
            </PopIn>
          </div>
        </div>
      </div>
    </div>
  );
}
