"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { narrations, type NarrationId } from "@/content/audio";
import { cn } from "@/lib/cn";

/** Only one narration plays at a time: starting one pauses the others. */
const PLAY_EVENT = "jf-narration-play";

const RING = 2 * Math.PI * 22;

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.87l10.4-6.5a1 1 0 0 0 0-1.74L9.5 4.63A1 1 0 0 0 8 5.5z" fill="currentColor" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M5 5v5h5M5.6 14.5A7 7 0 1 0 6.5 7.5L5 10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Bouncing bars while the narration plays (static with reduced motion). */
function Equaliser({ playing }: { playing: boolean }) {
  const reduce = useReducedMotion();
  const moving = playing && !reduce;
  return (
    <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-current"
          initial={false}
          animate={moving ? { height: ["30%", `${h * 100}%`, "45%", `${(1.2 - h) * 100}%`, "30%"] } : { height: "30%" }}
          transition={moving ? { type: "tween", duration: 0.9 + i * 0.13, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        />
      ))}
    </span>
  );
}

/** A small play / pause / restart control for a narrated section. */
export function SectionAudio({ narration, className }: { narration: NarrationId; className?: string }) {
  const { src, title } = narrations[narration];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // Metadata can load before hydration, so the duration event may already have fired.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const sync = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.addEventListener("durationchange", sync);
    if (audio.readyState > 0) sync();
    return () => audio.removeEventListener("durationchange", sync);
  }, []);

  useEffect(() => {
    const onOtherPlay = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== narration) audioRef.current?.pause();
    };
    window.addEventListener(PLAY_EVENT, onOtherPlay);
    return () => window.removeEventListener(PLAY_EVENT, onOtherPlay);
  }, [narration]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: narration }));
      void audio.play();
    } else {
      audio.pause();
    }
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrent(0);
    if (audio.paused) toggle();
  };

  const progress = duration ? current / duration : 0;
  const started = current > 0 || playing;

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
      />

      <motion.button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? "Pause" : "Play"} the narration of ${title}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-lime text-ink shadow-lg"
      >
        <svg viewBox="0 0 52 52" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="26" cy="26" r="22" fill="none" stroke="rgb(54 52 54 / 0.15)" strokeWidth="3.5" />
          <circle
            cx="26"
            cy="26"
            r="22"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - progress)}
          />
        </svg>
        <PlayIcon playing={playing} />
      </motion.button>

      <div className="flex flex-col">
        <span className="flex items-center gap-2 text-sm font-extrabold">
          <Equaliser playing={playing} />
          {playing ? "Listening" : started ? "Paused" : "Listen to this section"}
        </span>
        <span className="text-xs font-semibold text-ink/75 tabular-nums">
          {time(current)} / {duration ? time(duration) : "--:--"}
        </span>
      </div>

      {started && (
        <motion.button
          type="button"
          onClick={restart}
          aria-label={`Restart the narration of ${title}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ rotate: -45 }}
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink/25 text-ink hover:border-ink"
        >
          <RestartIcon />
        </motion.button>
      )}
    </div>
  );
}
