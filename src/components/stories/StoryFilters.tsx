"use client";

import { offices, storyTypeLabels, valueMeta } from "@/content/site";
import type { StoryType, ValueId } from "@/content/types";
import { cn } from "@/lib/cn";
import { SearchIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/Select";
import { NO_FILTERS, useStories, type Filters } from "./StoriesProvider";

const VALUE_OPTIONS: (ValueId | "all")[] = ["all", "together", "open", "proactive"];
const TYPE_OPTIONS = Object.keys(storyTypeLabels) as StoryType[];

const ACTIVE_CHIP: Record<ValueId | "all", string> = {
  all: "bg-ink text-white border-ink",
  together: "bg-together text-white border-together",
  open: "bg-sage text-charcoal border-sage",
  proactive: "bg-lime text-ink border-ink",
};

/** Value chips, type and office filters, and search for the story wall. */
export function StoryFilters({ count }: { count: number }) {
  const { filters, setFilters } = useStories();
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));
  const active = filters.value !== "all" || filters.type !== "all" || filters.office !== "all" || filters.query !== "";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by value">
        {VALUE_OPTIONS.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={filters.value === v}
            onClick={() => set("value", v)}
            className={cn(
              "rounded-full border-2 px-4 py-2 text-sm font-extrabold transition-all duration-300 ease-[var(--ease-spring)] active:scale-95",
              filters.value === v ? ACTIVE_CHIP[v] : "border-ink/15 bg-white text-ink hover:-translate-y-0.5 hover:border-ink/40",
            )}
          >
            {v === "all" ? "All values" : valueMeta[v].label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="filter-type">
          Story type
        </label>
        <Select id="filter-type" value={filters.type} onChange={(e) => set("type", e.target.value as Filters["type"])}>
          <option value="all">All types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {storyTypeLabels[t]}
            </option>
          ))}
        </Select>

        <label className="sr-only" htmlFor="filter-office">
          Office
        </label>
        <Select id="filter-office" value={filters.office} onChange={(e) => set("office", e.target.value as Filters["office"])}>
          <option value="all">All offices</option>
          {offices.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>

        <div className="relative min-w-56 flex-1 sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink/75" />
          <label className="sr-only" htmlFor="filter-search">
            Search stories
          </label>
          <input
            id="filter-search"
            type="search"
            value={filters.query}
            onChange={(e) => set("query", e.target.value)}
            placeholder="Search stories"
            className="w-full rounded-full border-2 border-ink/15 bg-white py-2.5 pr-4 pl-10 text-sm font-semibold text-ink placeholder:text-ink/50 hover:border-ink/40"
          />
        </div>

        <p className="ml-auto text-sm font-bold text-ink/70" aria-live="polite">
          {count} {count === 1 ? "story" : "stories"}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => setFilters(NO_FILTERS)}
            className="rounded-full px-3 py-2 text-sm font-extrabold text-ink underline decoration-2 underline-offset-4 hover:text-purple"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
