"use client";

import { useSyncExternalStore } from "react";

const OFFICES = [
  { city: "Leeds", zone: "Europe/London", colour: "bg-lime" },
  { city: "Manchester", zone: "Europe/London", colour: "bg-teal" },
  { city: "London", zone: "Europe/London", colour: "bg-mint" },
  { city: "New York", zone: "America/New_York", colour: "bg-gold" },
];

/** A light-hearted guess at what's going on, by local hour and weekday. */
function vibe(hour: number, weekday: string): string {
  if (weekday === "Sat" || weekday === "Sun") return "Weekend. Recharging.";
  if (weekday === "Fri" && hour >= 13) return "Friday Flex territory";
  if (hour < 7) return "Asleep (probably)";
  if (hour < 9) return "Coffee and inbox";
  if (hour < 12) return "Heads down, making it happen";
  if (hour < 14) return "Lunch and a catch-up";
  if (hour < 17) return "Client calls and big ideas";
  if (hour < 19) return "Wrapping up the day";
  return "Logged off. See you tomorrow.";
}

const subscribe = (tick: () => void) => {
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
};

/** "Right now at Journey Further": live local time in every office. */
export function OfficeClocks() {
  const now = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 1000), () => null);
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {OFFICES.map((o) => {
        const date = now === null ? null : new Date(now * 1000);
        const time = date?.toLocaleTimeString("en-GB", { timeZone: o.zone, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const hour = date ? Number(date.toLocaleString("en-GB", { timeZone: o.zone, hour: "2-digit", hour12: false })) : 0;
        const weekday = date?.toLocaleString("en-GB", { timeZone: o.zone, weekday: "short" }) ?? "";
        return (
          <li key={o.city} className={`rounded-3xl p-6 ${o.colour}`}>
            <p className="font-display text-xl">{o.city}</p>
            <p className="font-display mt-3 text-4xl tabular-nums">{time ?? "--:--:--"}</p>
            <p className="mt-2 text-base font-bold">{date ? vibe(hour, weekday) : " "}</p>
          </li>
        );
      })}
    </ul>
  );
}
