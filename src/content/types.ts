/**
 * Shared content types. Every piece of copy and every story lives in
 * /src/content so it can be edited without touching components.
 */

export type ValueId = "together" | "open" | "proactive";

export type StoryType = "client" | "people" | "win" | "shout-out";

export type Office = "Leeds" | "Manchester" | "London" | "New York" | "Remote";

/**
 * Where a story came from. "team" stories are approved by the People team
 * and live in stories.json; "submitted" ones were shared on this device.
 */
export type StorySource = "team" | "submitted";

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
  /** ISO date. */
  date?: string;
  image?: { src: string; alt: string };
  source: StorySource;
  status: StoryStatus;
  featured?: boolean;
};

/** Rich text uses **double asterisks** for bold. Nothing else. */
export type RichText = string;
