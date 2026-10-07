"use client";

import { LayoutGroup } from "framer-motion";
import { useEffect, useRef } from "react";
import { ui } from "@/content/site";
import type { Story } from "@/content/types";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { PlusIcon } from "@/components/ui/Icons";
import { StoryCard } from "./StoryCard";
import { StoryFilters } from "./StoryFilters";
import { useStories } from "./StoriesProvider";

/** Rough card height, used to balance the masonry columns. */
const estimate = (s: Story) => 220 + s.body.length * 0.55 + (s.image ? 240 : 0);

function toColumns(stories: Story[], count: number): Story[][] {
  const cols: Story[][] = Array.from({ length: count }, () => []);
  const heights = new Array<number>(count).fill(0);
  for (const story of stories) {
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].push(story);
    heights[shortest] += estimate(story);
  }
  return cols;
}

/* New example stories "arrive" a few seconds after the wall comes into view. */
const ARRIVALS_MS = [6000, 18000];

/** Values in the Wild: a filterable, animated masonry wall of stories. */
export function StoryWall() {
  const { filtered, openShare, receiveIncoming } = useStories();
  const wide = useMediaQuery("(min-width: 1100px)");
  const medium = useMediaQuery("(min-width: 640px)");
  const columns = toColumns(filtered, wide ? 3 : medium ? 2 : 1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        ARRIVALS_MS.forEach((ms) => timers.push(window.setTimeout(receiveIncoming, ms)));
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [receiveIncoming]);

  return (
    <div ref={ref}>
      <StoryFilters count={filtered.length} />

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-ink/25 px-6 py-16 text-center">
          <p className="font-display text-2xl">{ui.wallEmpty}</p>
          <button
            type="button"
            onClick={openShare}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-extrabold text-white transition-transform hover:scale-105"
          >
            <PlusIcon className="h-4 w-4" />
            {ui.shareStory}
          </button>
        </div>
      ) : (
        <LayoutGroup id="wall">
          <div className="mt-8 flex items-start gap-4 sm:gap-5">
            {columns.map((col, i) => (
              <ul key={i} className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
                {col.map((story) => (
                  <li key={story.id}>
                    <StoryCard story={story} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </LayoutGroup>
      )}
    </div>
  );
}
