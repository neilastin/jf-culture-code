import { shapeTheCode } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { RevealText } from "@/components/motion/RevealText";
import { Opener } from "@/components/stage/Opener";
import { ShareButton } from "./ShareButton";

/** Part 6: Shape the Code. (Values in the Wild is parked for launch; stories go to the People team by email for now.) */
export function ShapeTheCode() {
  return (
    <Part id="shape-the-code">
      <Opener
        id="shape-the-code"
        title={shapeTheCode.heading}
        part={shapeTheCode.part}
        photo="photos/shape-the-code"
        photoAlt="A colleague laughing during a meeting, with a teammate blurred in the foreground"
        lettering={[{ media: "lettering/shape-the-code", rect: [28, 376, 568, 579], from: 0.3, tilt: 6 }]}
        compact
      >
        <RevealText className="font-display text-2xl leading-tight text-lime sm:text-3xl">{shapeTheCode.lead}</RevealText>
        <div className="mt-8 space-y-7">
          {shapeTheCode.body.map((p, i) => (
            <RevealText key={i} className="text-lg leading-relaxed sm:text-xl">
              {p}
            </RevealText>
          ))}
        </div>
        <div className="mt-10">
          <ShareButton />
        </div>
      </Opener>
    </Part>
  );
}
