import { howWeSucceed, values } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { RevealText } from "@/components/motion/RevealText";
import { Opener } from "@/components/stage/Opener";
import { OpenPrinciples } from "./OpenPrinciples";
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
        part={howWeSucceed.part}
        photo="photos/open"
        photoAlt="A smiling colleague listening during a relaxed team session"
        lettering={[{ media: "lettering/open", rect: [140, 40, 510, 243], from: 0.4, tilt: -6 }]}
        cutout={{ media: "cutouts/open", rect: [-1, 100, 596, 347] }}
      >
        {v.intro.map((p, i) => (
          <RevealText key={i} className="text-xl leading-relaxed sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
            {p}
          </RevealText>
        ))}
      </Opener>

      <OpenPrinciples />

      <ValueInAction
        valueName={v.name}
        copy={v.valueInAction}
        lettering="lettering/value-in-action-sage"
        valueLettering="lettering/open"
        images={[{ media: "photos/open-candid-table", alt: "Colleagues smiling and talking around a table at a team workshop" }]}
      />
    </Part>
  );
}
