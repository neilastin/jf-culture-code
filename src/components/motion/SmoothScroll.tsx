"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { gsap, MOTION_REDUCED, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia(MOTION_REDUCED).matches) return;
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -64 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}

/** Scrolls to an element id, with or without Lenis. */
export function useScrollTo() {
  const lenisRef = useContext(LenisContext);
  return useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = lenisRef?.current;
      if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.4 });
      else el.scrollIntoView({ behavior: "auto", block: "start" });
    },
    [lenisRef],
  );
}

/** Pauses smooth scrolling while a dialog is open so the page underneath stays put. */
export function useScrollLock(locked: boolean) {
  const lenisRef = useContext(LenisContext);
  useEffect(() => {
    if (!locked) return;
    const lenis = lenisRef?.current;
    lenis?.stop();
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = overflow;
    };
  }, [locked, lenisRef]);
}
