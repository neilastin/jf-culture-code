/**
 * Typed access to the stories feed. JSON imports are loosely typed, so each
 * record is checked here once; a bad edit fails the build loudly instead of
 * rendering a broken card. See README "Adding a story to the wall".
 */
import storiesData from "./stories.json";
import type { Office, Story, StoryType, ValueId } from "./types";

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
  return { ...story, source: "team", status: "published" };
}

/** Stories approved by the People team, newest first. */
export const teamStories: Story[] = (storiesData.stories as unknown[]).map(toStory);
