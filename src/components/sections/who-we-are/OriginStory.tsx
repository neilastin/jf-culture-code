"use client";

import { motion, useAnimate } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { whoWeAre } from "@/content/code";
import { announceEgg, confetti } from "@/lib/eggs";
import { RevealText } from "@/components/motion/RevealText";
import { Hint, useHint } from "@/components/ui/Hint";
import { MediaImage } from "@/components/ui/MediaImage";
import { RichText } from "@/components/ui/RichText";

/**
 * Print page 5: the founders' pub painting swings into place in its gold frame.
 * Easter egg: click the painting to raise a glass.
 */
export function OriginStory() {
  const { origin } = whoWeAre;
  const [scope, animate] = useAnimate();
  const frameRef = useRef<HTMLDivElement>(null);
  const [hint, dismissHint] = useHint(frameRef, 2500);

  const cheers = (e: MouseEvent<HTMLButtonElement>) => {
    dismissHint();
    animate(scope.current, { rotate: [0, -7, 6, -3, 1.5, 0] }, { type: "tween", duration: 0.9, ease: "easeOut" });
    confetti({ x: e.clientX, y: e.clientY }, 70);
    announceEgg("Cheers! 🍻 To the get-together that started it all.");
  };
  return (
    <div className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-20 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:py-32">
        <div className="max-w-xl">
          <RevealText as="h3" className="font-display text-3xl sm:text-5xl">
            {origin.heading}
          </RevealText>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/90 sm:text-xl">
            {origin.body.map((p, i) => (
              <RevealText key={i} delay={0.1}>
                <RichText text={p} />
              </RevealText>
            ))}
          </div>
        </div>

        <motion.div
          ref={frameRef}
          className="relative mx-auto w-full max-w-[560px] origin-[50%_8%]"
          initial={{ rotate: -16, y: -40, opacity: 0 }}
          whileInView={{ rotate: 0, y: 0, opacity: 1 }}
          whileHover={{ rotate: 2.5 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 60, damping: 5, mass: 1.2, opacity: { duration: 0.4 } }}
        >
          <button
            ref={scope}
            type="button"
            onClick={cheers}
            className="block w-full origin-[50%_8%] cursor-pointer rounded-3xl"
            aria-label="Raise a glass with the founders"
          >
            <MediaImage
              name="illustrations/gold-frame-founders"
              alt="Painting in a gold frame of the three founders sharing pints around a pub table"
              sizes="(min-width: 1024px) 560px, 90vw"
              className="h-auto w-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]"
            />
          </button>
          <Hint show={hint} tone="light" className="absolute bottom-[6%] left-1/2 -translate-x-1/2">
            Tap the painting
          </Hint>
        </motion.div>
      </div>
    </div>
  );
}
