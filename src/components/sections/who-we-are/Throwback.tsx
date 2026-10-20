"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { confetti } from "@/lib/eggs";
import { useScrollLock } from "@/components/motion/SmoothScroll";
import { CloseIcon } from "@/components/ui/Icons";
import { MediaImage } from "@/components/ui/MediaImage";

type Origin = { x: number; y: number };

/**
 * Easter egg on the Leeds 2017 stop: the dot is a button, and a Polaroid of
 * the early days springs out of it into the middle of the screen.
 */
export function ThrowbackMarker({ className, style }: { className: string; style: CSSProperties }) {
  const [origin, setOrigin] = useState<Origin | null>(null);
  /** Stays true once opened, so the closing animation can still play in the portal. */
  const [portal, setPortal] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const markerRef = useRef<HTMLButtonElement>(null);
  useScrollLock(origin !== null);

  const open = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPortal(true);
    setOrigin({ x: r.left + r.width / 2 - window.innerWidth / 2, y: r.top + r.height / 2 - window.innerHeight / 2 });
    confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, 50);
  };
  const close = () => {
    setOrigin(null);
    markerRef.current?.focus();
  };

  useEffect(() => {
    if (!origin) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [origin]);

  return (
    <>
      <button
        ref={markerRef}
        type="button"
        data-marker
        onClick={open}
        aria-label="A throwback from Leeds, 2017"
        className={`${className} z-10 cursor-pointer transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-110`}
        style={style}
      >
        <span className="h-4 w-4 rounded-full bg-teal" />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-teal motion-safe:animate-ping motion-safe:[animation-duration:2.4s]"
        />
      </button>

      {/* Portalled to <body>: the timeline row is transformed, which would trap a fixed overlay inside it. */}
      {portal &&
        createPortal(
          <AnimatePresence>
            {origin && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Throwback: Leeds, 2017"
                className="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-6 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              >
                <motion.figure
                  className="relative w-[min(78vw,380px,calc((100svh-9rem)*0.68))] bg-white p-3 pb-16 shadow-[0_30px_60px_rgb(0_0_0/0.5)] sm:p-4 sm:pb-20"
                  initial={{ x: origin.x, y: origin.y, scale: 0.05, rotate: -40 }}
                  animate={{ x: 0, y: 0, scale: 1, rotate: -4 }}
                  exit={{ x: origin.x, y: origin.y, scale: 0.05, rotate: 30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 170, damping: 15 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MediaImage
                    name="photos/throwback-leeds"
                    alt="Early days in the first Leeds office: three colleagues mid-conversation by the desks"
                    sizes="380px"
                    className="aspect-[3/4] h-auto w-full object-cover"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex h-16 items-center justify-center sm:h-20">
                    <span className="font-display -rotate-2 text-xl text-ink sm:text-2xl">Leeds, 2017</span>
                  </figcaption>
                  <span aria-hidden="true" className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-2 bg-lime/80 shadow-sm" />
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Close the throwback"
                    className="absolute -top-4 -right-4 grid h-10 w-10 place-items-center rounded-full bg-ink text-white shadow-lg hover:scale-105"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </motion.figure>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
