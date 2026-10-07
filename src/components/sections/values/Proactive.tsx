import { values } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { LiveStrip } from "@/components/stories/LiveStrip";
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
        valueLettering="lettering/value-proactive"
        image={{ media: "photos/proactive-desk", alt: "A colleague in glasses focused on his screen" }}
        live={<LiveStrip value="proactive" />}
      />
    </Part>
  );
}
