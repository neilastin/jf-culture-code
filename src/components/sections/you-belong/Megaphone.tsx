"use client";

import { motion, type Variants } from "framer-motion";
import { youBelongHere } from "@/content/code";
import { MediaImage } from "@/components/ui/MediaImage";
import { RichText } from "@/components/ui/RichText";

const megaphone: Variants = {
  hidden: { rotate: -38, scale: 0.7, opacity: 0, x: -60 },
  shown: { rotate: -24, scale: 1, opacity: 1, x: 0, transition: { type: "spring", stiffness: 150, damping: 11 } },
};

/* The paper "sound" bursts out from the megaphone's corner. */
const burst: Variants = {
  hidden: { clipPath: "circle(0% at 0% 100%)" },
  shown: { clipPath: "circle(160% at 0% 100%)", transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.25 } },
};

const line: Variants = {
  hidden: { opacity: 0, x: -40, y: 30 },
  shown: (i: number) => ({ opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 120, damping: 18, delay: 0.7 + i * 0.25 } }),
};

/**
 * Print page 9: the megaphone "speaks". A burst of paper bursts out of the
 * mouth of the megaphone and the copy rides out on it.
 */
export function Megaphone() {
  return (
    <div className="relative overflow-hidden bg-ink px-4 py-16 sm:px-8 lg:py-28">
      <motion.div
        className="relative mx-auto max-w-[1400px] lg:min-h-[640px]"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div
          variants={megaphone}
          className="relative z-10 w-[62%] max-w-[420px] origin-[85%_40%] sm:w-[48%] lg:absolute lg:bottom-0 lg:left-0 lg:w-[34%] lg:max-w-[480px]"
        >
          <motion.div
            animate={{ rotate: [0, -2, 0, 1.5, 0] }}
            transition={{ type: "tween", duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          >
            <MediaImage
              name="illustrations/megaphone"
              alt="Illustration of a lime green megaphone"
              sizes="(min-width: 1024px) 480px, 60vw"
              className="h-auto w-full drop-shadow-[0_20px_30px_rgb(0_0_0/0.45)]"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={burst}
          className="relative motion-reduce:[clip-path:none!important] -mt-10 rounded-[2.5rem] bg-paper text-ink shadow-2xl sm:-mt-16 lg:mt-0 lg:ml-[26%] lg:rounded-[3rem]"
        >
          <div className="space-y-6 px-6 py-12 text-xl leading-relaxed sm:px-12 sm:text-2xl lg:px-20 lg:py-20 lg:text-[1.7rem] lg:leading-snug">
            {youBelongHere.body.map((p, i) => (
              <motion.p key={i} custom={i} variants={line}>
                <RichText text={p} />
              </motion.p>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
