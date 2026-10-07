import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { rectStyle, type Box, type Rect } from "./geometry";

type Props = {
  rect: Rect;
  box: Box;
  /** "scene" layers move together; "lettering" layers drift against them; "static" stays put. */
  layer: "scene" | "lettering" | "static";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Full-stage wrapper (so every scene layer gets an identical transform)
 * holding a child positioned with print coordinates.
 */
export function StageLayer({ rect, box, layer, className, style, children }: Props) {
  return (
    <div data-layer={layer} className="pointer-events-none absolute inset-0">
      <div className={cn("absolute", className)} style={{ ...rectStyle(rect, box), ...style }}>
        {children}
      </div>
    </div>
  );
}
