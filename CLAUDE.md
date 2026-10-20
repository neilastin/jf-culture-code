@AGENTS.md

# Journey Further Culture Code website: handover notes

Read this first. It's the context from the build session so a new session can pick up edits and polish. `README.md` (how to run, content editing, decisions) and `ASSET_MAP.md` (where every image and sound comes from) have the details.

## What this is

A pitch prototype for an online, "living" version of the Journey Further Culture Code, which launches as a printed 210×210mm booklet. The owner is Neil (GitHub `neilastin`). It will be shown to leadership and colleagues to win buy-in, so it should feel like an award-entry microsite.

- **Original brief:** `../JF_Culture_Code_Website_Claude_Code_Prompt.md`. Section 8 is the approved copy; Sections 5 (voice) and 6 (technical rules) still apply.
- **Print creative:** `../Journey Further Culture Code 210x210 V1.pdf`. Each PDF page is a cropped spread, with the right-hand page outside the page box.
- **Supplied assets:** `../assets/`, `../SöhneBreit-Fett.otf`, `../Evolution.mp3` (Neil reading The Evolution).
- **Live code:** `github.com/neilastin/jf-culture-code` (private), deployed on Vercel from `main`.

## Non-negotiables

- **Approved copy is verbatim.** It lives in `src/content/code.ts`. Don't change wording without Neil saying so. Headings may be styled.
- **Copy check must stay clean.** The brief bans a list of old or wrong strings (US spellings, removed phrases, placeholder Latin, missing spaces after full stops). They live only in `scripts/qa/copy-check.mjs`; run `node scripts/qa/copy-check.mjs` after any copy change.
- **Voice for any new microcopy:** British English, positive, concise, human, active voice, hyphens rather than em dashes, no corporate filler.
- **Honesty:** all example stories, wins, spotlights and tallies are labelled "Example" and use [placeholder] names. Never invent real clients, people or results.
- **Never redraw or approximate** the hand-lettering or illustrations. Use the supplied art or the PDF layers.
- **Söhne Breit Fett is a licensed font**, so the repo stays private.
- **Everything works with `prefers-reduced-motion`:** fades only, nothing pinned.

## Stack and layout

Next.js 16 (App Router, Turbopack, static), TypeScript strict, Tailwind 4 (tokens in `src/app/globals.css` `@theme`), Framer Motion, GSAP + ScrollTrigger + SplitText, Lenis.

```
src/app/page.tsx              main page: sections in Code order
src/app/experimental/         separate "Experimental ideas" page (keep risky ideas here)
src/content/                  ALL copy and data: code.ts (approved copy), site.ts (nav, timeline, stats, microcopy),
                              stories/wins/people.json, feeds.ts (validates JSON), media.ts (GENERATED), audio.ts, experiments.ts
src/components/stage/         layered print "openers": photo + lettering + people cut-out, positioned in PDF points (595 = page)
src/components/sections/      one folder per Part; values/ holds Together, Open, Proactive and the shared ValueInAction
src/components/stories/       living features: StoriesProvider (state), wall, cards, modal, share form, admin bar, live modules
src/components/motion/        SmoothScroll (Lenis), RevealText (SplitText lines), PopIn (spring), MotionProvider
src/components/ui/            atoms: MediaImage, NeverSettle, SectionAudio, Dialog, Icons, Logo…
src/lib/                      gsap.ts (plugins + MOTION_OK query), localStore.ts (hydration-safe localStorage), eggs.ts (confetti/toast)
scripts/build_assets.py       PDF layers + PNGs → public/images/*.webp, and regenerates src/content/media.ts
scripts/build_audio.py        narration + original synthesised music bed → public/audio/*.mp3 (levels at top of file)
scripts/qa/                   Playwright checks: screenshots.mjs, story-flow.mjs
```

## Patterns and gotchas learned the hard way

- **Opener layers** use rects in PDF points, taken from the PDF itself (`rectStyle`). Photo and cut-out layers are `data-layer="scene"` and move together; lettering is `data-layer="lettering"` and drifts against them. Rotated PDF layers need centre, true size and a CSS rotate (see `Statement.tsx` `turned()`).
- **Proactive opener** is custom (`ProactiveOpener.tsx`). The photo is extended with the wall colour so the lettering clears the presenter; this was a print-review fix.
- **GSAP:** wrap scroll effects in `gsap.matchMedia()` with `MOTION_OK` from `@/lib/gsap`, inside `useGSAP`.
- **Framer Motion:**
  - Any animation with more than 2 keyframes needs `type: "tween"`. A spring with keyframes throws, and the error broke other animations on the page.
  - `MotionConfig reducedMotion="user"` only disables transform animations; handle opacity, clip-path and height yourself.
- **Hydration:**
  - Never branch rendered output on `useReducedMotion()`, `Date.now()`, `matchMedia` or `localStorage` during render. Use `motion-safe:`/`motion-reduce:` classes, effects, or the `useSyncExternalStore` helpers (`useNow`, `useMediaQuery`, `createLocalStore`).
  - React error #418 means a hydration mismatch.
- **whileInView on elements that start off-screen** (big initial `y`) never fires. Put `whileInView` on a parent and use variants.
- **Sideways scroll:** `html, body { overflow-x: clip }` is required. Without it, mobile browsers widen the viewport to fit transformed content.
- **ESLint (react-hooks v7) is strict:** no `performance.now()` or ref reads during render or in curried handlers made during render, no non-inline `useMemo` functions, no conditional hooks. Run `npx eslint src`.
- **Next 16:**
  - Use `preload` instead of the deprecated `priority` on `next/image`.
  - Read `node_modules/next/dist/docs/` before relying on memory (see AGENTS.md).
  - After replacing an image file, delete `.next/cache/images` or the old optimised copy is served.
- **Images:** add or change them in `scripts/build_assets.py`, never by hand in `media.ts`. Use `--only <xrefs> <file.png>` for a partial rebuild and `--manifest-only` to regenerate `media.ts`.
- **NEVER SETTLE stack** (`ui/NeverSettle.tsx`) uses `text-box-trim` and `cap` units: full line at the bottom, two lines above cropped from below so only letter tops show (matches Neil's reference image).
- **Gravity balls** (`who-we-are/GravityValues.tsx`) are a hand-rolled rAF physics sim. They drift up, and a click drops them with gravity and a bounce. Playwright needs `click({ force: true })` because they're always moving.

## Workflow on this machine (Windows)

- **Shell:** PowerShell 5.1, so no `&&`; use `;` or separate commands. The Bash tool is Git Bash.
- **Default-branch hook:** a hook blocks file edits on `main`/`master`. Create a branch first (`git checkout -b <name>`), then merge back to `main` when done.
- **Verify before handing back:**
  1. `npx tsc --noEmit`, then `npx eslint src`, then `npm run build`.
  2. Run `node scripts/qa/copy-check.mjs`.
  3. Run `npm run dev` (or `npx next start -p <port>` after a build), then `node scripts/qa/story-flow.mjs`, then `node scripts/qa/screenshots.mjs 1440 900 qa-out/desktop` and `… 390 844 qa-out/mobile`, and look at the screenshots.
  - `qa-out/` is git-ignored.
  - A stale `next start` can keep the port and serve an old build (500s on new chunks). Kill it first: `Get-NetTCPConnection -LocalPort <port> -State Listen` → `Stop-Process`.
- **Deploy:** commit to `main` and `git push`. Vercel redeploys automatically. Pushing publishes, so confirm with Neil first.

## Status and open items

**Done so far:** the full site; the round of amends (timeline years, Today tiles with a live days-old counter from 16 Jan 2017, non-clickable value cards, gravity sim, roomier value chips, NEVER SETTLE fix, value lettering in each Value in Action header, keyframe-error fix); Easter eggs; the `/experimental` page; Evolution narration with a play/pause/restart player.

**Open:**
1. **Copy decision:** the timeline says the pub was **2016**, but the approved Origin Story copy says "In January 2017, a get-together in a Yorkshire pub…". Ask Neil which is right before touching either.
2. **Mobile performance:** Lighthouse mobile is ~55 (hydration cost of a long, fully interactive page). Desktop is 96, and accessibility, best practices and SEO are 100. The next step is lazy hydration of below-the-fold sections.
3. **Narration:** Neil wants more sections read aloud, possibly with extra content. The pipeline is in README ("Adding narration to a section"). The music bed is synthesised and original; Neil may want a real royalty-free track instead. Ask before downloading anything.
4. **Ideas needing content:** listed in `src/content/experiments.ts` (then-and-now photos, founders' voice notes, values champions, personalised onboarding, CRM wins, read-aloud mode).
5. **Shared stories:** stories, reactions and moderation are per-browser (`localStorage`). A shared demo would need a real backend; see README "How this would work for real".
