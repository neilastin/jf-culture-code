"use client";

import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { offices, storyTypeLabels, ui, valueMeta } from "@/content/site";
import type { Office, StoryType, ValueId } from "@/content/types";
import { cn } from "@/lib/cn";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { Dialog } from "@/components/ui/Dialog";
import { TickIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/Select";
import { NO_FILTERS, useStories, type NewStory } from "./StoriesProvider";

const MIN_BODY = 20;
const MAX_BODY = 600;
const MAX_IMAGE_PX = 900;

const VALUE_CARD: Record<ValueId, string> = {
  together: "peer-checked:bg-together peer-checked:text-white",
  open: "peer-checked:bg-sage peer-checked:text-charcoal",
  proactive: "peer-checked:bg-lime peer-checked:text-ink",
};

type Draft = Omit<NewStory, "office" | "value"> & { value: ValueId | null; office: Office | "" };

const EMPTY: Draft = {
  value: null,
  body: "",
  title: "",
  involved: "",
  type: "people",
  office: "",
  anonymous: false,
  name: "",
  role: "",
};

/** Downscales an uploaded photo so it fits comfortably in localStorage. */
function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_PX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    img.src = url;
  });
}

const fieldClass =
  "w-full rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/45 hover:border-ink/35";
const labelClass = "block text-base font-extrabold";

/** Part 6's call to action: a short, friendly form that posts straight to the wall. */
export function ShareStoryDialog() {
  const { shareOpen, closeShare, submit, setFilters } = useStories();
  const scrollTo = useScrollTo();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [image, setImage] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [errors, setErrors] = useState<{ value?: string; body?: string; image?: string }>({});
  const [done, setDone] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const reset = () => {
    setDraft(EMPTY);
    setImage(null);
    setImageAlt("");
    setErrors({});
    setDone(false);
  };

  const close = () => {
    closeShare();
    reset();
  };

  const onImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImage(await readImage(file));
      setErrors((x) => ({ ...x, image: undefined }));
    } catch {
      setErrors((x) => ({ ...x, image: "That file didn't work. Try a JPG or PNG." }));
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!draft.value) next.value = "Pick the value you saw.";
    if (draft.body.trim().length < MIN_BODY) next.body = `Tell us a little more (at least ${MIN_BODY} characters).`;
    setErrors(next);
    if (next.value || next.body || !draft.value) return;
    submit({
      ...draft,
      value: draft.value,
      office: draft.office || undefined,
      image: image ? { src: image, alt: imageAlt.trim() || "Photo shared with this story" } : undefined,
    });
    setDone(true);
  };

  const seeIt = () => {
    close();
    setFilters(NO_FILTERS);
    window.setTimeout(() => scrollTo("values-in-the-wild"), 150);
  };

  return (
    <Dialog open={shareOpen} onClose={close} labelledBy="share-title">
      {done ? (
        <div className="px-6 py-14 text-center sm:px-12">
          <motion.div
            className="mx-auto w-20"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 12 }}
          >
            <TickIcon className="h-20 w-20" />
          </motion.div>
          <h2 id="share-title" className="font-display mt-6 text-2xl sm:text-3xl">
            {ui.thanks}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg">It&apos;s on the wall now with a &ldquo;{ui.pending}&rdquo; tag.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={seeIt} className="rounded-full bg-ink px-6 py-3 font-extrabold text-white transition-transform hover:scale-105">
              See it on the wall
            </button>
            <button type="button" onClick={reset} className="rounded-full border-2 border-ink px-6 py-3 font-extrabold transition-colors hover:bg-ink hover:text-white">
              Share another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-7 px-6 pt-4 pb-8 sm:px-10 sm:pb-10">
          <div className="pr-12">
            <h2 id="share-title" className="font-display text-2xl sm:text-3xl">
              {ui.seenAValue}
            </h2>
            <p className="mt-3 text-base text-ink/75">Two minutes, tops. The People team reviews every story before it goes live for everyone.</p>
          </div>

          <fieldset aria-describedby={errors.value ? "err-value" : undefined}>
            <legend className={labelClass}>Which value did you see?</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(Object.keys(valueMeta) as ValueId[]).map((id) => (
                <label key={id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="value"
                    value={id}
                    checked={draft.value === id}
                    onChange={() => set("value", id)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "flex h-full flex-col rounded-2xl border-2 border-ink/15 p-3 transition-all duration-300 ease-[var(--ease-spring)] peer-checked:scale-[1.03] peer-checked:border-ink peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple hover:border-ink/40 sm:p-4",
                      VALUE_CARD[id],
                    )}
                  >
                    <span className="font-display text-sm sm:text-lg">{valueMeta[id].label}</span>
                    <span className="mt-1 text-xs font-semibold opacity-80 sm:text-sm">{valueMeta[id].strapline}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.value && (
              <p id="err-value" className="mt-2 text-sm font-bold text-[#b42318]">
                {errors.value}
              </p>
            )}
          </fieldset>

          <div>
            <label htmlFor="share-body" className={labelClass}>
              What happened?
            </label>
            <textarea
              id="share-body"
              rows={5}
              maxLength={MAX_BODY}
              value={draft.body}
              onChange={(e) => set("body", e.target.value)}
              aria-invalid={Boolean(errors.body)}
              aria-describedby={`share-body-count${errors.body ? " err-body" : ""}`}
              placeholder="What did you see, and why did it matter?"
              className={cn(fieldClass, "mt-2 resize-y")}
            />
            <div className="mt-1 flex justify-between text-sm">
              {errors.body ? (
                <p id="err-body" className="font-bold text-[#b42318]">
                  {errors.body}
                </p>
              ) : (
                <span />
              )}
              <span id="share-body-count" className="text-ink/75 tabular-nums">
                {draft.body.length}/{MAX_BODY}
              </span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="share-title-input" className={labelClass}>
                Give it a headline <span className="font-semibold text-ink/75">(optional)</span>
              </label>
              <input
                id="share-title-input"
                value={draft.title}
                maxLength={80}
                onChange={(e) => set("title", e.target.value)}
                placeholder="We'll use your first sentence"
                className={cn(fieldClass, "mt-2")}
              />
            </div>
            <div>
              <label htmlFor="share-involved" className={labelClass}>
                Who was involved? <span className="font-semibold text-ink/75">(optional)</span>
              </label>
              <input
                id="share-involved"
                value={draft.involved}
                onChange={(e) => set("involved", e.target.value)}
                placeholder="Names, teams, clients"
                className={cn(fieldClass, "mt-2")}
              />
            </div>
            <div>
              <label htmlFor="share-type" className={labelClass}>
                What kind of story?
              </label>
              <div className="mt-2">
                <Select id="share-type" value={draft.type} onChange={(e) => set("type", e.target.value as StoryType)} className="py-3">
                  {(Object.keys(storyTypeLabels) as StoryType[]).map((t) => (
                    <option key={t} value={t}>
                      {storyTypeLabels[t]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <label htmlFor="share-office" className={labelClass}>
                Office
              </label>
              <div className="mt-2">
                <Select id="share-office" value={draft.office} onChange={(e) => set("office", e.target.value as Office | "")} className="py-3">
                  <option value="">Choose an office</option>
                  {offices.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="share-image" className={labelClass}>
              Add a photo <span className="font-semibold text-ink/75">(optional)</span>
            </label>
            <input
              id="share-image"
              type="file"
              accept="image/*"
              onChange={onImage}
              className="mt-2 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2.5 file:font-extrabold file:text-white hover:file:bg-purple"
            />
            {errors.image && <p className="mt-2 text-sm font-bold text-[#b42318]">{errors.image}</p>}
            {image && (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
                {/* eslint-disable-next-line @next/next/no-img-element -- local preview of an upload */}
                <img src={image} alt="Preview of your photo" className="h-28 w-40 rounded-xl object-cover" />
                <div className="flex-1">
                  <label htmlFor="share-image-alt" className="text-sm font-extrabold">
                    Describe the photo for people who can&apos;t see it
                  </label>
                  <input id="share-image-alt" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} className={cn(fieldClass, "mt-1 py-2")} />
                  <button type="button" onClick={() => setImage(null)} className="mt-2 text-sm font-extrabold underline underline-offset-4">
                    Remove photo
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-paper p-4 sm:p-5">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <span>
                <span className="block text-base font-extrabold">Post anonymously</span>
                <span className="block text-sm text-ink/70">We&apos;ll hide your name on the wall.</span>
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={draft.anonymous}
                onChange={(e) => set("anonymous", e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative h-8 w-14 shrink-0 rounded-full bg-ink/25 transition-colors peer-checked:bg-ink peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple after:absolute after:top-1 after:left-1 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-300 after:ease-[var(--ease-spring)] peer-checked:after:translate-x-6 peer-checked:after:bg-lime"
              />
            </label>
            {!draft.anonymous && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="share-name" className="text-sm font-extrabold">
                    Your name
                  </label>
                  <input id="share-name" value={draft.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={cn(fieldClass, "mt-1 py-2")} />
                </div>
                <div>
                  <label htmlFor="share-role" className="text-sm font-extrabold">
                    Your role
                  </label>
                  <input id="share-role" value={draft.role} onChange={(e) => set("role", e.target.value)} autoComplete="organization-title" className={cn(fieldClass, "mt-1 py-2")} />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-sm text-sm text-ink/75">Prototype: your story is saved on this device only.</p>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-lime px-7 py-3.5 text-lg font-extrabold text-ink shadow-md"
            >
              {ui.shareStory}
            </motion.button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
