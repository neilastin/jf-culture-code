import { highStandards } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { RevealText } from "@/components/motion/RevealText";
import { Opener } from "@/components/stage/Opener";
import { MediaImage } from "@/components/ui/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { Balance } from "./Balance";
import { Benefits } from "./Benefits";

/** Part 3: High Standards. High Care. */
export function HighStandards() {
  return (
    <Part id="high-standards">
      <Opener
        id="high-standards"
        title={highStandards.heading}
        part={highStandards.part}
        photo="photos/high-standards"
        photoAlt="A colleague presenting on stage with a microphone"
        cutout={{ media: "cutouts/high-standards", rect: [-1, 104, 596, 596] }}
        extra={<Balance />}
        dimPhoto
      />

      <div className="bg-paper text-ink">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <div className="space-y-6 text-lg leading-relaxed sm:text-xl">
              {highStandards.body.map((p, i) => (
                <RevealText key={i}>
                  <RichText text={p} />
                </RevealText>
              ))}
            </div>
            <MediaImage
              name="photos/high-care"
              alt="A colleague concentrating on her laptop in a quiet corner of the office"
              sizes="(min-width: 1024px) 480px, 92vw"
              className="h-auto max-h-[70vh] w-full rounded-3xl object-cover shadow-xl"
            />
          </div>

          <RevealText className="mt-16 max-w-4xl text-xl leading-relaxed font-semibold sm:text-2xl">
            {highStandards.benefitsIntro}
          </RevealText>
          <Benefits />
        </div>
      </div>
    </Part>
  );
}
