import { wins } from "@/content/feeds";
import { ui } from "@/content/site";

/** A celebratory ticker of recent wins (example content). */
export function LatestWins() {
  const items = [...wins, ...wins];
  return (
    <section aria-labelledby="wins-title" className="relative flex flex-col overflow-hidden rounded-[2rem] bg-gold p-6 text-ink sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h3 id="wins-title" className="font-display text-xl sm:text-2xl">
          🏆 {ui.winsHeading}
        </h3>
        <span className="rounded-full border border-dashed border-ink/60 px-2.5 py-1 text-[0.7rem] font-extrabold uppercase">{ui.example}</span>
      </div>
      <p className="font-display mt-6 text-2xl leading-tight sm:text-3xl">Big or small, every win counts.</p>
      {/* Screen readers get the list once; the scrolling ticker is decorative. */}
      <ul className="sr-only">
        {wins.map((w) => (
          <li key={w.id}>
            {w.headline}. {w.detail}. {w.office}.
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="group mt-auto overflow-hidden pt-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <ul className="flex w-max motion-safe:animate-[marquee_32s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:flex-wrap">
          {items.map((w, i) => (
            <li key={`${w.id}-${i}`} className="mr-3 w-64 shrink-0 rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="font-extrabold">🎉 {w.headline}</p>
              <p className="mt-1 text-sm text-ink/75">
                {w.detail} · {w.office}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
