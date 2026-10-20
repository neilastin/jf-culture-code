"use client";

import { motion, type Transition } from "framer-motion";
import { cover } from "@/content/code";
import { ui } from "@/content/site";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { MediaImage } from "@/components/ui/MediaImage";

const spring = (delay: number, stiffness = 200, damping = 13): Transition => ({
  type: "spring",
  stiffness,
  damping,
  delay,
  opacity: { duration: 0.25, delay },
});

/**
 * Print page 1: the Culture Code lettering bursts out of the centre of a
 * slowly turning sunburst, with Journey Further beneath it.
 */
export function Cover() {
  const scrollTo = useScrollTo();
  return (
    <section
      id="cover"
      aria-labelledby="cover-title"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-burst px-4 pt-[calc(var(--nav-h)+1rem)] pb-16"
    >
      <h1 id="cover-title" className="sr-only">
        {cover.title}
      </h1>

      <div className="relative w-[min(88vw,760px,calc((100svh-var(--nav-h)-9rem)*1.25))]">
        {/* The sunburst is centred on the lettering, so the burst comes from its origin. */}
        <div aria-hidden="true" className="absolute top-[42%] left-1/2 -z-10 aspect-square w-[260vmax] -translate-x-1/2 -translate-y-1/2">
          <div className="sunburst h-full w-full animate-spin-slow rounded-full" />
        </div>
        <motion.span
          aria-hidden="true"
          className="absolute top-[42%] left-1/2 -z-10 aspect-square w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-white/70"
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ type: "tween", duration: 0.9, delay: 0.2, ease: "easeOut" }}
        />

        <motion.div
          className="relative drop-shadow-[0_0_28px_rgb(255_255_255/0.45)]"
          initial={{ opacity: 0, scale: 0, rotate: -14 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={spring(0.25, 190, 12)}
        >
          <MediaImage name="lettering/culture" alt="" preload sizes="(min-width: 900px) 760px, 88vw" className="h-auto w-full" />
          <motion.div
            className="relative -mt-[9%] ml-[9%] w-[84%]"
            initial={{ scale: 0.55, y: "-12%" }}
            animate={{ scale: 1, y: "0%" }}
            transition={spring(0.55, 320, 11)}
          >
            <MediaImage name="lettering/code" alt="" preload sizes="(min-width: 900px) 640px, 74vw" className="h-auto w-full" />
          </motion.div>
        </motion.div>

        <motion.p
          aria-hidden="true"
          className="font-display mt-[7%] text-center text-[clamp(1.5rem,6.6vw,3.6rem)] whitespace-nowrap text-white drop-shadow-[0_3px_12px_rgb(0_0_0/0.25)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring(1.05, 180, 18)}
        >
          Journey Further
        </motion.p>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollTo("statement")}
        className="group absolute right-8 bottom-8 hidden flex-col items-center gap-2 text-sm font-bold text-ink sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        {ui.scrollCue}
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-ink/70 pt-1.5">
          <span className="block h-2 w-1 animate-float rounded-full bg-ink" />
        </span>
      </motion.button>
    </section>
  );
}
