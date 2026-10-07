import { whoWeAre } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { Opener } from "@/components/stage/Opener";
import { Evolution } from "./Evolution";
import { Obsessive } from "./Obsessive";
import { OriginStory } from "./OriginStory";
import { OurValues } from "./OurValues";
import { Today } from "./Today";

/** Part 1: Who We Are. */
export function WhoWeAre() {
  return (
    <Part id="who-we-are">
      <Opener
        id="who-we-are"
        title={whoWeAre.heading}
        part={whoWeAre.part}
        photo="photos/who-we-are"
        photoAlt="A big group of Journey Further colleagues celebrating together at a party"
        lettering={[{ media: "lettering/who-we-are", rect: [93, 72, 491, 556], from: 0.3, tilt: -10 }]}
      />
      <OriginStory />
      <Evolution />
      <Today />
      <OurValues />
      <Obsessive />
    </Part>
  );
}
