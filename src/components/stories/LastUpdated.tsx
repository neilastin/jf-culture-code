"use client";

import { ui } from "@/content/site";
import { formatDate, relativeDate } from "@/lib/dates";
import { useNow } from "@/lib/useNow";
import { useStories } from "./StoriesProvider";

/** Shows when the newest story landed, so it's obvious the page changes. */
export function LastUpdated() {
  const { lastUpdated } = useStories();
  const now = useNow();
  if (!lastUpdated) return null;
  return (
    <p className="inline-flex items-center gap-2.5 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
      <span className="h-2.5 w-2.5 animate-pulse-dot rounded-full bg-teal" aria-hidden="true" />
      {ui.lastUpdated}: {now ? relativeDate(lastUpdated, now) : formatDate(lastUpdated)}
    </p>
  );
}
