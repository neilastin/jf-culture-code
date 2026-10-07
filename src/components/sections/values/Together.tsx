import { values } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { RevealText } from "@/components/motion/RevealText";
import { Opener } from "@/components/stage/Opener";
import { LiveStrip } from "@/components/stories/LiveStrip";
import { PullGraphic } from "./PullGraphic";
import { TogetherDrift } from "./TogetherDrift";
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
        photo="photos/together"
        photoAlt="A smiling colleague holding up a hand-painted portrait at a team art session"
        lettering={[
          { media: "lettering/together-word", rect: [141, 59, 467, 292], from: 0.4, tilt: -8 },
          { media: "lettering/one-team-always", rect: [157, 261, 468, 326], delay: 0.35, tilt: 4, from: 0.7 },
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

      <div className="bg-paper px-4 py-20 sm:px-8 lg:py-28">
        <PullGraphic
          text={v.pullGraphic}
          photo={{ media: "photos/under-pressure", alt: "Colleagues clapping and cheering in the audience at a team event" }}
          graphic="lettering/under-pressure"
          placement="right"
          entrance="stomp"
        />
      </div>

      <ValueInAction
        valueName={v.name}
        copy={v.valueInAction}
        lettering="lettering/value-in-action-purple"
        valueLettering="lettering/value-together"
        image={{ media: "illustrations/together-desk", alt: "Illustration of two colleagues working side by side at a desk with laptops" }}
        live={<LiveStrip value="together" />}
      />
    </Part>
  );
}
