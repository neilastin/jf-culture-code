import { howWeSucceed, values } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { RevealText } from "@/components/motion/RevealText";
import { Opener } from "@/components/stage/Opener";
import { TogetherDrift } from "./TogetherDrift";
import { UnderPressure } from "./UnderPressure";
import { ValueInAction } from "./ValueInAction";

/** Value 1: Together - One Team, Always. */
export function Together() {
  const v = values.together;
  return (
    <Part id="together">
      <Opener
        id="together"
        title={`${v.name}: ${v.strapline}`}
        label="Our values"
        part={howWeSucceed.part}
        photo="photos/together"
        photoAlt="A smiling colleague holding up a hand-painted portrait at a team art session"
        lettering={[
          { media: "lettering/together-word", rect: [160, 40, 470, 261], from: 0.4, tilt: -8 },
          { media: "lettering/one-team-always", rect: [172, 238, 458, 280], delay: 0.45, tilt: 5, from: 0.3 },
        ]}
        cutout={{ media: "cutouts/together", rect: [18, 165, 569, 576] }}
      >
        {v.intro.map((p, i) => (
          <RevealText key={i} className="text-xl leading-relaxed sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
            {p}
          </RevealText>
        ))}
      </Opener>

      <TogetherDrift />

      <UnderPressure />

      <ValueInAction
        valueName={v.name}
        copy={v.valueInAction}
        lettering="lettering/value-in-action-purple"
        valueLettering="lettering/value-together"
        images={[
          { media: "illustrations/together-paddleboard", alt: "Illustration of two teams racing each other on big paddleboards across a green lake" },
          { media: "illustrations/together-video-call", alt: "Illustration of colleagues around a meeting table on a video call with teammates in another office" },
        ]}
      />
    </Part>
  );
}
