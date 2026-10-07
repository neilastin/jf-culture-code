import type { CSSProperties, ReactNode } from "react";
import { values } from "@/content/code";
import { PopIn } from "@/components/motion/PopIn";
import { RevealText } from "@/components/motion/RevealText";
import { rectStyle, type Box, type Rect } from "@/components/stage/geometry";
import { Stage } from "@/components/stage/Stage";
import { MediaImage } from "@/components/ui/MediaImage";
import { PageFurniture } from "@/components/ui/PageFurniture";

/*
 * The print-review fix for page 24. The photo is extended with the plain wall
 * colour (above it on mobile, to its left on desktop) so the full
 * "PROOOO...ACTIVE / MAKE IT HAPPEN" lettering sits in clear space. The
 * presenter cut-out still stands in front of everything.
 */
const MOBILE_BOX: Box = { x: -1, y: -330, w: 597, h: 926 };
const DESKTOP_BOX: Box = { x: -360, y: 20, w: 955, h: 575 };

const PHOTO: Rect = [-1, -1, 596, 596];
const PRESENTER: Rect = [336, 184, 596, 438];
const LETTERING_MOBILE: Rect = [16, -322, 578, 68];
const LETTERING_DESKTOP: Rect = [-345, 72, 334, 543];

/** Positions a layer with one rect on mobile and another from the lg breakpoint. */
function DualLayer({ mobile, desktop, layer, children }: { mobile: Rect; desktop: Rect; layer: "scene" | "lettering"; children: ReactNode }) {
  const m = rectStyle(mobile, MOBILE_BOX);
  const d = rectStyle(desktop, DESKTOP_BOX);
  const vars = {
    "--l": m.left,
    "--t": m.top,
    "--w": m.width,
    "--h": m.height,
    "--ld": d.left,
    "--td": d.top,
    "--wd": d.width,
    "--hd": d.height,
  } as CSSProperties;
  return (
    <div data-layer={layer} className="pointer-events-none absolute inset-0">
      <div
        className="absolute top-(--t) left-(--l) h-(--h) w-(--w) lg:top-(--td) lg:left-(--ld) lg:h-(--hd) lg:w-(--wd)"
        style={vars}
      >
        {children}
      </div>
    </div>
  );
}

export function ProactiveOpener() {
  const v = values.proactive;
  return (
    <div className="relative isolate overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-[1680px] px-4 pt-[calc(var(--nav-h)+0.75rem)] pb-12 sm:px-8 lg:pb-16">
        <PageFurniture label="Our values" />
        <h2 id="proactive-title" className="sr-only">
          {v.name}: {v.strapline}
        </h2>

        <div className="mt-5 flex justify-center lg:mt-6">
          <Stage className="-mx-4 aspect-[597/926] w-[calc(100%+2rem)] bg-[linear-gradient(180deg,#9aa587_0%,#a7b194_100%)] sm:mx-0 sm:w-full sm:max-w-[560px] sm:rounded-[1.75rem] sm:shadow-2xl lg:aspect-[955/575] lg:w-[min(100%,calc((100svh-8.5rem)*1.66))] lg:max-w-none lg:bg-[linear-gradient(90deg,#9aa587_0%,#a7b194_100%)]">
            <DualLayer mobile={PHOTO} desktop={PHOTO} layer="scene">
              <MediaImage
                name="photos/proactive"
                alt="A colleague presenting to the team, gesturing as she speaks"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover [mask-image:linear-gradient(to_bottom,transparent,black_14%)] lg:[mask-image:linear-gradient(to_right,transparent,black_16%)]"
              />
            </DualLayer>
            <DualLayer mobile={LETTERING_MOBILE} desktop={LETTERING_DESKTOP} layer="lettering">
              <PopIn className="relative h-full w-full" from={0.35} tilt={-8}>
                <MediaImage name="lettering/proactive" alt="" fill sizes="(min-width: 1024px) 50vw, 95vw" className="object-fill" />
              </PopIn>
            </DualLayer>
            <DualLayer mobile={PRESENTER} desktop={PRESENTER} layer="scene">
              <MediaImage name="cutouts/proactive" alt="" fill sizes="(min-width: 1024px) 28vw, 45vw" className="object-fill" />
            </DualLayer>
          </Stage>
        </div>

        <div className="mx-auto mt-10 max-w-4xl lg:mt-14">
          {v.intro.map((p, i) => (
            <RevealText key={i} className="text-xl leading-relaxed sm:text-2xl lg:text-[1.75rem] lg:leading-snug">
              {p}
            </RevealText>
          ))}
        </div>
      </div>
    </div>
  );
}
