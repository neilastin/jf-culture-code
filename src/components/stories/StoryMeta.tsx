"use client";

import { ui } from "@/content/site";
import type { Story } from "@/content/types";
import { formatDate, relativeDate } from "@/lib/dates";
import { useNow } from "@/lib/useNow";

/** Who, where and when, in one quiet line. */
export function StoryMeta({ story }: { story: Story }) {
  const now = useNow();
  const who = story.author ? [story.author.name, story.author.role].filter(Boolean).join(", ") : ui.anonymous;
  const when = story.date ? (now ? relativeDate(story.date, now) : formatDate(story.date)) : null;
  const parts = [who, story.office, when].filter(Boolean);
  return <p className="text-sm text-ink/70">{parts.join(" · ")}</p>;
}
