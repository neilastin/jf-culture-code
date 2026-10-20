"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { teamStories } from "@/content/feeds";
import type { Office, Story, StoryType, ValueId } from "@/content/types";
import { createLocalStore, useLocalStore } from "@/lib/localStore";

/* ---------- Persistent demo state (this device only) ---------- */

type Moderation = Record<string, { status?: Story["status"]; featured?: boolean; removed?: boolean }>;

const submittedStore = createLocalStore<Story[]>("submitted", []);
const moderationStore = createLocalStore<Moderation>("moderation", {});
const adminStore = createLocalStore<boolean>("admin", false);

/* ---------- Types ---------- */

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
  /** Every visible story: featured first, then newest. */
  stories: Story[];
  justIn: ReadonlySet<string>;
  submit: (input: NewStory) => Story;
  admin: boolean;
  setAdmin: (on: boolean) => void;
  moderate: (storyId: string, action: "approve" | "feature" | "unfeature" | "remove") => void;
  resetDemo: () => void;
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

function sortStories(a: Story, b: Story): number {
  const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  if (featured !== 0) return featured;
  return (b.date ?? "").localeCompare(a.date ?? "");
}

/**
 * The story wall's state. Approved stories come from stories.json; stories
 * shared here are kept on this device as "Pending review" until the People
 * team approves them (?admin=1 shows how that moderation would work).
 */
export function StoriesProvider({ children }: { children: ReactNode }) {
  const submitted = useLocalStore(submittedStore);
  const moderation = useLocalStore(moderationStore);
  const admin = useLocalStore(adminStore);

  const [justIn, setJustIn] = useState<ReadonlySet<string>>(new Set());
  const [shareOpen, setShareOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // ?admin=1 switches on the moderation demo; ?admin=0 switches it off.
  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get("admin");
    if (flag === "1") adminStore.set(true);
    if (flag === "0") adminStore.set(false);
  }, []);

  const stories = useMemo(
    () =>
      [...submitted, ...teamStories]
        .map((s) => ({ ...s, ...moderation[s.id] }))
        .filter((s) => !moderation[s.id]?.removed)
        .sort(sortStories),
    [submitted, moderation],
  );

  const submit = useCallback((input: NewStory): Story => {
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
    setJustIn((prev) => new Set(prev).add(story.id));
    return story;
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
    setJustIn(new Set());
  }, []);

  const value = useMemo<StoriesContextValue>(
    () => ({
      stories,
      justIn,
      submit,
      admin,
      setAdmin: (on) => adminStore.set(on),
      moderate,
      resetDemo,
      shareOpen,
      openShare: () => setShareOpen(true),
      closeShare: () => setShareOpen(false),
      activeStory: stories.find((s) => s.id === activeId) ?? null,
      openStory: setActiveId,
      closeStory: () => setActiveId(null),
    }),
    [stories, justIn, submit, admin, moderate, resetDemo, shareOpen, activeId],
  );

  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>;
}
