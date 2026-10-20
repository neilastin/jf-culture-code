"use client";

import { LayoutGroup, motion } from "framer-motion";
import { ui } from "@/content/site";
import { PlusIcon } from "@/components/ui/Icons";
import { StoryCard } from "./StoryCard";
import { useStories } from "./StoriesProvider";

/** The first tile on the wall: a space for the next story. */
function AddStoryTile() {
  const { openShare } = useStories();
  return (
    <motion.button
      layout
      type="button"
      onClick={openShare}
      className="group flex min-h-64 w-full flex-col items-start justify-between rounded-3xl border-[3px] border-dashed border-ink/30 bg-white/50 p-6 text-left transition-colors duration-300 hover:border-ink hover:bg-white sm:p-7"
      whileTap={{ scale: 0.98 }}
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-lime text-ink shadow-md transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110 group-hover:rotate-90">
        <PlusIcon className="h-6 w-6" />
      </span>
      <span>
        <span className="font-display block text-2xl">{ui.addStoryTitle}</span>
        <span className="mt-2 block text-base text-ink/75">{ui.addStoryBody}</span>
      </span>
    </motion.button>
  );
}

/**
 * Values in the Wild: a simple wall that grows one story at a time. The
 * "Add your story" tile always comes first; approved stories follow it.
 */
export function StoryWall() {
  const { stories } = useStories();
  return (
    <LayoutGroup id="wall">
      <ul className="grid items-start gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <li>
          <AddStoryTile />
        </li>
        {stories.map((story) => (
          <li key={story.id}>
            <StoryCard story={story} />
          </li>
        ))}
      </ul>
    </LayoutGroup>
  );
}
