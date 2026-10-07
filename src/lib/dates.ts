const DAY = 24 * 60 * 60 * 1000;

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** "Today", "Yesterday", "3 days ago", or a date for anything older than a week. */
export function relativeDate(iso: string, now: Date): string {
  const days = Math.floor((startOfDay(now) - startOfDay(new Date(iso))) / DAY);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
