import type { ReactNode } from "react";
import type { MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";
import { PopIn } from "@/components/motion/PopIn";
import { MediaImage } from "@/components/ui/MediaImage";
import { PageFurniture } from "@/components/ui/PageFurniture";
import { FULL_PAGE, type Rect } from "./geometry";
import { Stage } from "./Stage";
import { StageLayer } from "./StageLayer";

export type LetteringLayer = { media: MediaKey; rect: Rect; delay?: number; tilt?: number; from?: number };

type Props = {
  /** Id of the parent Part; the visually hidden heading is `${id}-title`. */
  id: string;
  title: string;
  part?: string;
  label?: string;
  photo: MediaKey;
  photoAlt: string;
  lettering?: LetteringLayer[];
  cutout?: { media: MediaKey; rect: Rect };
  /** Extra stage layers drawn between the lettering and the cut-out. */
  extra?: ReactNode;
  /** Darkens the photo (not the cut-out), spotlighting the person in front. */
  dimPhoto?: boolean;
  /** Copy shown beside the stage on desktop and below it on mobile. */
  children?: ReactNode;
  /** A smaller stage, so it sits level with a long block of copy beside it. */
  compact?: boolean;
  className?: string;
};

/**
 * A section opener built like the print spreads: team photo, hand-lettered
 * headline, and a cut-out of the people layered back in front.
 */
export function Opener({ id, title, part, label, photo, photoAlt, lettering = [], cutout, extra, dimPhoto, children, compact, className }: Props) {
  const headingId = `${id}-title`;
  return (
    <div className={cn("relative isolate overflow-hidden bg-ink text-white", className)}>
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <MediaImage name={photo} alt="" fill sizes="12vw" className="scale-125 object-cover opacity-55 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/50 to-ink/85" />
      </div>

      <div className="mx-auto max-w-[1680px] px-4 pt-[calc(var(--nav-h)+0.75rem)] pb-10 sm:px-8 lg:pb-14">
        <PageFurniture part={part} label={label} />
        <h2 id={headingId} className="sr-only">
          {title}
        </h2>

        <div
          className={cn(
            "mt-5 lg:mt-6",
            children ? "grid items-center gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14" : "flex justify-center",
          )}
        >
          <Stage
            box={FULL_PAGE}
            className={cn(
              "-mx-4 sm:mx-0 sm:rounded-[1.75rem] sm:shadow-2xl sm:shadow-black/40",
              children
                ? compact
                  ? "lg:w-[min(calc(100svh-10rem),40vw,620px)]"
                  : "lg:w-[min(calc(100svh-8.5rem),54vw)]"
                : "w-[calc(100%+2rem)] sm:w-[min(calc(100svh-8.5rem),100%)]",
            )}
          >
            <StageLayer rect={[-1, -1, 596, 596]} box={FULL_PAGE} layer="scene">
              <MediaImage name={photo} alt={photoAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              {dimPhoto && <div className="absolute inset-0 bg-ink/55" />}
            </StageLayer>
            {lettering.map((l) => (
              <StageLayer key={l.media} rect={l.rect} box={FULL_PAGE} layer="lettering">
                <PopIn className="relative h-full w-full" delay={l.delay} tilt={l.tilt} from={l.from}>
                  <MediaImage name={l.media} alt="" fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-fill" />
                </PopIn>
              </StageLayer>
            ))}
            {extra}
            {cutout && (
              <StageLayer rect={cutout.rect} box={FULL_PAGE} layer="scene">
                <MediaImage name={cutout.media} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-fill" />
              </StageLayer>
            )}
          </Stage>

          {children && <div className="max-w-2xl lg:pr-6">{children}</div>}
        </div>
      </div>
    </div>
  );
}
