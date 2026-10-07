import { storyTypeLabels, ui, valueMeta } from "@/content/site";
import type { Story } from "@/content/types";
import { cn } from "@/lib/cn";

const VALUE_CHIP = {
  together: "bg-together text-white",
  open: "bg-sage text-white",
  proactive: "bg-lime text-ink",
} as const;

/** Value, type and honesty labels. Example and Culture Code content is always marked. */
export function StoryBadges({ story, justIn }: { story: Story; justIn?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[0.7rem] font-extrabold tracking-wide uppercase">
      <span className={cn("rounded-full px-2.5 py-1", VALUE_CHIP[story.value])}>{valueMeta[story.value].label}</span>
      <span className="rounded-full bg-ink/8 px-2.5 py-1 text-ink/80">{storyTypeLabels[story.type]}</span>
      {story.source === "example" && (
        <span className="rounded-full border border-dashed border-ink/50 px-2.5 py-1 text-ink/80">{ui.example}</span>
      )}
      {story.source === "culture-code" && (
        <span className="rounded-full bg-mint px-2.5 py-1 text-ink">{ui.fromTheCode}</span>
      )}
      {story.status === "pending" && <span className="rounded-full bg-gold px-2.5 py-1 text-ink">{ui.pending}</span>}
      {story.featured && <span className="rounded-full bg-purple px-2.5 py-1 text-white">★ {ui.featured}</span>}
      {justIn && (
        <span className="flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-teal">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal" />
          {ui.justIn}
        </span>
      )}
    </div>
  );
}
