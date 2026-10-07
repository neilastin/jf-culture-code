"use client";

import { useRef } from "react";
import { whoWeAre } from "@/content/code";
import { timeline } from "@/content/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { RevealText } from "@/components/motion/RevealText";
import { MediaImage } from "@/components/ui/MediaImage";
import { SectionAudio } from "@/components/ui/SectionAudio";

const ROW = 100 / timeline.length;
/* Stops weave left and right of the line's strip. */
const points = timeline.map((_, i) => ({ x: i % 2 === 0 ? 32 : 68, y: ROW * (i + 0.5) }));

function buildPath(): string {
  let d = `M 50 0 C 50 ${ROW * 0.25}, ${points[0].x} ${ROW * 0.25}, ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const mid = (a.y + b.y) / 2;
    d += ` C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
  }
  const last = points[points.length - 1];
  return `${d} C ${last.x} ${last.y + ROW * 0.3}, 50 ${last.y + ROW * 0.3}, 50 100`;
}

const PATH = buildPath();

/** The Evolution: a journey line that draws itself as you scroll, with stops popping in. */
export function Evolution() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-journey-line]",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: "[data-journey]", start: "top 70%", end: "bottom 65%", scrub: 0.5 },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-stop]").forEach((stop) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: stop, start: "top 72%", toggleActions: "play none none reverse" } });
          tl.from(stop.querySelector("[data-marker]"), { scale: 0, rotate: -90, duration: 0.6, ease: "back.out(3)" }).from(
            stop.querySelector("[data-label]"),
            { x: 30, autoAlpha: 0, duration: 0.6, ease: "power3.out" },
            "<0.1",
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="bg-paper text-ink">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-32">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <RevealText as="h3" className="font-display text-3xl sm:text-5xl">
              {whoWeAre.evolution.heading}
            </RevealText>
            <SectionAudio narration="evolution" />
          </div>
          <RevealText className="mt-8 text-lg leading-relaxed sm:text-xl">{whoWeAre.evolution.body}</RevealText>
          <MediaImage
            name="photos/evolution-building"
            alt="The Journey Further sign outside a Leeds office tower"
            sizes="(min-width: 1024px) 600px, 92vw"
            className="mt-10 h-auto w-full rounded-3xl object-cover shadow-xl lg:max-h-[38vh]"
          />
        </div>

        <div data-journey className="relative [--strip:6rem] sm:[--strip:8rem]" style={{ height: `${timeline.length * 9.5}rem` }}>
          <h4 className="sr-only">Our journey so far</h4>
          <svg
            aria-hidden="true"
            className="absolute inset-y-0 left-0 h-full w-24 overflow-visible sm:w-32"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d={PATH} fill="none" stroke="rgb(54 52 54 / 0.12)" strokeWidth="10" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path
              data-journey-line
              d={PATH}
              fill="none"
              stroke="var(--color-part)"
              strokeWidth="10"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray="1"
            />
          </svg>

          <ol className="absolute inset-0">
            {timeline.map((stop, i) => (
              <li
                key={stop.place}
                data-stop
                className="absolute right-0 left-0 flex -translate-y-1/2 items-center"
                style={{ top: `${points[i].y}%` }}
              >
                <span
                  data-marker
                  aria-hidden="true"
                  className="absolute grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border-4 border-paper bg-ink shadow-lg sm:h-14 sm:w-14"
                  style={{ left: `calc(${points[i].x / 100} * var(--strip))` }}
                >
                  <span className={i === 0 ? "h-4 w-4 rounded-full bg-gold" : "h-4 w-4 rounded-full bg-teal"} />
                </span>
                <div data-label className="min-w-0 pl-[calc(var(--strip)+1.25rem)]">
                  {stop.year && (
                    <span className="font-display mb-1 inline-block rounded-md bg-gold px-2 py-1 text-xs">{stop.year}</span>
                  )}
                  <p className="font-display text-xl sm:text-3xl">{stop.place}</p>
                  <p className="mt-1 text-base text-ink/75 sm:text-lg">{stop.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
