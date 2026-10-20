import { values } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { LightSwitch } from "./LightSwitch";
import { ProactiveOpener } from "./ProactiveOpener";
import { ValueInAction } from "./ValueInAction";

/** Value 3: Proactive - Make It Happen. */
export function Proactive() {
  const v = values.proactive;
  return (
    <Part id="proactive">
      <ProactiveOpener />
      <LightSwitch />
      <ValueInAction
        valueName={v.name}
        copy={v.valueInAction}
        lettering="lettering/value-in-action-lime"
        valueLettering="lettering/proactive"
        images={[{ media: "photos/proactive-desk", alt: "A colleague in glasses focused on his screen" }]}
      />
    </Part>
  );
}
