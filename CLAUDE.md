@AGENTS.md

# Journey Further Culture Code website: handover notes

Read this first. It's the context from the build session so a new session can pick up edits and polish. `README.md` (how to run, content editing, decisions) and `ASSET_MAP.md` (where every image and sound comes from) have the details.

## What this is

A pitch prototype for an online, "living" version of the Journey Further Culture Code, which launches as a printed 210×210mm booklet. The owner is Neil (GitHub `neilastin`). It will be shown to leadership and colleagues to win buy-in, so it should feel like an award-entry microsite.

- **Original brief:** `../JF_Culture_Code_Website_Claude_Code_Prompt.md`. Section 8 is the approved copy; Sections 5 (voice) and 6 (technical rules) still apply.
- **Print creative:** `../Journey Further Culture Code 210x210 V1.pdf`. Each PDF page is a cropped spread, with the right-hand page outside the page box.
- **Supplied assets:** `../assets/`, `../new assets/` (second round of art: separate Culture/CODE, Great/Strategy, High/Standards/Care, boot and cracked Under Pressure, light off/on, handshake pair, new-style illustrations, front office photo), `../SöhneBreit-Fett.otf`, `../Evolution.mp3` (Neil reading The Evolution; narration is parked for launch). Three photos in `new assets` (DSC04457, DSC07145, the video still) aren't used yet.
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
src/content/                  ALL copy and data: code.ts (approved copy), site.ts (nav, timeline, stats, office clocks, microcopy),
                              stories.json (approved stories, empty at launch), feeds.ts (validates JSON), media.ts (GENERATED), experiments.ts
src/components/stage/         layered print "openers": photo + lettering + people cut-out, positioned in PDF points (595 = page)
src/components/sections/      one folder per Part; values/ holds Together, Open, Proactive and the shared ValueInAction
src/components/stories/       Values in the Wild: StoriesProvider (state), wall, cards, modal, share form, admin bar
src/components/motion/        SmoothScroll (Lenis), RevealText (SplitText lines), PopIn (spring), MotionProvider
src/components/ui/            atoms: MediaImage, NeverSettle, Hint (useHint + tap pill), Dialog, Icons, Logo…
src/lib/                      gsap.ts (plugins + MOTION_OK query), localStore.ts (hydration-safe localStorage), eggs.ts (confetti/toast)
scripts/build_assets.py       PDF layers + PNGs (assets/ and new assets/) → public/images/*.webp, regenerates media.ts
scripts/build_audio.py        narration + original synthesised music bed (parked: the player was removed for launch)
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
  - After replacing an image file, delete `.next/dev/cache/images` (dev server) and `.next/cache/images` (build), or the old optimised copy is served.
- **Images:** add or change them in `scripts/build_assets.py`, never by hand in `media.ts`. Use `--only <xrefs> <file.png>` for a partial rebuild, `--new-only` for the new-assets art, and `--manifest-only` to regenerate `media.ts`. Paired art (light off/on, whole/cracked Under Pressure, the handshake people) is cropped to one shared box so the layers stack exactly; the founders' new painting is perspective-warped into the gold frame's opening (`FRAME_OPENING`).
- **NEVER SETTLE stack** was removed from the site (Neil's call); `ui/NeverSettle.tsx` is in git history if it comes back.
- **Dev server and `globals.css`:** Turbopack occasionally keeps serving stale CSS after an edit. If a new rule doesn't apply, restart the dev server.
- **Values gravity** (`who-we-are/ValuesGravity.tsx`) is a hand-rolled rAF physics sim: drag and throw, gravity toggle. It drops the values in when it scrolls into view and sleeps while off screen.
- **Animated controls:** controls that arrive with a scroll animation (the High Standards flags) should be scrolled to before Playwright clicks them. A pointer drag over an `<img>` gets cancelled by the native image drag: `preventDefault()` on pointerdown and `[&_img]:pointer-events-none` (see `FlyingFlags.tsx`). Moving targets need `click({ force: true })`.
- **Light switch darkness** uses a registered `@property --lamp` so the mask radius can transition (`.lights-off` in `globals.css`).

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

**Done so far:** the full site; the first round of amends (timeline years, Today tiles with a live days-old counter from 16 Jan 2017, NEVER SETTLE fix, value lettering in each Value in Action header, keyframe-error fix); Easter eggs; the `/experimental` page.

**Second round (branch `fixes-and-polish`, awaiting Neil's review):** new-assets art throughout (separate Culture/CODE on the cover and nav, Great/Strategy that buckle when FAILS lands, new founders' painting, front office photo, OPEN and PROACTIVE graphics, new magnifier and Together illustrations, white-backed mountain); narration removed; Our Values cards flip to a big version of each value's lettering (white card, dark border); values gravity playground in "Why we are obsessive"; High Standards flags that won't come down replace the see-saw; NEVER SETTLE only in the footer; footer is just Journey Further plus links in a row; cover is the Culture Code lettering bursting out of a turning sunburst (no people);  the Experimental page is unlinked and noindexed for v1.0; nav: no Share button (Journey Further wordmark instead), bar shows "Part n / 6", rail grouped by part with values as sub-dots under Part 4 (`navSections` in `site.ts` carries `part`/`sub`); the statement background is rippling lilac rings (`.ripples`); Today regrouped (copy beside heading, photo + tiles as one grid, Right now in a dark panel); gravity toggle is a switch inside the play area; the boot stomp pins briefly so it can't be scrolled past; new Who We Are photo (`who-we-are.png`); rail part numbers sit in filled discs; Open principles + mountain + magnifier are one collage in `OpenPrinciples.tsx` (PullGraphic removed); Promise and Shape openers use `compact`; promises are dark cards (`PromiseCard` in `Handshake.tsx`); Open principles section has no photo (card + magnifier + mountain only); You Belong Here opener is a three-photo collage (`BelongCollage.tsx`, youbelong 1-3) with the lettering on top; cut-outs were tried on two photos and rejected; Shape the Code uses `shape.jpg` flat, with the lettering across the bottom (a cut-out was tried and made the lettering hard to read); Leeds 2017 timeline dot opens a throwback Polaroid (`Throwback.tsx`, portalled to body); High Standards opener is the hot air balloon (`BalloonLaunch.tsx`): five layers on one canvas built by `build_balloon()` (values lettering wrapped onto the envelopes, wordmark plaque on the basket, flames drawn behind the balloons with a masked glow in front), one burner tips the rig, both make it soar while the seven `standards care` photos (`photos/hs-1..7`) fall away; photos float in the sky on lg and sit in a strip below on smaller screens; the share pop-up copies the People team's email; Together VIA shows the paddleboard and video-call illustrations as a pair; VIA value lettering straddles the photo; four-quarter Together drift; boot stomp with crack and screen shake; restless sparking Proactive opener; dark-until-you-flip light switch; full-body handshake that walks in; "Right now at Journey Further" in Today with a different tagline per office; tap hints on every interactive; the neversettle dare; all made-up live content removed; Values in the Wild then parked for launch (components kept but unmounted; Share a story opens a pop-up pointing to people@journeyfurther.com, copy in `site.ts` `ui.shareSoon`).

**Dates (confirmed by Neil):** the pub get-together was **2016**; it led to Journey Further starting in early **2017**. The Origin Story copy now opens "A get-together in a Yorkshire pub was the start of something." with no date (Neil's call; the timeline carries the years). This deliberately differs from the brief's Section 8 and the print booklet.

**Open:**
1. **Mobile performance:** Lighthouse mobile is ~55 (hydration cost of a long, fully interactive page). Desktop is 96, and accessibility, best practices and SEO are 100. The next step is lazy hydration of below-the-fold sections.
2. **Review of round two:** Neil to approve or remove the new concepts (value card flips, the balloon, boot stomp, restless Proactive, light switch reveal, hints, the dare). Then merge `fixes-and-polish` into `main`.
3. **Values in the Wild:** parked for launch. To bring it back, remount `StoryWall` in `ShapeTheCode.tsx` and `ShareStoryDialog`/`StoryModal`/`AdminBar` in `page.tsx`, and restore the footer link.
4. **Narration:** parked for launch (README "Narration"). Neil may bring it back later, possibly with a real royalty-free track. Ask before downloading anything.
5. **Motivosity:** "Live from the team" strips were removed; the plan is to feed them from Motivosity later.
6. **Ideas needing content:** listed in `src/content/experiments.ts`.
7. **Shared stories:** submissions and moderation are per-browser (`localStorage`). Real launch needs a backend; see README "How this would work for real".
