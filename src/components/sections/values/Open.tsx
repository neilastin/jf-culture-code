import { values } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { RevealText } from "@/components/motion/RevealText";
import { Opener } from "@/components/stage/Opener";
import { LiveStrip } from "@/components/stories/LiveStrip";
import { OpenPrinciples } from "./OpenPrinciples";
import { PullGraphic } from "./PullGraphic";
import { ValueInAction } from "./ValueInAction";

/** Value 2: Open - Curious and Candid. */
export function Open() {
  const v = values.open;
  return (
    <Part id="open">
      <Opener
        id="open"
        title={`${v.name}: ${v.strapline}`}
        label="Our values"
        photo="photos/open"
        photoAlt="A smiling colleague listening during a relaxed team session"
        lettering={[{ media: "lettering/open", rect: [137, 46, 452, 299], from: 0.4, tilt: -6 }]}
        cutout={{ media: "cutouts/open", rect: [-1, 100, 596, 347] }}
      >
        {v.intro.map((p, i) => (
          <RevealText key={i} className="text-xl leading-relaxed sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
            {p}
          </RevealText>
        ))}
      </Opener>

      <OpenPrinciples />

      <div className="bg-paper px-4 pb-20 sm:px-8 lg:pb-28">
        <PullGraphic
          text={v.pullGraphic}
          photo={{ media: "photos/open-candid", alt: "A colleague smiling across the table during a conversation" }}
          graphic="lettering/challenge-directly"
          placement="bottom-right"
          entrance="climb"
        />
      </div>

      <ValueInAction
        valueName={v.name}
        copy={v.valueInAction}
        lettering="lettering/value-in-action-sage"
        valueLettering="lettering/value-open"
        image={{ media: "photos/open-laughing", alt: "Colleagues sharing a laugh while sitting together in the office" }}
        live={<LiveStrip value="open" />}
      />
    </Part>
  );
}
