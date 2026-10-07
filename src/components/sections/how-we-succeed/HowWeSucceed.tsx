import { howWeSucceed } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { Opener } from "@/components/stage/Opener";
import { Statements } from "./Statements";

/** Part 4: How We Succeed. */
export function HowWeSucceed() {
  return (
    <Part id="how-we-succeed">
      <Opener
        id="how-we-succeed"
        title={howWeSucceed.heading}
        part={howWeSucceed.part}
        photo="photos/how-we-succeed"
        photoAlt="Colleagues laughing together in the audience at a company event"
        lettering={[{ media: "lettering/how-we-succeed", rect: [-1, 59, 645, 597], from: 0.2, tilt: 12 }]}
      />
      <Statements />
    </Part>
  );
}
