"use client";

import { useState } from "react";
import { ui } from "@/content/site";
import { Dialog } from "@/components/ui/Dialog";
import { TickIcon } from "@/components/ui/Icons";
import { useStories } from "./StoriesProvider";

/**
 * What "Share a story" opens for launch: the Code's call to share, and the
 * People team's email address (one tap copies it) until stories can be
 * shared on the site.
 */
export function ShareInfoDialog() {
  const { shareOpen, closeShare } = useStories();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ui.peopleEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked: select the address so it can be copied by hand.
      const range = document.createRange();
      const target = document.getElementById("share-info-email");
      if (!target) return;
      range.selectNodeContents(target);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  };

  const close = () => {
    setCopied(false);
    closeShare();
  };

  return (
    <Dialog open={shareOpen} onClose={close} labelledBy="share-info-title">
      <div className="px-6 pt-4 pb-9 sm:px-10 sm:pb-11">
        <h2 id="share-info-title" className="font-display pr-12 text-2xl sm:text-3xl">
          {ui.shareStory}
        </h2>
        <p className="mt-5 text-lg leading-relaxed sm:text-xl">{ui.shareIntro}</p>
        <p className="mt-5 rounded-2xl bg-paper p-5 text-base leading-relaxed sm:text-lg">{ui.shareSoon}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-base font-extrabold text-ink shadow-md transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-105 hover:-rotate-1"
          >
            {copied && <TickIcon className="h-5 w-5" />}
            {copied ? ui.emailCopied : ui.copyEmail}
          </button>
          <span id="share-info-email" className="text-base font-extrabold select-all">
            {ui.peopleEmail}
          </span>
          <span aria-live="polite" className="sr-only">
            {copied ? `${ui.peopleEmail} copied to the clipboard` : ""}
          </span>
        </div>
      </div>
    </Dialog>
  );
}
