"use client";

import { ui, valueMeta } from "@/content/site";
import type { ValueId } from "@/content/types";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { ArrowIcon } from "@/components/ui/Icons";
import { StoryCard } from "./StoryCard";
import { useStories } from "./StoriesProvider";

const LIMIT = 4;

/** "Live from the team": the latest stories tagged with one value, straight from the wall. */
export function LiveStrip({ value }: { value: ValueId }) {
  const { stories, setFilters } = useStories();
  const scrollTo = useScrollTo();
  const latest = stories.filter((s) => s.value === value).slice(0, LIMIT);

  const seeAll = () => {
    setFilters({ value, type: "all", office: "all", query: "" });
    scrollTo("values-in-the-wild");
  };

  return (
    <section aria-label={`${ui.liveFromTeam}: ${valueMeta[value].label}`} className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h4 className="font-display flex items-center gap-3 text-xl sm:text-3xl">
          <span className="relative flex h-3 w-3">
            <span className="h-3 w-3 animate-pulse-dot rounded-full bg-teal" />
          </span>
          {ui.liveFromTeam}
        </h4>
        <button
          type="button"
          onClick={seeAll}
          className="group inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-sm font-extrabold transition-colors hover:bg-ink hover:text-white"
        >
          {ui.seeAllStories}
          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <ul
        className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0"
      >
        {latest.map((story) => (
          <li key={story.id} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
            <StoryCard story={story} variant="strip" />
          </li>
        ))}
      </ul>
    </section>
  );
}
