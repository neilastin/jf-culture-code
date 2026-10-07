import { shapeTheCode } from "@/content/code";
import { ui } from "@/content/site";
import { Part } from "@/components/layout/Part";
import { RevealText } from "@/components/motion/RevealText";
import { Opener } from "@/components/stage/Opener";
import { LastUpdated } from "@/components/stories/LastUpdated";
import { LatestWins } from "@/components/stories/LatestWins";
import { PeopleSpotlight } from "@/components/stories/PeopleSpotlight";
import { StoryWall } from "@/components/stories/StoryWall";
import { ValuePulse } from "@/components/stories/ValuePulse";
import { ShareButton } from "./ShareButton";

/** Part 6: Shape the Code - the live heart of the site. */
export function ShapeTheCode() {
  return (
    <Part id="shape-the-code">
      <Opener
        id="shape-the-code"
        title={shapeTheCode.heading}
        part={shapeTheCode.part}
        photo="photos/shape-the-code"
        photoAlt="Colleagues smiling and chatting at an evening team event"
        lettering={[{ media: "lettering/shape-the-code", rect: [36, 107, 559, 304], from: 0.3, tilt: 6 }]}
        cutout={{ media: "cutouts/shape-the-code", rect: [-1, 179, 596, 399] }}
      >
        <RevealText className="font-display text-2xl leading-tight text-lime sm:text-3xl">{shapeTheCode.lead}</RevealText>
        <div className="mt-6 space-y-5">
          {shapeTheCode.body.map((p, i) => (
            <RevealText key={i} className="text-lg leading-relaxed sm:text-xl">
              {p}
            </RevealText>
          ))}
        </div>
        <div className="mt-8">
          <ShareButton />
        </div>
      </Opener>

      <div id="values-in-the-wild" className="scroll-mt-[var(--nav-h)] bg-paper text-ink">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="font-display text-[clamp(2.2rem,6vw,4.8rem)]">{ui.wallHeading}</h3>
              <p className="mt-4 text-lg sm:text-xl">{ui.wallIntro}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LastUpdated />
              <ShareButton compact />
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
            <LatestWins />
            <PeopleSpotlight />
            <ValuePulse />
          </div>

          <p className="mt-6 text-sm font-semibold text-ink/75">{ui.exampleNote}</p>

          <div className="mt-12">
            <StoryWall />
          </div>
        </div>
      </div>
    </Part>
  );
}
