"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { values } from "@/content/code";
import { cn } from "@/lib/cn";
import { MediaImage } from "@/components/ui/MediaImage";

const LENS_RADIUS = 90;

/**
 * The four Open principles as tabs. On desktop a magnifying lens follows the
 * cursor and "inspects" the copy, and the illustrated investigator leans in.
 */
export function OpenPrinciples() {
  const principles = values.open.blocks;
  const [active, setActive] = useState(0);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const [lensOn, setLensOn] = useState(false);
  const clip = useMotionTemplate`circle(${LENS_RADIUS}px at ${mx}px ${my}px)`;
  const origin = useMotionTemplate`${mx}px ${my}px`;
  const ringX = useTransform(mx, (v) => v - LENS_RADIUS);
  const ringY = useTransform(my, (v) => v - LENS_RADIUS);

  const lean = useSpring(0, { stiffness: 80, damping: 14 });
  const leanX = useTransform(lean, (v) => v * 24);
  const leanRotate = useTransform(lean, (v) => v * 6);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    lean.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    if (e.pointerType !== "mouse" || reduce) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
    setLensOn(true);
  };

  const select = (i: number) => {
    const next = (i + principles.length) % principles.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(active + 1),
      ArrowDown: () => select(active + 1),
      ArrowLeft: () => select(active - 1),
      ArrowUp: () => select(active - 1),
      Home: () => select(0),
      End: () => select(principles.length - 1),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  const panelBody = (p: (typeof principles)[number]) => (
    <>
      <p className="font-display text-sm text-charcoal">
        {String(active + 1).padStart(2, "0")} / {String(principles.length).padStart(2, "0")}
      </p>
      <h4 className="font-display mt-4 text-2xl sm:text-4xl">{p.heading}</h4>
      {p.body.map((t, i) => (
        <p key={i} className="mt-6 text-lg leading-relaxed sm:text-xl">
          {t}
        </p>
      ))}
    </>
  );

  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-12">
          <h3 className="sr-only">Open principles</h3>
          <div
            role="tablist"
            aria-label="Open principles"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {principles.map((p, i) => (
              <button
                key={p.heading}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={active === i}
                aria-controls={`${id}-panel`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors lg:py-5",
                  active === i ? "text-charcoal" : "text-ink/70 hover:bg-white hover:text-ink",
                )}
              >
                {active === i && (
                  <motion.span
                    layoutId={`${id}-active`}
                    className="absolute inset-0 -z-0 rounded-2xl bg-sage shadow-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="font-display relative text-sm">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative text-base font-extrabold sm:text-lg lg:text-xl">{p.heading}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <div
              id={`${id}-panel`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${active}`}
              tabIndex={0}
              onPointerMove={onPointerMove}
              onPointerLeave={() => {
                setLensOn(false);
                lean.set(0);
              }}
              className="relative min-h-[26rem] overflow-hidden rounded-[2rem] bg-sage p-7 text-charcoal shadow-xl sm:p-12 lg:cursor-none"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-[46rem] lg:pr-40"
                >
                  {panelBody(principles[active])}
                </motion.div>
              </AnimatePresence>

              {lensOn && (
                <>
                  <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#7fb4ab]" style={{ clipPath: clip }}>
                    <motion.div className="absolute inset-0 p-7 sm:p-12" style={{ scale: 1.35, transformOrigin: origin }}>
                      <div className="max-w-[46rem] lg:pr-40">{panelBody(principles[active])}</div>
                    </motion.div>
                  </motion.div>
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-0 rounded-full border-[6px] border-charcoal shadow-[inset_0_0_0_3px_rgb(255_255_255/0.6),0_10px_25px_rgb(0_0_0/0.3)]"
                    style={{ x: ringX, y: ringY, width: LENS_RADIUS * 2, height: LENS_RADIUS * 2 }}
                  />
                </>
              )}
            </div>

            <motion.div
              aria-hidden="true"
              className="pointer-events-none mx-auto -mt-6 w-[70%] max-w-[360px] lg:absolute lg:-right-14 lg:-bottom-28 lg:mt-0 lg:w-[36%]"
              style={{ x: leanX, rotate: leanRotate }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <MediaImage name="illustrations/magnifier-phone" alt="" sizes="(min-width: 1024px) 420px, 78vw" className="h-auto w-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
