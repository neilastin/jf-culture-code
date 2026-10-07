"use client";

import { motion, type Transition } from "framer-motion";
import { cover } from "@/content/code";
import { ui } from "@/content/site";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { FULL_PAGE } from "@/components/stage/geometry";
import { Stage } from "@/components/stage/Stage";
import { StageLayer } from "@/components/stage/StageLayer";
import { MediaImage } from "@/components/ui/MediaImage";

const spring = (delay: number, stiffness = 200, damping = 13): Transition => ({
  type: "spring",
  stiffness,
  damping,
  delay,
  opacity: { duration: 0.3, delay },
});

/** Print page 1: the cover lettering and characters assemble on load. */
export function Cover() {
  const scrollTo = useScrollTo();
  return (
    <section
      id="cover"
      aria-labelledby="cover-title"
      className="relative flex flex-col items-center justify-end overflow-hidden bg-lime-field px-4 pt-[calc(var(--nav-h)+1.5rem)] sm:min-h-[100svh]"
    >
      <h1 id="cover-title" className="sr-only">
        {cover.title}
      </h1>

      <Stage box={FULL_PAGE} depth={0.05} className="w-full max-w-[min(calc(100svh-var(--nav-h)-1.5rem),940px)]">
        <StageLayer rect={[45, 21, 546, 230]} box={FULL_PAGE} layer="lettering">
          <motion.div
            className="relative h-full w-full"
            initial={{ opacity: 0, y: "-60%", rotate: -10 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={spring(0.1, 170, 11)}
          >
            <MediaImage name="lettering/cover-culture" alt="" fill preload sizes="(min-width: 900px) 760px, 90vw" className="object-fill" />
          </motion.div>
        </StageLayer>
        <StageLayer rect={[72, 175, 510, 404]} box={FULL_PAGE} layer="lettering">
          <motion.div
            className="relative h-full w-full"
            initial={{ opacity: 0, scale: 0.3, rotate: 8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={spring(0.4, 260, 12)}
          >
            <MediaImage name="lettering/cover-code" alt="" fill preload sizes="(min-width: 900px) 660px, 80vw" className="object-fill" />
          </motion.div>
        </StageLayer>
        {/* The characters are the LCP image, so they render in place from the first paint; the lettering assembles around them. */}
        <StageLayer rect={[-1, 158, 597, 597]} box={FULL_PAGE} layer="static">
          <MediaImage
            name="illustrations/cover-people"
            alt="Illustration of five smiling Journey Further colleagues standing together"
            fill
            preload
            sizes="(min-width: 900px) 880px, 100vw"
            className="object-fill"
          />
        </StageLayer>
        <StageLayer rect={[32, 448, 563, 496]} box={FULL_PAGE} layer="static" className="flex items-center">
          <motion.p
            aria-hidden="true"
            className="font-display w-full text-center text-[7.1cqw] whitespace-nowrap text-white drop-shadow-[0_3px_12px_rgb(0_0_0/0.35)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(1.15, 180, 18)}
          >
            Journey Further
          </motion.p>
        </StageLayer>
      </Stage>

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
