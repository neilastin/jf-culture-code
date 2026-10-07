"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { incomingStories, seedStories } from "@/content/feeds";
import type { Office, ReactionId, Story, StoryType, ValueId } from "@/content/types";
import { createLocalStore, useLocalStore } from "@/lib/localStore";

/* ---------- Persistent demo state (this device only) ---------- */

type Moderation = Record<string, { status?: Story["status"]; featured?: boolean; removed?: boolean }>;

const submittedStore = createLocalStore<Story[]>("submitted", []);
const moderationStore = createLocalStore<Moderation>("moderation", {});
const myReactionsStore = createLocalStore<Record<string, ReactionId[]>>("reactions", {});
const arrivedStore = createLocalStore<string[]>("arrived", []);
const adminStore = createLocalStore<boolean>("admin", false);

/* ---------- Types ---------- */

export type Filters = { value: ValueId | "all"; type: StoryType | "all"; office: Office | "all"; query: string };

export const NO_FILTERS: Filters = { value: "all", type: "all", office: "all", query: "" };

export type NewStory = {
  value: ValueId;
  body: string;
  title: string;
  involved: string;
  type: StoryType;
  office?: Office;
  anonymous: boolean;
  name: string;
  role: string;
  image?: { src: string; alt: string };
};

type StoriesContextValue = {
  /** Every visible story, newest and featured first. */
  stories: Story[];
  filtered: Story[];
  filters: Filters;
  setFilters: (next: Filters | ((prev: Filters) => Filters)) => void;
  justIn: ReadonlySet<string>;
  lastUpdated?: string;
  submit: (input: NewStory) => Story;
  reactionCounts: (story: Story) => { id: ReactionId; count: number; mine: boolean }[];
  toggleReaction: (storyId: string, reaction: ReactionId) => void;
  admin: boolean;
  setAdmin: (on: boolean) => void;
  moderate: (storyId: string, action: "approve" | "feature" | "unfeature" | "remove") => void;
  resetDemo: () => void;
  receiveIncoming: () => boolean;
  shareOpen: boolean;
  openShare: () => void;
  closeShare: () => void;
  activeStory: Story | null;
  openStory: (id: string) => void;
  closeStory: () => void;
};

const StoriesContext = createContext<StoriesContextValue | null>(null);

export function useStories(): StoriesContextValue {
  const ctx = useContext(StoriesContext);
  if (!ctx) throw new Error("useStories must be used inside <StoriesProvider>");
  return ctx;
}

const REACTION_IDS: ReactionId[] = ["hands", "heart", "bulb", "fire"];

/** Featured first, then the newest arrivals, then the Culture Code's own examples, then older stories. */
function rank(story: Story): number {
  if (story.featured) return 0;
  if (story.source === "submitted") return 1;
  if (story.source === "culture-code") return 3;
  return story.id.startsWith("example-incoming") ? 1 : 4;
}

function sortStories(a: Story, b: Story): number {
  const byRank = rank(a) - rank(b);
  if (byRank !== 0) return byRank;
  return (b.date ?? "").localeCompare(a.date ?? "");
}

function matches(story: Story, f: Filters): boolean {
  if (f.value !== "all" && story.value !== f.value) return false;
  if (f.type !== "all" && story.type !== f.type) return false;
  if (f.office !== "all" && story.office !== f.office) return false;
  const q = f.query.trim().toLowerCase();
  if (!q) return true;
  return [story.title, story.body, story.author?.name, story.author?.role, story.office, story.involved]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(q));
}

export function StoriesProvider({ children }: { children: ReactNode }) {
  const submitted = useLocalStore(submittedStore);
  const moderation = useLocalStore(moderationStore);
  const myReactions = useLocalStore(myReactionsStore);
  const arrived = useLocalStore(arrivedStore);
  const admin = useLocalStore(adminStore);

  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [justIn, setJustIn] = useState<ReadonlySet<string>>(new Set());
  const [shareOpen, setShareOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // ?admin=1 switches on the moderation demo; ?admin=0 switches it off.
  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get("admin");
    if (flag === "1") adminStore.set(true);
    if (flag === "0") adminStore.set(false);
  }, []);

  const stories = useMemo(() => {
    const arrivedStories = incomingStories.filter((s) => arrived.includes(s.id));
    return [...submitted, ...arrivedStories, ...seedStories]
      .map((s) => ({ ...s, ...moderation[s.id] }))
      .filter((s) => !moderation[s.id]?.removed)
      .sort(sortStories);
  }, [submitted, arrived, moderation]);

  const filtered = useMemo(() => stories.filter((s) => matches(s, filters)), [stories, filters]);

  const lastUpdated = useMemo(
    () => stories.reduce<string | undefined>((max, s) => (s.date && (!max || s.date > max) ? s.date : max), undefined),
    [stories],
  );

  const markJustIn = useCallback((id: string) => setJustIn((prev) => new Set(prev).add(id)), []);

  const submit = useCallback(
    (input: NewStory): Story => {
      const story: Story = {
        id: `submitted-${Date.now().toString(36)}`,
        title: input.title.trim() || input.body.trim().split(/(?<=[.!?])\s/)[0].slice(0, 80),
        body: input.body.trim(),
        value: input.value,
        type: input.type,
        office: input.office,
        involved: input.involved.trim() || undefined,
        author: input.anonymous ? null : { name: input.name.trim() || "Team member", role: input.role.trim() || undefined },
        date: new Date().toISOString(),
        image: input.image,
        source: "submitted",
        status: "pending",
      };
      submittedStore.set((prev) => [story, ...prev]);
      markJustIn(story.id);
      return story;
    },
    [markJustIn],
  );

  const receiveIncoming = useCallback((): boolean => {
    const next = incomingStories.find((s) => !arrivedStore.getSnapshot().includes(s.id));
    if (!next) return false;
    arrivedStore.set((prev) => [...prev, next.id]);
    markJustIn(next.id);
    return true;
  }, [markJustIn]);

  const reactionCounts = useCallback(
    (story: Story) =>
      REACTION_IDS.map((id) => {
        const mine = myReactions[story.id]?.includes(id) ?? false;
        return { id, mine, count: (story.reactions?.[id] ?? 0) + (mine ? 1 : 0) };
      }),
    [myReactions],
  );

  const toggleReaction = useCallback((storyId: string, reaction: ReactionId) => {
    myReactionsStore.set((prev) => {
      const current = prev[storyId] ?? [];
      const next = current.includes(reaction) ? current.filter((r) => r !== reaction) : [...current, reaction];
      return { ...prev, [storyId]: next };
    });
  }, []);

  const moderate = useCallback((storyId: string, action: "approve" | "feature" | "unfeature" | "remove") => {
    moderationStore.set((prev) => {
      const current = prev[storyId] ?? {};
      const patch =
        action === "approve"
          ? { status: "published" as const }
          : action === "feature"
            ? { featured: true, status: "published" as const }
            : action === "unfeature"
              ? { featured: false }
              : { removed: true };
      return { ...prev, [storyId]: { ...current, ...patch } };
    });
    if (action === "remove") setActiveId((id) => (id === storyId ? null : id));
  }, []);

  const resetDemo = useCallback(() => {
    submittedStore.set([]);
    moderationStore.set({});
    myReactionsStore.set({});
    arrivedStore.set([]);
    setJustIn(new Set());
  }, []);

  const value = useMemo<StoriesContextValue>(
    () => ({
      stories,
      filtered,
      filters,
      setFilters,
      justIn,
      lastUpdated,
      submit,
      reactionCounts,
      toggleReaction,
      admin,
      setAdmin: (on) => adminStore.set(on),
      moderate,
      resetDemo,
      receiveIncoming,
      shareOpen,
      openShare: () => setShareOpen(true),
      closeShare: () => setShareOpen(false),
      activeStory: stories.find((s) => s.id === activeId) ?? null,
      openStory: setActiveId,
      closeStory: () => setActiveId(null),
    }),
    [stories, filtered, filters, justIn, lastUpdated, submit, reactionCounts, toggleReaction, admin, moderate, resetDemo, receiveIncoming, shareOpen, activeId],
  );

  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>;
}
