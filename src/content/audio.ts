/**
 * Narrated sections. Each file is the reading mixed over an original
 * backing track by scripts/build_audio.py. Add an entry here and drop a
 * <SectionAudio narration="…" /> next to the section heading.
 */
export type Narration = { src: string; title: string };

export const narrations = {
  evolution: { src: "/audio/evolution.mp3", title: "The Evolution" },
} as const satisfies Record<string, Narration>;

export type NarrationId = keyof typeof narrations;
