/**
 * Shared content types. Every piece of copy and every story lives in
 * /src/content so it can be edited without touching components.
 */

export type ValueId = "together" | "open" | "proactive";

export type StoryType = "client" | "people" | "win" | "shout-out";

export type Office = "Leeds" | "Manchester" | "London" | "New York" | "Remote";

/** Where a story came from. Drives the honesty labels in the UI. */
export type StorySource = "culture-code" | "example" | "submitted";

export type StoryStatus = "published" | "pending";

export type Story = {
  id: string;
  title: string;
  body: string;
  value: ValueId;
  type: StoryType;
  office?: Office;
  /** Optional "who was involved" note from the share form. */
  involved?: string;
  /** null means the author chose to post anonymously. */
  author: { name: string; role?: string } | null;
  /** ISO date. Culture Code stories have no date of their own. */
  date?: string;
  image?: { src: string; alt: string };
  source: StorySource;
  status: StoryStatus;
  featured?: boolean;
  /** Starting reaction counts for example stories. */
  reactions?: Partial<Record<ReactionId, number>>;
};

export type ReactionId = "hands" | "heart" | "bulb" | "fire";

export type Win = {
  id: string;
  headline: string;
  detail: string;
  office: Office;
};

export type Spotlight = {
  id: string;
  kind: "New joiner" | "Promotion" | "Made it happen";
  name: string;
  role: string;
  office: Office;
  quote: string;
  value: ValueId;
};

/** Rich text uses **double asterisks** for bold. Nothing else. */
export type RichText = string;
