"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { reactions } from "@/content/site";
import { cn } from "@/lib/cn";
import { Dialog } from "@/components/ui/Dialog";
import { StoryBadges } from "./StoryBadges";
import { StoryImage } from "./StoryImage";
import { StoryMeta } from "./StoryMeta";
import { useStories } from "./StoriesProvider";

const HASH_PREFIX = "#story=";

/** Story detail with reactions, sharing and (in moderation mode) admin tools. */
export function StoryModal() {
  const { activeStory: story, closeStory, openStory, reactionCounts, toggleReaction, justIn, admin, moderate } = useStories();
  const [copied, setCopied] = useState(false);

  // Shared links open the story straight away.
  useEffect(() => {
    if (window.location.hash.startsWith(HASH_PREFIX)) openStory(decodeURIComponent(window.location.hash.slice(HASH_PREFIX.length)));
  }, [openStory]);

  const close = () => {
    setCopied(false);
    closeStory();
  };

  const share = async () => {
    if (!story) return;
    const url = `${window.location.origin}${window.location.pathname}${HASH_PREFIX}${encodeURIComponent(story.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, text: story.body, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do.
    }
  };

  return (
    <Dialog open={story !== null} onClose={close} labelledBy="story-modal-title">
      {story && (
        <article>
          {story.image && (
            <StoryImage image={story.image} className="aspect-[16/9] w-full rounded-t-[2rem]" sizes="(min-width: 768px) 704px, 100vw" />
          )}
          <div className="p-6 sm:p-10">
            <StoryBadges story={story} justIn={justIn.has(story.id)} />
            <h2 id="story-modal-title" className="mt-5 text-3xl leading-tight font-extrabold sm:text-4xl">
              {story.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed sm:text-xl">{story.body}</p>
            {story.involved && (
              <p className="mt-4 text-base">
                <strong>Who was involved:</strong> {story.involved}
              </p>
            )}
            <div className="mt-6">
              <StoryMeta story={story} />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="React">
              {reactionCounts(story).map((r) => {
                const meta = reactions.find((x) => x.id === r.id)!;
                return (
                  <motion.button
                    key={r.id}
                    type="button"
                    aria-pressed={r.mine}
                    aria-label={`${meta.label}: ${r.count}`}
                    onClick={() => toggleReaction(story.id, r.id)}
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      "flex items-center gap-2 rounded-full border-2 px-4 py-2 text-base font-extrabold transition-colors",
                      r.mine ? "border-ink bg-lime" : "border-ink/15 hover:border-ink/40",
                    )}
                  >
                    <motion.span key={`${r.id}-${r.mine}`} initial={{ scale: r.mine ? 1.6 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                      {meta.emoji}
                    </motion.span>
                    <span className="tabular-nums">× {r.count}</span>
                  </motion.button>
                );
              })}

              <button
                type="button"
                onClick={share}
                className="ml-auto rounded-full bg-ink px-5 py-2.5 text-base font-extrabold text-white transition-transform hover:scale-105"
              >
                {copied ? "Link copied" : "Share"}
              </button>
            </div>

            {admin && (
              <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border-2 border-dashed border-purple/50 p-4">
                <p className="w-full text-sm font-extrabold text-purple">Moderation</p>
                {story.status === "pending" && (
                  <button type="button" onClick={() => moderate(story.id, "approve")} className="rounded-full bg-lime px-4 py-2 text-sm font-extrabold">
                    Approve
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => moderate(story.id, story.featured ? "unfeature" : "feature")}
                  className="rounded-full bg-purple px-4 py-2 text-sm font-extrabold text-white"
                >
                  {story.featured ? "Unfeature" : "Feature"}
                </button>
                <button type="button" onClick={() => moderate(story.id, "remove")} className="rounded-full bg-dont px-4 py-2 text-sm font-extrabold">
                  Remove
                </button>
              </div>
            )}
          </div>
        </article>
      )}
    </Dialog>
  );
}
