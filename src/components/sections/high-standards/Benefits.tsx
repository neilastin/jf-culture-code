"use client";

import { motion } from "framer-motion";
import { benefits } from "@/content/site";
import { cn } from "@/lib/cn";
import { BenefitGlyph } from "@/components/ui/Icons";

const TILES = ["bg-lime", "bg-teal", "bg-mint", "bg-gold", "bg-lime-field", "bg-[#c9c6ff]"];

/** The care side of the balance, as a row of playful icon cards. */
export function Benefits() {
  return (
    <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
      {benefits.map((b, i) => (
        <motion.li
          key={b.id}
          className={cn(
            "group flex min-h-44 flex-col justify-between rounded-3xl p-5 text-ink shadow-md transition-[transform,box-shadow] duration-500 ease-[var(--ease-spring)] hover:-translate-y-2 hover:rotate-[-1.5deg] hover:shadow-xl sm:min-h-52",
            TILES[i % TILES.length],
          )}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.07 }}
        >
          <BenefitGlyph
            icon={b.icon}
            className="h-12 w-12 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-125 group-hover:rotate-[-10deg]"
          />
          <p className="mt-6 text-base leading-snug font-extrabold sm:text-lg">{b.title}</p>
        </motion.li>
      ))}
    </ul>
  );
}
