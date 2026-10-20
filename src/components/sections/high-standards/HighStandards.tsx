import { highStandards } from "@/content/code";
import { Part } from "@/components/layout/Part";
import { RevealText } from "@/components/motion/RevealText";
import { MediaImage } from "@/components/ui/MediaImage";
import { PageFurniture } from "@/components/ui/PageFurniture";
import { RichText } from "@/components/ui/RichText";
import { BalloonLaunch } from "./BalloonLaunch";
import { Benefits } from "./Benefits";

/** Part 3: High Standards. High Care. The opener is the balloon that only flies with both. */
export function HighStandards() {
  return (
    <Part id="high-standards">
      <div className="relative isolate overflow-hidden bg-ink text-white">
        <div className="mx-auto max-w-[1680px] px-4 pt-[calc(var(--nav-h)+0.75rem)] pb-16 sm:px-8 lg:pb-20">
          <PageFurniture part={highStandards.part} />
          <h2 id="high-standards-title" className="sr-only">
            {highStandards.heading}
          </h2>
          <div className="mt-8 lg:mt-10">
            <BalloonLaunch />
          </div>
        </div>
      </div>

      <div className="bg-paper text-ink">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 lg:py-32">
          {/* The photo stretches to the height of the copy beside it, so there's never a gap under either. */}
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <div className="space-y-6 text-lg leading-relaxed sm:text-xl">
              {highStandards.body.map((p, i) => (
                <RevealText key={i}>
                  <RichText text={p} />
                </RevealText>
              ))}
              <RevealText className="pt-4 text-xl leading-relaxed font-semibold sm:text-2xl">{highStandards.benefitsIntro}</RevealText>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl shadow-xl sm:min-h-[520px] lg:min-h-0">
              <MediaImage
                name="photos/high-care"
                alt="A colleague concentrating on her laptop in a quiet corner of the office"
                fill
                sizes="(min-width: 1024px) 520px, 92vw"
                className="object-cover object-[50%_30%]"
              />
            </div>
          </div>

          <Benefits />
        </div>
      </div>
    </Part>
  );
}
