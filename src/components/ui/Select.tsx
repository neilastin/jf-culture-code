import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { ChevronIcon } from "./Icons";

/** A pill-shaped native select with a custom chevron. */
export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative inline-flex">
      <select
        {...rest}
        className={cn(
          "w-full appearance-none rounded-full border-2 border-ink/15 bg-white py-2.5 pr-10 pl-4 text-sm font-bold text-ink hover:border-ink/40",
          className,
        )}
      >
        {children}
      </select>
      <ChevronIcon className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink" />
    </span>
  );
}
