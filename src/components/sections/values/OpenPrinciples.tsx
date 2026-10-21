"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { values } from "@/content/code";
import { cn } from "@/lib/cn";
import { MediaImage } from "@/components/ui/MediaImage";

const LENS_RADIUS = 95;

/**
 * The four Open principles as one scene in a single card: the principles on
 * the left, the "We challenge directly" mountain rising out of the card's
 * floor on the right, and the investigator leaping off the card's top edge
 * towards the summit. On desktop a magnifying lens follows the cursor across
 * the whole card, and the investigator leans with it.
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

  const tabClass = (on: boolean) =>
    cn(
      "relative flex h-full items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-left text-sm leading-tight font-extrabold transition-colors sm:text-[0.95rem]",
      on ? "text-white" : "bg-white/35 text-charcoal hover:bg-white/70",
    );

  /*
   * The card's contents, drawn twice: once for real, and once (decorative, scaled up) inside the lens.
   * Every principle sits in the same grid cell, so the copy never jumps about when you switch.
   */
  const scene = (decorative: boolean) => (
    <div className="grid gap-6 px-5 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10 lg:px-10 lg:pt-10">
      <div className="lg:pb-10">
        <div
          {...(decorative
            ? { "aria-hidden": true }
            : { role: "tablist", "aria-label": "Open principles", "aria-orientation": "horizontal" as const, onKeyDown })}
          className="grid grid-cols-2 gap-2"
        >
          {principles.map((p, i) =>
            decorative ? (
              <span key={p.heading} className={tabClass(active === i)}>
                {active === i && <span className="absolute inset-0 rounded-2xl bg-charcoal" />}
                <span className="font-display relative text-[0.7rem] opacity-80">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative">{p.heading}</span>
              </span>
            ) : (
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
                className={tabClass(active === i)}
              >
                {active === i && (
                  <motion.span
                    layoutId={`${id}-active`}
                    className="absolute inset-0 rounded-2xl bg-charcoal shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="font-display relative text-[0.7rem] opacity-80">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative">{p.heading}</span>
              </button>
            ),
          )}
        </div>

        <div
          {...(decorative ? { "aria-hidden": true } : { id: `${id}-panel`, role: "tabpanel", "aria-labelledby": `${id}-tab-${active}`, tabIndex: 0 })}
          className="mt-6 grid"
        >
          {principles.map((p, i) => (
            <motion.div
              key={p.heading}
              aria-hidden={decorative || i !== active}
              inert={decorative || i !== active}
              className="[grid-area:1/1]"
              initial={false}
              animate={i === active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: decorative ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-sm text-charcoal">
                {String(i + 1).padStart(2, "0")} / {String(principles.length).padStart(2, "0")}
              </p>
              <h4 className="font-display mt-3 text-2xl sm:text-3xl">{p.heading}</h4>
              {p.body.map((t, k) => (
                <p key={k} className="mt-4 text-base leading-relaxed sm:text-lg">
                  {t}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* The mountain rises out of the card's floor. */}
      <div className="flex items-end justify-center lg:justify-end">
        <MediaImage
          name="lettering/challenge-directly"
          alt=""
          sizes="(min-width: 1024px) 620px, 92vw"
          className="-mb-px h-auto w-full max-w-[620px]"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-4 pt-36 pb-20 sm:px-8 sm:pt-40 lg:pt-44 lg:pb-28">
        <h3 className="sr-only">Open principles</h3>
        <figure className="relative">
          <motion.div
            onPointerMove={onPointerMove}
            onPointerLeave={() => {
              setLensOn(false);
              lean.set(0);
            }}
            className="relative overflow-hidden rounded-[2.25rem] bg-sage text-charcoal shadow-2xl lg:cursor-none"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 110, damping: 16 }}
          >
            {scene(false)}

            {lensOn && (
              <>
                <motion.div aria-hidden="true" inert className="pointer-events-none absolute inset-0 bg-[#7fb4ab]" style={{ clipPath: clip }}>
                  <motion.div className="absolute inset-0" style={{ scale: 1.35, transformOrigin: origin }}>
                    {scene(true)}
                  </motion.div>
                </motion.div>
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 rounded-full border-[6px] border-charcoal shadow-[inset_0_0_0_3px_rgb(255_255_255/0.6),0_10px_25px_rgb(0_0_0/0.3)]"
                  style={{ x: ringX, y: ringY, width: LENS_RADIUS * 2, height: LENS_RADIUS * 2 }}
                />
              </>
            )}
          </motion.div>

          {/* The investigator leaps out of her phone off the card's top edge, heading for the summit. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-[4%] -top-32 z-10 w-[44%] max-w-[230px] sm:-top-40 sm:right-[8%] sm:w-[30%] lg:-top-40 lg:right-[24%] lg:w-[20%] lg:max-w-[260px]"
            style={{ x: leanX, rotate: leanRotate }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
          >
            <MediaImage name="illustrations/magnifier-phone" alt="" sizes="(min-width: 1024px) 260px, 44vw" className="h-auto w-full" />
          </motion.div>
          <figcaption className="sr-only">{values.open.pullGraphic}</figcaption>
        </figure>
      </div>
    </div>
  );
}
