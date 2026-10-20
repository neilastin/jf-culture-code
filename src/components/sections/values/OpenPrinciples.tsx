"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
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

  /*
   * Every principle sits in the same grid cell, so the panel is always as
   * tall as the longest one and never jumps about. The shorter ones sit centred.
   */
  const panels = (decorative: boolean) => (
    <div className="grid">
      {principles.map((p, i) => (
        <motion.div
          key={p.heading}
          aria-hidden={decorative || i !== active}
          inert={decorative || i !== active}
          className="flex flex-col justify-center [grid-area:1/1]"
          initial={false}
          animate={i === active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {panelBody(p, i)}
        </motion.div>
      ))}
    </div>
  );

  const panelBody = (p: (typeof principles)[number], index: number) => (
    <>
      <p className="font-display text-sm text-charcoal">
        {String(index + 1).padStart(2, "0")} / {String(principles.length).padStart(2, "0")}
      </p>
      <h4 className="font-display mt-3 text-2xl sm:text-3xl">{p.heading}</h4>
      {p.body.map((t, i) => (
        <p key={i} className="mt-4 text-base leading-relaxed sm:text-lg">
          {t}
        </p>
      ))}
    </>
  );

  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-4 pt-20 pb-20 sm:px-8 lg:pt-44 lg:pb-28">
        {/*
         * Three pieces as one scene: the principles card, the investigator leaping off its corner,
         * and the mountain she's heading for, tucked in behind the card's right edge.
         */}
        <div className="grid items-center gap-y-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="relative z-20 order-2 mt-16 lg:order-none lg:mt-0">
            <h3 className="sr-only">Open principles</h3>
            <div className="rounded-[2rem] bg-sage p-3 text-charcoal shadow-2xl sm:p-4">
              <div
                role="tablist"
                aria-label="Open principles"
                aria-orientation="horizontal"
                onKeyDown={onKeyDown}
                className="flex flex-wrap gap-1.5 sm:gap-2 lg:pr-28"
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
                      "relative flex items-center gap-2 rounded-full px-3.5 py-2 text-left text-sm font-extrabold transition-colors sm:text-[0.95rem]",
                      active === i ? "text-white" : "bg-white/35 text-charcoal hover:bg-white/70",
                    )}
                  >
                    {active === i && (
                      <motion.span
                        layoutId={`${id}-active`}
                        className="absolute inset-0 rounded-full bg-charcoal shadow-md"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="font-display relative text-[0.7rem] opacity-80">{String(i + 1).padStart(2, "0")}</span>
                    <span className="relative">{p.heading}</span>
                  </button>
                ))}
              </div>

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
                className="relative mt-3 overflow-hidden rounded-[1.5rem] px-4 pt-4 pb-6 sm:px-6 sm:pb-8 lg:cursor-none"
              >
                {panels(false)}

                {lensOn && (
                  <>
                    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#7fb4ab]" style={{ clipPath: clip }}>
                      <motion.div className="absolute inset-0 px-4 pt-4 pb-6 sm:px-6 sm:pb-8" style={{ scale: 1.35, transformOrigin: origin }}>
                        {panels(true)}
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
            </div>

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-6 w-[34%] max-w-[260px] sm:-top-32 sm:-right-[14%] sm:w-[38%] lg:-top-40 lg:-right-[12%] lg:w-[34%]"
              style={{ x: leanX, rotate: leanRotate }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <MediaImage name="illustrations/magnifier-phone" alt="" sizes="(min-width: 1024px) 260px, 34vw" className="h-auto w-full" />
            </motion.div>
          </div>

          <motion.figure
            className="relative z-10 order-1 mx-auto w-[86%] max-w-[560px] lg:order-none lg:-ml-[10%] lg:w-[110%] lg:max-w-none"
            initial={{ y: "30%", opacity: 0, rotate: 5 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, opacity: { duration: 0.3 } }}
          >
            <MediaImage
              name="lettering/challenge-directly"
              alt=""
              sizes="(min-width: 1024px) 620px, 86vw"
              className="h-auto w-full drop-shadow-[0_18px_24px_rgb(0_0_0/0.3)]"
            />
            <figcaption className="sr-only">{values.open.pullGraphic}</figcaption>
          </motion.figure>
        </div>
      </div>
    </div>
  );
}
