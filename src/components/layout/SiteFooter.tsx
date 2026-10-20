"use client";

import { motion } from "framer-motion";
import { navSections } from "@/content/site";
import { useScrollTo } from "@/components/motion/SmoothScroll";

/** Back cover: Journey Further lands big, and the sections run across the page as a single row of links. */
export function SiteFooter() {
  const scrollTo = useScrollTo();

  return (
    <footer className="bg-lime-field text-ink">
      <div className="mx-auto max-w-[1680px] px-4 pt-16 pb-8 sm:px-8 lg:pt-24">
        <motion.p
          className="font-display text-[clamp(1.6rem,7.6vw,8.4rem)] leading-none whitespace-nowrap"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        >
          Journey Further
        </motion.p>

        <nav aria-label="Footer" className="mt-12 border-t-2 border-ink pt-6 lg:mt-16">
          <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-extrabold xl:justify-between">
            {navSections.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => scrollTo(s.id)} className="underline-offset-4 hover:underline">
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10 text-xs font-semibold text-ink/80 sm:text-sm">The Journey Further Culture Code</p>
      </div>
    </footer>
  );
}
