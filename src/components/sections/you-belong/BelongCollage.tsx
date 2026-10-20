"use client";

import { motion, type Variants } from "framer-motion";
import type { MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";
import { MediaImage } from "@/components/ui/MediaImage";

type Card = { media: MediaKey; alt: string; place: string; rest: number; from: { x: string; y: string; rotate: number } };

/*
 * Three prints fanned across the table, each arriving from its own side. Positions are % of the collage
 * box, chosen so the title never covers a face. Hovering tilts a print but keeps the stacking order.
 */
const CARDS: Card[] = [
  {
    media: "photos/belong-3",
    alt: "Two colleagues sharing a laugh by the photo wall",
    place: "left-[32%] -top-[2%] w-[68%] sm:left-[25%] sm:-top-[5%] sm:w-[48%]",
    rest: 2,
    from: { x: "0%", y: "-60%", rotate: 14 },
  },
  {
    media: "photos/belong-1",
    alt: "A colleague smiling over her shoulder while sitting with teammates at a team session",
    place: "left-0 top-[34%] w-[72%] sm:top-[30%] sm:w-[47%]",
    rest: -6,
    from: { x: "-70%", y: "20%", rotate: -20 },
  },
  {
    media: "photos/belong-2",
    alt: "Colleagues relaxing on stools in the office kitchen, seen past teammates in the foreground",
    place: "right-0 top-[66%] w-[72%] sm:top-[30%] sm:w-[47%]",
    rest: 5,
    from: { x: "70%", y: "25%", rotate: 22 },
  },
];

const card: Variants = {
  hidden: (c: Card) => ({ opacity: 0, x: c.from.x, y: c.from.y, rotate: c.from.rotate }),
  shown: (c: Card) => ({ opacity: 1, x: "0%", y: "0%", rotate: c.rest }),
};

const title: Variants = {
  hidden: { opacity: 0, scale: 0.3, rotate: -12 },
  shown: { opacity: 1, scale: 1, rotate: -4, transition: { type: "spring", stiffness: 230, damping: 11, delay: 0.75 } },
};

/**
 * You Belong Here: three moments from around the business fanned out like
 * prints, with the hand-lettered title landing on top of them all.
 */
export function BelongCollage() {
  return (
    <motion.div
      className="relative mx-auto aspect-[10/13] w-full max-w-[1120px] sm:aspect-[16/10]"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      {CARDS.map((c, i) => (
        <motion.div
          key={c.media}
          custom={c}
          variants={card}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: i * 0.14, opacity: { duration: 0.3, delay: i * 0.14 } }}
          whileHover={{ scale: 1.03, rotate: c.rest * 0.4 }}
          className={cn("absolute rounded-[1.25rem] bg-white p-2 shadow-[0_24px_50px_rgb(0_0_0/0.45)] sm:p-2.5", c.place)}
        >
          <MediaImage name={c.media} alt={c.alt} sizes="(min-width: 640px) 540px, 62vw" className="h-auto w-full rounded-[0.9rem]" />
        </motion.div>
      ))}

      <motion.div
        variants={title}
        aria-hidden="true"
        className="pointer-events-none absolute top-[-2%] left-[-2%] z-10 w-[46%] sm:top-[33%] sm:left-1/2 sm:w-[35%] sm:-translate-x-1/2"
      >
        <MediaImage
          name="lettering/you-belong-here"
          alt=""
          sizes="(min-width: 640px) 460px, 62vw"
          className="h-auto w-full drop-shadow-[0_18px_28px_rgb(0_0_0/0.55)]"
        />
      </motion.div>
    </motion.div>
  );
}
