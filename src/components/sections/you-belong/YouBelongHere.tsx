import { youBelongHere } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { PageFurniture } from "@/components/ui/PageFurniture";
import { BelongCollage } from "./BelongCollage";
import { BigQuote } from "./BigQuote";
import { Megaphone } from "./Megaphone";

/** Part 2: You Belong Here. The opener is a collage of three photos rather than one layered print spread. */
export function YouBelongHere() {
  return (
    <Part id="you-belong-here">
      <div className="relative isolate overflow-hidden bg-ink text-white">
        <div className="mx-auto max-w-[1680px] px-4 pt-[calc(var(--nav-h)+0.75rem)] pb-4 sm:px-8 lg:pb-2">
          <PageFurniture part={youBelongHere.part} />
          <h2 id="you-belong-here-title" className="sr-only">
            {youBelongHere.heading}
          </h2>
          <div className="mt-8 lg:mt-10">
            <BelongCollage />
          </div>
        </div>
      </div>
      <Megaphone />
      <BigQuote text={youBelongHere.quote} />
    </Part>
  );
}
