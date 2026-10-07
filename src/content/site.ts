/**
 * Site furniture and microcopy: navigation, labels, timeline stops,
 * counters and benefit cards. Culture Code copy itself lives in code.ts.
 */
import type { Office, ReactionId, StoryType, ValueId } from "./types";

export type NavSection = { id: string; label: string };

export const navSections: NavSection[] = [
  { id: "cover", label: "Culture Code" },
  { id: "who-we-are", label: "Who We Are" },
  { id: "you-belong-here", label: "You Belong Here" },
  { id: "high-standards", label: "High Standards. High Care." },
  { id: "how-we-succeed", label: "How We Succeed" },
  { id: "together", label: "Together" },
  { id: "open", label: "Open" },
  { id: "proactive", label: "Proactive" },
  { id: "the-promise", label: "The Promise" },
  { id: "shape-the-code", label: "Shape the Code" },
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

export const reactions: { id: ReactionId; emoji: string; label: string }[] = [
  { id: "hands", emoji: "🙌", label: "Love this" },
  { id: "heart", emoji: "❤️", label: "Care" },
  { id: "bulb", emoji: "💡", label: "Great idea" },
  { id: "fire", emoji: "🔥", label: "Never settle" },
];

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
  liveFromTeam: "Live from the team",
  seeAllStories: "See all stories",
  wallHeading: "Values in the Wild",
  wallIntro: "Real moments of people living the values. Filter, search, react - and add your own.",
  wallEmpty: "Nothing here yet. Be the first.",
  seenAValue: "Seen a value in action? Tell us.",
  searchPlaceholder: "Search stories",
  lastUpdated: "Last updated",
  justIn: "Just in",
  pending: "Pending review",
  example: "Example",
  fromTheCode: "From the Culture Code",
  featured: "Featured",
  anonymous: "Anonymous",
  thanks: "Thanks! Your story's with the People team.",
  pulseQuestion: "Which value did you live this week?",
  pulseNote: "Example tally, stored on this device only",
  winsHeading: "Latest wins",
  spotlightHeading: "People spotlight",
  exampleNote: "Example content shows how this would look. Names in [brackets] are placeholders.",
};
