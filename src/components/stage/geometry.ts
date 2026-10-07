import type { CSSProperties } from "react";

/** The print page is 595pt square; layer positions are taken straight from the PDF. */
export const PAGE = 595;

/** [left, top, right, bottom] in print points. */
export type Rect = readonly [number, number, number, number];

/** The visible window of a stage, in print points. Defaults to the full page. */
export type Box = { x: number; y: number; w: number; h: number };

export const FULL_PAGE: Box = { x: 0, y: 0, w: PAGE, h: PAGE };

export function rectStyle(rect: Rect, box: Box = FULL_PAGE): CSSProperties {
  const [x0, y0, x1, y1] = rect;
  return {
    left: `${((x0 - box.x) / box.w) * 100}%`,
    top: `${((y0 - box.y) / box.h) * 100}%`,
    width: `${((x1 - x0) / box.w) * 100}%`,
    height: `${((y1 - y0) / box.h) * 100}%`,
  };
}
