/**
 * Site furniture and microcopy: navigation, labels, timeline stops,
 * counters and benefit cards. Culture Code copy itself lives in code.ts.
 */
import type { Office, StoryType, ValueId } from "./types";

/** `part` is the Code's part number; the three values sit inside Part 4 as sub-sections. */
export type NavSection = { id: string; label: string; part?: number; sub?: boolean };

export const PART_COUNT = 6;

export const navSections: NavSection[] = [
  { id: "cover", label: "Culture Code" },
  { id: "who-we-are", label: "Who We Are", part: 1 },
  { id: "you-belong-here", label: "You Belong Here", part: 2 },
  { id: "high-standards", label: "High Standards. High Care.", part: 3 },
  { id: "how-we-succeed", label: "How We Succeed", part: 4 },
  { id: "together", label: "Together", part: 4, sub: true },
  { id: "open", label: "Open", part: 4, sub: true },
  { id: "proactive", label: "Proactive", part: 4, sub: true },
  { id: "the-promise", label: "The Promise", part: 5 },
  { id: "shape-the-code", label: "Shape the Code", part: 6 },
];

export const valueMeta: Record<
  ValueId,
  { label: string; strapline: string; anchor: string; colour: string; ink: string }
> = {
  together: {
    label: "Together",
    strapline: "One Team, Always",
    anchor: "together",
    colour: "var(--color-together)",
    ink: "#ffffff",
  },
  open: {
    label: "Open",
    strapline: "Curious and Candid",
    anchor: "open",
    colour: "var(--color-sage)",
    ink: "#ffffff",
  },
  proactive: {
    label: "Proactive",
    strapline: "Make It Happen",
    anchor: "proactive",
    colour: "var(--color-lime)",
    ink: "var(--color-charcoal)",
  },
};

export const storyTypeLabels: Record<StoryType, string> = {
  client: "Client story",
  people: "People story",
  win: "Win",
  "shout-out": "Shout-out",
};

export const offices: Office[] = ["Leeds", "Manchester", "London", "New York", "Remote"];

/** The Evolution timeline. */
export const timeline: { place: string; note: string; year?: string }[] = [
  { place: "A Yorkshire pub", note: "Three founders get together", year: "2016" },
  { place: "Leeds", note: "Journey Further is officially launched, followed by fast growth and three office moves", year: "2017" },
  { place: "Manchester", note: "Over the Pennines we go and open our Manchester office", year: "2019" },
  { place: "London", note: "On to the capital, our London office opens", year: "2020" },
  { place: "New York", note: "Over the Atlantic we fly, opening in New York and hiring all across the US", year: "2022" },
  { place: "We journey further", note: "New services, new specialisms, new teams, new people" },
];

export const todayStats: { value: number; label: string }[] = [
  { value: 200, label: "people (or thereabouts)" },
  { value: 4, label: "cities" },
  { value: 2, label: "continents" },
];

/** "Right now at Journey Further": each office's time zone and tile colour. */
export const officeClocks = [
  { city: "Leeds", zone: "Europe/London", colour: "bg-lime" },
  { city: "Manchester", zone: "Europe/London", colour: "bg-teal" },
  { city: "London", zone: "Europe/London", colour: "bg-mint" },
  { city: "New York", zone: "America/New_York", colour: "bg-gold" },
] as const;

export type ClockCity = (typeof officeClocks)[number]["city"];

export type OfficeMoment = "night" | "early" | "morning" | "lunch" | "afternoon" | "evening" | "late" | "fridayFlex" | "weekend";

/**
 * A light-hearted guess at what each office is up to, by local time. Every
 * office gets its own line, so the three UK offices never say the same thing.
 */
export const officeMoments: Record<OfficeMoment, Record<ClockCity, string>> = {
  night: {
    Leeds: "Asleep (probably)",
    Manchester: "Dreaming up tomorrow's ideas",
    London: "The city sleeps. So do we.",
    "New York": "Lights out, alarms set",
  },
  early: {
    Leeds: "First coffee, first wins",
    Manchester: "Kettle on, inbox open",
    London: "Commute podcast, then go time",
    "New York": "Coffee in hand, laptop open",
  },
  morning: {
    Leeds: "Heads down, making it happen",
    Manchester: "Ideas flying across the desks",
    London: "Client calls back to back",
    "New York": "Stand-ups and big plans",
  },
  lunch: {
    Leeds: "Lunch and a catch-up",
    Manchester: "Queueing for the good sandwich",
    London: "Lunchtime walk, fresh ideas",
    "New York": "Grabbing a slice between calls",
  },
  afternoon: {
    Leeds: "Testing, learning, optimising",
    Manchester: "Whiteboards full of ideas",
    London: "Pitch prep in full swing",
    "New York": "Deep in the data",
  },
  evening: {
    Leeds: "Wrapping up the day",
    Manchester: "One last look at the numbers",
    London: "Tidying up, heading out",
    "New York": "Handing over to tomorrow",
  },
  late: {
    Leeds: "Logged off. See you tomorrow.",
    Manchester: "Switched off and recharging",
    London: "Out and about, laptop closed",
    "New York": "Done for the day",
  },
  fridayFlex: {
    Leeds: "Friday Flex territory",
    Manchester: "Friday Flex. Enjoy it.",
    London: "Friday Flex has begun",
    "New York": "Friday afternoon, nearly there",
  },
  weekend: {
    Leeds: "Out of office. Back on Monday.",
    Manchester: "Out of office, weekend mode on",
    London: "Out of office, laptops closed",
    "New York": "Out of office for the weekend",
  },
};

/** The day Journey Further officially started. Drives the live "days old" counter. */
export const FOUNDED = "2017-01-16";

export const benefits: { id: string; title: string; icon: BenefitIcon }[] = [
  { id: "flex", title: "Flexible working", icon: "flex" },
  { id: "holidays", title: "Generous holidays", icon: "sun" },
  { id: "friday", title: "Friday Flex every week", icon: "friday" },
  { id: "support", title: "Managers, directors and a People team, always available", icon: "support" },
  { id: "policies", title: "People-focused policies, regularly reviewed", icon: "policy" },
  { id: "health", title: "Private health care for everyone who wants it", icon: "health" },
];

export type BenefitIcon = "flex" | "sun" | "friday" | "support" | "policy" | "health";

export const ui = {
  shareStory: "Share a story",
  skipToContent: "Skip to content",
  scrollCue: "Scroll to begin",
  /** The share pop-up's opening line: the Code's Part 6 wording, with "our values" as Neil asked. */
  shareIntro:
    "The most admired agency is built by every person who chooses, every day, to live our values. If you've seen a value in action, tell us. This section will grow with those stories - and prove that our values work.",
  shareSoon:
    "You'll soon be able to share a story straight from the Culture Code. For now, please email your story to the People team. We'll pick it up and share it on this living Culture Code.",
  copyEmail: "Copy email address",
  emailCopied: "Copied!",
  peopleEmail: "people@journeyfurther.com",
  wallHeading: "Values in the Wild",
  wallIntro:
    "Real moments of people living our values. The wall starts small and grows with every story you share. The People team reads each one, and once it's approved it appears here for everyone.",
  addStoryTitle: "Add your story",
  addStoryBody: "Seen a value in action? Big or small, tell us about it.",
  seenAValue: "Seen a value in action? Tell us.",
  justIn: "Just in",
  pending: "Pending review",
  featured: "Featured",
  anonymous: "Anonymous",
  thanks: "Thanks! Your story's with the People team.",
};
