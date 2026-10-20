import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { easterEggs, ideasNeedingContent } from "@/content/experiments";
import { EasterEggs } from "@/components/layout/EasterEggs";
import { SignTheCode } from "@/components/experiments/SignTheCode";
import { ValueQuiz } from "@/components/experiments/ValueQuiz";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ArrowIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Experimental ideas · The Journey Further Culture Code",
  description: "Playful extras for the online Culture Code, kept separate from the main site.",
  // Not linked from the v1.0 site; reachable only by its URL.
  robots: { index: false, follow: false },
};

function Experiment({ id, kicker, title, intro, children }: { id: string; kicker: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-ink/15 py-16 sm:py-20">
      <p className="font-display text-sm text-ink/75">{kicker}</p>
      <h2 id={id} className="font-display mt-2 text-3xl sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-lg sm:text-xl">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** A sandbox for ideas that aren't ready for the main Culture Code site. */
export default function ExperimentalPage() {
  return (
    <MotionProvider>
      <EasterEggs />
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link href="/" className="h-9" aria-label="Back to the Culture Code">
            <Logo className="block h-full" />
          </Link>
          <Link href="/" className="group inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2.5 text-sm font-extrabold text-ink">
            <ArrowIcon className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            Back to the Code
          </Link>
        </div>
      </header>

      <main className="bg-paper text-ink">
        <div className="bg-ink px-4 pt-10 pb-16 text-white sm:px-8 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-[1400px]">
            <p className="font-display text-sm text-teal">Lab</p>
            <h1 className="font-display mt-3 text-[clamp(2.4rem,8vw,6.5rem)]">Experimental ideas</h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed">
              Playful extras that could make the online Code even more alive. They live here so the main site stays focused. Have a play, then tell us which ones deserve a place.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <Experiment id="quiz" kicker="Experiment 01" title="Spot the value" intro="Two real moments from the Code. One is the value in action, one is a 'please don't'. Can you tell them apart?">
            <ValueQuiz />
          </Experiment>

          <Experiment id="sign" kicker="Experiment 02" title="Sign the Code" intro="Pick the promise you're making to Journey Further and put your name to it.">
            <SignTheCode />
          </Experiment>

          <section aria-labelledby="eggs" className="border-t border-ink/15 py-16 sm:py-20">
            <h2 id="eggs" className="font-display text-3xl sm:text-5xl">
              Hidden on the main site
            </h2>
            <p className="mt-4 max-w-3xl text-lg sm:text-xl">Easter eggs that are already live in the Code. Don&apos;t tell everyone.</p>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {easterEggs.map((egg) => (
                <li key={egg.where} className="rounded-3xl bg-white p-6 shadow-md">
                  <p className="font-display text-sm text-ink/75">{egg.where}</p>
                  <p className="mt-3 text-lg font-extrabold">{egg.how}</p>
                  <p className="mt-2 text-base">{egg.what}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="ideas" className="border-t border-ink/15 py-16 sm:py-20">
            <h2 id="ideas" className="font-display text-3xl sm:text-5xl">
              Ideas that need content
            </h2>
            <p className="mt-4 max-w-3xl text-lg sm:text-xl">Ready to build as soon as we have the material.</p>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ideasNeedingContent.map((idea) => (
                <li key={idea.title} className="flex flex-col rounded-3xl border-2 border-dashed border-ink/30 p-6">
                  <h3 className="font-display text-xl">{idea.title}</h3>
                  <p className="mt-3 text-base">{idea.idea}</p>
                  <p className="mt-4 rounded-2xl bg-white p-4 text-sm">
                    <strong>We&apos;d need:</strong> {idea.need}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </MotionProvider>
  );
}
