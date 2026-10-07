import { youBelongHere } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { Opener } from "@/components/stage/Opener";
import { BigQuote } from "./BigQuote";
import { Megaphone } from "./Megaphone";

/** Part 2: You Belong Here. */
export function YouBelongHere() {
  return (
    <Part id="you-belong-here">
      <Opener
        id="you-belong-here"
        title={youBelongHere.heading}
        part={youBelongHere.part}
        photo="photos/you-belong-here"
        photoAlt="Two colleagues sitting together and listening during a team session"
        lettering={[{ media: "lettering/you-belong-here", rect: [115, 59, 481, 407], from: 0.4, tilt: 8 }]}
        cutout={{ media: "cutouts/you-belong-here", rect: [-1, 211, 563, 399] }}
      />
      <Megaphone />
      <BigQuote text={youBelongHere.quote} />
    </Part>
  );
}
