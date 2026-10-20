import { promise } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { RevealText } from "@/components/motion/RevealText";
import { Opener } from "@/components/stage/Opener";
import { Handshake } from "./Handshake";

/** Part 5: The Promise. */
export function ThePromise() {
  return (
    <Part id="the-promise">
      <Opener
        id="the-promise"
        title={promise.heading}
        part={promise.part}
        photo="photos/promise"
        photoAlt="Colleagues sitting on folding chairs, listening intently at a team meeting"
        lettering={[{ media: "lettering/the-promise", rect: [-1, 119, 649, 472], from: 0.4, tilt: -10 }]}
        cutout={{ media: "cutouts/promise", rect: [347, -1, 596, 147] }}
        compact
      >
        <div className="space-y-5">
          {promise.body.map((p, i) => (
            <RevealText key={i} className="text-lg leading-relaxed sm:text-xl lg:text-[1.35rem] lg:leading-relaxed">
              {p}
            </RevealText>
          ))}
        </div>
      </Opener>
      <Handshake />
    </Part>
  );
}
