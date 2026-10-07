"use client";

import { motion } from "framer-motion";
import { reactions } from "@/content/site";
import type { Story } from "@/content/types";
import { cn } from "@/lib/cn";
import { StoryBadges } from "./StoryBadges";
import { StoryImage } from "./StoryImage";
import { StoryMeta } from "./StoryMeta";
import { useStories } from "./StoriesProvider";

const VALUE_EDGE = {
  together: "before:bg-together",
  open: "before:bg-sage",
  proactive: "before:bg-lime",
} as const;

type Props = { story: Story; variant?: "wall" | "strip" };

/** One story. The whole card opens the detail view; admin tools sit on top when moderation mode is on. */
export function StoryCard({ story, variant = "wall" }: Props) {
  const { openStory, justIn, reactionCounts, admin, moderate } = useStories();
  const isNew = justIn.has(story.id);
  const total = reactionCounts(story).filter((r) => r.count > 0);

  return (
    <motion.article
      layout
      layoutId={variant === "wall" ? `wall-${story.id}` : undefined}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white text-ink shadow-md transition-shadow duration-300 hover:shadow-xl",
        "before:absolute before:inset-x-0 before:top-0 before:h-2",
        VALUE_EDGE[story.value],
        isNew && "ring-4 ring-teal ring-offset-2 ring-offset-paper",
        variant === "strip" && "h-full",
      )}
    >
      {story.image && variant === "wall" && (
        <StoryImage image={story.image} className="mt-2 aspect-[16/10]" sizes="(min-width: 1024px) 420px, 92vw" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-5 pt-6 sm:p-6 sm:pt-7">
        <StoryBadges story={story} justIn={isNew} />
        <h4 className="text-xl leading-tight font-extrabold">
          <button
            type="button"
            onClick={() => openStory(story.id)}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline"
          >
            {story.title}
          </button>
        </h4>
        <p className={cn("text-base leading-relaxed text-ink/85", variant === "strip" ? "line-clamp-3" : "line-clamp-5")}>
          {story.body}
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
          <StoryMeta story={story} />
          {total.length > 0 && (
            <p className="text-sm font-bold text-ink/80" aria-label="Reactions">
              {total.map((r) => (
                <span key={r.id} className="ml-2 first:ml-0">
                  {reactions.find((x) => x.id === r.id)?.emoji} {r.count}
                </span>
              ))}
            </p>
          )}
        </div>

        {admin && variant === "wall" && (
          <div className="relative z-10 flex flex-wrap gap-2 border-t border-dashed border-ink/20 pt-3">
            {story.status === "pending" && (
              <button type="button" onClick={() => moderate(story.id, "approve")} className="rounded-full bg-lime px-3 py-1.5 text-xs font-extrabold">
                Approve
              </button>
            )}
            <button
              type="button"
              onClick={() => moderate(story.id, story.featured ? "unfeature" : "feature")}
              className="rounded-full bg-purple px-3 py-1.5 text-xs font-extrabold text-white"
            >
              {story.featured ? "Unfeature" : "Feature"}
            </button>
            <button type="button" onClick={() => moderate(story.id, "remove")} className="rounded-full bg-dont px-3 py-1.5 text-xs font-extrabold text-ink">
              Remove
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
