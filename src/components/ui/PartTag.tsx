import { cn } from "@/lib/cn";

/** The rounded "PART 1" tag from the print page furniture. */
export function PartTag({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-center rounded-md bg-part px-3 py-1.5 text-[0.7rem] tracking-wide text-charcoal",
        className,
      )}
    >
      {children}
    </span>
  );
}
