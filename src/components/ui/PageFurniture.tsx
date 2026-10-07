import { cn } from "@/lib/cn";
import { PartTag } from "./PartTag";

type Props = { part?: string; label?: string; tone?: "light" | "dark"; className?: string };

/** "JOURNEY FURTHER" running head with a hairline rule, as on every print page. */
export function PageFurniture({ part, label, tone = "light", className }: Props) {
  const ink = tone === "light" ? "text-white border-white/40" : "text-ink border-ink/30";
  return (
    <div className={cn("flex items-center justify-between gap-4 border-b pb-3", ink, className)} aria-hidden="true">
      <span className="font-display text-xs tracking-wide sm:text-sm">Journey Further</span>
      <span className="flex items-center gap-3">
        {label && <span className="font-display hidden text-xs sm:inline">{label}</span>}
        {part && <PartTag>{part}</PartTag>}
      </span>
    </div>
  );
}
