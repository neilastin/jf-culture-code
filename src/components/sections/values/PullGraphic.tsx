"use client";

import { motion } from "framer-motion";
import type { MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";
import { MediaImage } from "@/components/ui/MediaImage";

type Props = {
  text: string;
  photo: { media: MediaKey; alt: string };
  graphic: MediaKey;
  /** Where the lettering sits over the photo card. */
  placement: "right" | "bottom-right";
  /** "stomp" drops the graphic from above with a jolt; "climb" rises from below. */
  entrance: "stomp" | "climb";
  className?: string;
};

/** A photo card with a hand-lettered pull graphic landing on it, as in print. */
export function PullGraphic({ text, photo, graphic, placement, entrance, className }: Props) {
  const stomp = entrance === "stomp";
  return (
    <figure className={cn("relative mx-auto w-full max-w-[1100px]", placement === "bottom-right" ? "pb-[14%]" : "mt-[8%]", className)}>
      <motion.div
        className="overflow-hidden rounded-[2rem] shadow-2xl"
        initial={{ x: 0 }}
        whileInView={stomp ? { x: [0, -10, 9, -5, 3, 0], y: [0, 6, -3, 0] } : { x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "tween", duration: 0.5, delay: 0.55 }}
      >
        <MediaImage name={photo.media} alt={photo.alt} sizes="(min-width: 1100px) 1100px, 100vw" className="h-auto w-full" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className={cn(
          "absolute w-[52%] max-w-[560px]",
          placement === "right" ? "-top-[8%] -right-[3%]" : "-right-[4%] bottom-0",
        )}
        initial={stomp ? { y: "-70%", opacity: 0, rotate: -6 } : { y: "40%", opacity: 0, rotate: 4 }}
        whileInView={{ y: 0, opacity: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={
          stomp
            ? { type: "spring", stiffness: 420, damping: 14, mass: 1.4, opacity: { duration: 0.15 } }
            : { type: "spring", stiffness: 120, damping: 12, opacity: { duration: 0.3 } }
        }
      >
        <MediaImage name={graphic} alt="" sizes="(min-width: 1100px) 560px, 52vw" className="h-auto w-full drop-shadow-[0_18px_24px_rgb(0_0_0/0.35)]" />
      </motion.div>
      <figcaption className="sr-only">{text}</figcaption>
    </figure>
  );
}
