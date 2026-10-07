import { Fragment } from "react";
import type { RichText as RichTextValue } from "@/content/types";

/** Renders copy with **bold** segments. */
export function RichText({ text }: { text: RichTextValue }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
