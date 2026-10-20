"use client";

import { useSyncExternalStore } from "react";
import { officeClocks, officeMoments, type OfficeMoment } from "@/content/site";
import { cn } from "@/lib/cn";

/** Which part of the day it is in an office, by local time (minutes since midnight) and weekday. Weekends are out of office all day. */
function moment(minutes: number, weekday: string): OfficeMoment {
  const hour = minutes / 60;
  if (weekday === "Sat" || weekday === "Sun") return "weekend";
  if (weekday === "Fri" && hour >= 15 && hour < 18) return "fridayFlex";
  if (hour < 7) return "night";
  if (hour < 9) return "early";
  if (hour < 12) return "morning";
  if (hour < 13.5) return "lunch";
  if (hour < 17) return "afternoon";
  if (hour < 19) return "evening";
  return "late";
}

const subscribe = (tick: () => void) => {
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
};

/** "Right now at Journey Further": live local time in every office, and a cheeky guess at what's going on. */
export function RightNow() {
  const now = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 1000), () => null);
  return (
    <section aria-labelledby="right-now-title" className="mt-6 rounded-[2rem] bg-ink p-4 text-white sm:mt-8 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-1 sm:px-0">
        <h4 id="right-now-title" className="font-display flex items-center gap-3 text-xl sm:text-3xl">
          <span className="h-3 w-3 animate-pulse-dot rounded-full bg-teal" aria-hidden="true" />
          Right now at Journey Further
        </h4>
        <p className="text-base font-bold text-white/70 sm:text-lg">One team, two continents, four offices.</p>
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-3 text-ink sm:mt-6 sm:gap-4 lg:grid-cols-4">
        {officeClocks.map((o, i) => {
          const date = now === null ? null : new Date(now * 1000);
          const time = date?.toLocaleTimeString("en-GB", { timeZone: o.zone, hour: "2-digit", minute: "2-digit", second: "2-digit" });
          const [hh, mm] = (time ?? "0:0").split(":").map(Number);
          const weekday = date?.toLocaleString("en-GB", { timeZone: o.zone, weekday: "short" }) ?? "";
          return (
            <li
              key={o.city}
              className={cn(
                "flex min-h-36 flex-col rounded-2xl p-3.5 transition-transform sm:rounded-3xl sm:p-5 duration-500 ease-[var(--ease-spring)] hover:-translate-y-1.5 sm:p-6",
                i % 2 ? "hover:rotate-1" : "hover:-rotate-1",
                o.colour,
              )}
            >
              <p className="font-display text-[clamp(0.78rem,3.4vw,1.25rem)]">{o.city}</p>
              <p className="font-display mt-3 text-[clamp(1.1rem,5.4vw,2.5rem)] tabular-nums lg:text-[clamp(1.6rem,2.6vw,2.5rem)]">{time ?? "--:--:--"}</p>
              <p className="mt-auto pt-3 text-sm font-bold sm:text-base">{date ? officeMoments[moment(hh * 60 + mm, weekday)][o.city] : " "}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
