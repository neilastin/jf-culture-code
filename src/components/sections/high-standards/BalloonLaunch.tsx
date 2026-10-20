"use client";

import { AnimatePresence, motion, type TargetAndTransition, type Transition } from "framer-motion";
import { useRef, useState } from "react";
import { media, type MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";
import { confetti } from "@/lib/eggs";
import { Hint, useHint } from "@/components/ui/Hint";
import { MediaImage } from "@/components/ui/MediaImage";

type Burners = { standards: boolean; care: boolean };
type Mode = "grounded" | "standards" | "care" | "soaring";

/*
 * Rig geometry, as % of the shared balloon canvas (all five layers line up exactly).
 * Each flame sits under its balloon's mouth; the glow shows through the envelope.
 */
const FLAME = { standards: "25.5% 49.5%", care: "74.5% 49.5%" } as const;
const GLOW = { standards: "25.5% 39%", care: "74.5% 39%" } as const;

/* The seven photos, floating in the sky around the balloon on wide screens. */
const PHOTOS: { media: MediaKey; alt: string; place: string; rotate: number; drift: string }[] = [
  {
    media: "photos/hs-1",
    alt: "Three colleagues working together on laptops round a café table",
    place: "left-[2%] top-[4%] w-[19%]",
    rotate: -5,
    drift: "70%",
  },
  {
    media: "photos/hs-2",
    alt: "A colleague presenting on stage in front of a Journey Further screen",
    place: "left-[5%] top-[31%] w-[20%]",
    rotate: 4,
    drift: "95%",
  },
  {
    media: "photos/hs-3",
    alt: "Five colleagues with lanyards at the Journey Further stand at a conference",
    place: "left-[1%] top-[55%] w-[17%]",
    rotate: -3,
    drift: "120%",
  },
  {
    media: "photos/hs-4",
    alt: "The team smiling for a selfie over lunch on a sunny rooftop terrace",
    place: "right-[2%] top-[3%] w-[17%]",
    rotate: 5,
    drift: "75%",
  },
  {
    media: "photos/hs-7",
    alt: "A colleague laughing with a coffee in front of a Journey Further sign",
    place: "right-[14%] top-[30%] w-[16%]",
    rotate: -4,
    drift: "100%",
  },
  {
    media: "photos/hs-5",
    alt: "A group of colleagues with drinks outside a London venue",
    place: "right-[1%] top-[32%] w-[11%]",
    rotate: 6,
    drift: "90%",
  },
  {
    media: "photos/hs-6",
    alt: "Two colleagues on a Tube platform in front of a poster campaign we worked on",
    place: "right-[3%] top-[57%] w-[18%]",
    rotate: -3,
    drift: "125%",
  },
];

/* What the status line says. Nothing while grounded: the ask at the top already says what to do. */
const COPY: Record<Mode, string> = {
  grounded: "",
  standards: "No soaring yet. We'll wobble if we focus only on standards and not care!",
  care: "No soaring yet. We can't reach new heights if we don't always push for high standards!",
  soaring: "Now we're soaring! High standards and high care together, that's what it takes.",
};

/*
 * The rig moves in two layers so nothing ever snaps back. The outer layer settles into the pose for
 * each mode (lift one side, or climb); the inner layer keeps up a gentle, endless wobble or sway.
 */
const ASK = "Tap a balloon to fire the burners and take Journey Further to new heights!";

const POSE: Record<Mode, TargetAndTransition> = {
  grounded: { y: "0%", rotate: 0 },
  standards: { y: "-6%", rotate: 11 },
  care: { y: "-6%", rotate: -11 },
  soaring: { y: "-14%", rotate: 0 },
};
const POSE_MOTION: Transition = { type: "spring", stiffness: 60, damping: 9 };
const MOTION_LOOP: Record<Mode, string> = {
  grounded: "motion-safe:animate-[idle-sway_4s_ease-in-out_infinite]",
  standards: "motion-safe:animate-[lopsided_1.5s_ease-in-out_infinite]",
  care: "motion-safe:animate-[lopsided_1.5s_ease-in-out_infinite]",
  soaring: "motion-safe:animate-[idle-sway_5s_ease-in-out_infinite]",
};

function Cloud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 200 80" aria-hidden="true" className={cn("absolute fill-white", className)}>
      <ellipse cx="62" cy="52" rx="44" ry="26" />
      <ellipse cx="104" cy="38" rx="42" ry="34" />
      <ellipse cx="146" cy="54" rx="40" ry="24" />
      <rect x="30" y="52" width="150" height="26" rx="13" />
    </svg>
  );
}

function Polaroid({ name, alt, rotate, sizes, className }: { name: MediaKey; alt: string; rotate: number; sizes: string; className?: string }) {
  return (
    <figure className={cn("bg-white p-1.5 pb-5 shadow-[0_18px_34px_rgb(0_0_0/0.35)] sm:p-2 sm:pb-7", className)} style={{ rotate: `${rotate}deg` }}>
      <MediaImage name={name} alt={alt} sizes={sizes} className="h-auto w-full" />
    </figure>
  );
}

/** One burner: the flame (drawn behind the balloon) or the glow it casts inside the envelope (drawn over it). */
function Burner({ side, on, part }: { side: "standards" | "care"; on: boolean; part: "flame" | "glow" }) {
  const balloon = media[side === "standards" ? "illustrations/balloon-left" : "illustrations/balloon-right"].src;
  return part === "flame" ? (
    <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-200", on ? "opacity-100" : "opacity-0")}>
      <div className="h-full w-full motion-safe:animate-[flame_0.35s_ease-in-out_infinite_alternate]" style={{ transformOrigin: FLAME[side] }}>
        <MediaImage
          name={side === "standards" ? "illustrations/balloon-fire-left" : "illustrations/balloon-fire-right"}
          alt=""
          fill
          sizes="540px"
          className="object-contain"
        />
      </div>
    </div>
  ) : (
    <div
      data-glow={side}
      aria-hidden="true"
      className={cn("absolute inset-0 transition-opacity duration-500", on ? "opacity-100" : "opacity-0")}
      style={{ maskImage: `url(${balloon})`, WebkitMaskImage: `url(${balloon})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
    >
      <div
        className="h-full w-full mix-blend-screen motion-safe:animate-[glow-pulse_0.9s_ease-in-out_infinite_alternate]"
        style={{
          background: `radial-gradient(ellipse 26% 22% at ${GLOW[side]}, rgb(255 196 90 / 0.85), rgb(255 150 60 / 0.35) 55%, transparent 80%)`,
        }}
      />
    </div>
  );
}

/**
 * HIGH STANDARDS. HIGH CARE. in the hand-lettering: the section's big headline, at the top of the sky.
 * Two stacks side by side, HIGH over each word. Sizes are set as heights so the lettering keeps its shape.
 */
function Headline() {
  const high = "h-[clamp(4.6rem,min(10.5vw,14svh),9rem)] w-auto";
  return (
    <motion.div
      className="flex items-start justify-center gap-[6%] drop-shadow-[0_8px_18px_rgb(0_0_0/0.4)]"
      initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: "spring", stiffness: 200, damping: 13 }}
    >
      {[
        { key: "standards", media: "lettering/hs-standards" as const, word: "h-[clamp(3.3rem,min(7.6vw,10svh),6.6rem)]" },
        { key: "care", media: "lettering/hs-care" as const, word: "h-[clamp(4.3rem,min(10vw,13.5svh),8.5rem)]" },
      ].map((w) => (
        <span key={w.key} className="flex flex-col items-center">
          <MediaImage name="lettering/hs-high" alt="" sizes="(min-width: 1024px) 120px, 60px" className={high} />
          <MediaImage name={w.media} alt="" sizes="(min-width: 1024px) 300px, 30vw" className={cn(w.word, "-mt-[0.9rem] w-auto lg:-mt-6")} />
        </span>
      ))}
    </motion.div>
  );
}

/**
 * High Standards. High Care. as a hot air balloon that only flies with both.
 * Fire one burner and the rig lifts on one side and wobbles; fire both and it
 * levels off while the ground, photos and clouds rush away below.
 */
export function BalloonLaunch() {
  const [burners, setBurners] = useState<Burners>({ standards: false, care: false });
  const stageRef = useRef<HTMLDivElement>(null);
  const [hint, dismissHint] = useHint(stageRef, 2600);
  const mode: Mode = burners.standards && burners.care ? "soaring" : burners.standards ? "standards" : burners.care ? "care" : "grounded";
  const soaring = mode === "soaring";

  const toggle = (side: keyof Burners) => {
    dismissHint();
    setBurners((b) => {
      const next = { ...b, [side]: !b[side] };
      if (next.standards && next.care && !(b.standards && b.care)) {
        const r = stageRef.current?.getBoundingClientRect();
        if (r) window.setTimeout(() => confetti({ x: r.left + r.width / 2, y: r.top + r.height * 0.4 }, 90), 700);
      }
      return next;
    });
  };

  return (
    <div>
      {/*
       * The sky fills the screen: the headline and the ask at the top, the rig on a raised launch
       * hill in the middle, and what's happening on the hill below it.
       */}
      <div
        ref={stageRef}
        data-sky
        className="relative h-[clamp(600px,calc(100svh-var(--nav-h)-4.5rem),900px)] overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#232445_0%,#464c95_36%,#8f86c9_64%,#f6c48f_86%,#f4c625_100%)] shadow-2xl"
      >
        {/* Clouds that drift across while we wait. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          animate={{ y: soaring ? "70%" : "0%", opacity: soaring ? 0 : 1 }}
          transition={{ duration: 1.4, ease: "easeIn" }}
        >
          <Cloud className="top-[26%] w-[16%] opacity-70 motion-safe:animate-[drift_44s_linear_-30s_infinite]" />
          <Cloud className="top-[48%] w-[18%] opacity-60 motion-safe:animate-[drift_52s_linear_-12s_infinite]" />
        </motion.div>

        {/* Clouds that rush past while we climb. */}
        <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-700", soaring ? "opacity-100" : "opacity-0")}>
          {[
            { left: "8%", w: "20%", delay: "0s", dur: "2.6s" },
            { left: "64%", w: "24%", delay: "-1.1s", dur: "3s" },
            { left: "34%", w: "14%", delay: "-0.4s", dur: "2.2s" },
            { left: "80%", w: "13%", delay: "-1.8s", dur: "2.4s" },
            { left: "2%", w: "15%", delay: "-2.2s", dur: "2.8s" },
          ].map((c) => (
            <div key={c.left} className="absolute top-0" style={{ left: c.left, width: c.w }}>
              <div
                className="motion-safe:animate-[rush-past_var(--dur)_linear_infinite]"
                style={{ animationDelay: c.delay, ["--dur" as string]: c.dur }}
              >
                <Cloud className="relative w-full opacity-75" />
              </div>
            </div>
          ))}
        </div>

        {/* The photos float in the sky on wide screens, and fall away fast as the balloon climbs. */}
        <div className="hidden lg:block">
          {PHOTOS.map((p, i) => (
            <motion.div
              key={p.media}
              className={cn("absolute", p.place)}
              animate={{ y: soaring ? `${parseFloat(p.drift) * 3}%` : "0%" }}
              transition={{ type: "tween", duration: 1.6, ease: soaring ? [0.5, 0, 0.75, 0] : [0.22, 1, 0.36, 1], delay: soaring ? i * 0.05 : 0 }}
            >
              <div className="motion-safe:animate-float" style={{ animationDelay: `${-i * 0.8}s`, animationDuration: `${5 + (i % 3)}s` }}>
                <Polaroid name={p.media} alt={p.alt} rotate={p.rotate} sizes="260px" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* The launch hill, raised so the balloon starts low; it drops away fast once we soar. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[26%] lg:h-[17%]"
          animate={{ y: soaring ? "120%" : "0%" }}
          transition={{ type: "tween", duration: 1.3, ease: soaring ? [0.5, 0, 0.75, 0] : [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[34%] w-full">
            <path d="M0 60 L0 30 Q200 -6 400 30 L400 60 Z" fill="#9fc25a" />
            <path d="M0 60 L0 38 Q200 6 400 38 L400 60 Z" fill="#c8df88" />
          </svg>
          <div className="absolute inset-x-0 top-[33%] bottom-0 bg-[#c8df88]" />
        </motion.div>

        {/* The headline and the ask. */}
        <div className="absolute inset-x-0 top-[3%] z-20 px-4 text-center text-white lg:top-[4%]">
          <Headline />
          {/* On small screens the ask sits under the headline; on wide screens it waits on the hill below. */}
          <motion.p
            className="font-display mx-auto mt-3 max-w-[30rem] text-[clamp(0.95rem,1.7vw,1.35rem)] leading-tight drop-shadow-[0_3px_12px_rgb(0_0_0/0.35)] lg:hidden"
            animate={{ opacity: soaring ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            {ASK}
          </motion.p>
        </div>

        {/* The rig: an outer pose that settles, and an inner wobble or sway that never resets. */}
        <motion.div
          className="absolute bottom-[21%] left-1/2 aspect-[835/1072] h-[44%] max-w-[90%] -translate-x-1/2 origin-[50%_85%] sm:h-[46%] lg:bottom-[16%] lg:h-[40%]"
          animate={POSE[mode]}
          transition={POSE_MOTION}
        >
          <div className={cn("relative h-full w-full origin-[50%_85%]", MOTION_LOOP[mode])}>
            <Burner side="standards" part="flame" on={burners.standards} />
            <Burner side="care" part="flame" on={burners.care} />
            <MediaImage name="illustrations/balloon-left" alt="" fill sizes="(min-width: 1024px) 480px, 80vw" className="object-contain" />
            <MediaImage name="illustrations/balloon-right" alt="" fill sizes="(min-width: 1024px) 480px, 80vw" className="object-contain" />
            <MediaImage
              name="illustrations/balloon-basket"
              alt="A hot air balloon basket marked Journey Further, carried by two balloons: High Standards and High Care"
              fill
              sizes="(min-width: 1024px) 480px, 80vw"
              className="object-contain"
            />
            <Burner side="standards" part="glow" on={burners.standards} />
            <Burner side="care" part="glow" on={burners.care} />
            <button
              type="button"
              aria-label={burners.standards ? "Turn off the High Standards burner" : "Fire the High Standards burner"}
              aria-pressed={burners.standards}
              onClick={() => toggle("standards")}
              className="absolute top-0 left-0 h-[48%] w-1/2 cursor-pointer rounded-[50%]"
            />
            <button
              type="button"
              aria-label={burners.care ? "Turn off the High Care burner" : "Fire the High Care burner"}
              aria-pressed={burners.care}
              onClick={() => toggle("care")}
              className="absolute top-0 right-0 h-[48%] w-1/2 cursor-pointer rounded-[50%]"
            />
          </div>
          <Hint show={hint} tone="light" className="absolute top-[47%] left-1/2 -translate-x-1/2">
            Tap a balloon
          </Hint>
        </motion.div>

        {/* What's happening, given plenty of room on the hill now the balloons themselves are the buttons. */}
        <div aria-live="polite" className="absolute inset-x-0 bottom-[4%] z-20 flex justify-center px-4 lg:bottom-[5%]">
          <AnimatePresence mode="wait">
            {mode === "grounded" && (
              <motion.p
                key="ask"
                className="font-display hidden max-w-[44rem] rounded-3xl bg-ink/85 px-7 py-4 text-center text-xl leading-tight text-white shadow-xl backdrop-blur-sm lg:block"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                {ASK}
              </motion.p>
            )}
            {mode !== "grounded" && (
              <motion.p
                key={mode}
                className={cn(
                  "flex max-w-[44rem] items-center gap-3 rounded-3xl px-5 py-3.5 text-left text-base leading-snug font-extrabold shadow-xl sm:gap-4 sm:px-7 sm:py-4 sm:text-xl lg:text-2xl",
                  soaring ? "bg-lime text-ink" : "bg-ink/90 text-white backdrop-blur-sm",
                )}
                initial={{ opacity: 0, y: 16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <span aria-hidden="true" className="text-2xl sm:text-3xl">
                  {soaring ? "🎈" : "🔥"}
                </span>
                {COPY[mode]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* On smaller screens all seven photos sit in a tidy, lightly tilted grid under the balloon. */}
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-[4%] gap-y-5 lg:hidden">
        {PHOTOS.map((p) => (
          <li key={p.media} className={cn(p.media === "photos/hs-5" ? "w-[34%] sm:w-[22%]" : "w-[46%] sm:w-[30%]")}>
            <Polaroid name={p.media} alt={p.alt} rotate={p.rotate * 0.5} sizes="(min-width: 640px) 240px, 46vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
