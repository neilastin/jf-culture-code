/**
 * Typed access to the JSON feeds. JSON imports are loosely typed, so each
 * record is checked here once; a bad edit fails the build loudly instead of
 * rendering a broken card.
 */
import peopleData from "./people.json";
import storiesData from "./stories.json";
import winsData from "./wins.json";
import type { Office, Spotlight, Story, StoryType, ValueId, Win } from "./types";

const VALUES: readonly ValueId[] = ["together", "open", "proactive"];
const TYPES: readonly StoryType[] = ["client", "people", "win", "shout-out"];
const OFFICES: readonly Office[] = ["Leeds", "Manchester", "London", "New York", "Remote"];

function assertOneOf<T extends string>(list: readonly T[], value: string, where: string): T {
  if (!(list as readonly string[]).includes(value)) {
    throw new Error(`Content error in ${where}: "${value}" is not one of ${list.join(", ")}`);
  }
  return value as T;
}

function toStory(raw: unknown): Story {
  const story = raw as Story;
  assertOneOf(VALUES, story.value, story.id);
  assertOneOf(TYPES, story.type, story.id);
  if (story.office) assertOneOf(OFFICES, story.office, story.id);
  return story;
}

export const seedStories: Story[] = storiesData.stories.map(toStory);

/** Example stories that "arrive" while the wall is open, to demo live updates. */
export const incomingStories: Story[] = storiesData.incoming.map(toStory);

export const wins: Win[] = winsData.wins.map((w) => ({
  ...w,
  office: assertOneOf(OFFICES, w.office, w.id),
}));

export const spotlights: Spotlight[] = peopleData.spotlights.map((p) => ({
  ...p,
  kind: p.kind as Spotlight["kind"],
  office: assertOneOf(OFFICES, p.office, p.id),
  value: assertOneOf(VALUES, p.value, p.id),
}));
