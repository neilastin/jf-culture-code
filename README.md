# The Journey Further Culture Code (living website prototype)

A pitch prototype for an online version of the Culture Code that lives alongside the printed 210×210 booklet. Same words, same art direction, plus the thing print can't do: it changes. People share stories of the values in action, the wall updates instantly, and the People team moderates.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build:

```bash
npm run build
npm start
```

It's a standard Next.js app, ready to import into Vercel with no settings changed. There are no API keys, databases or environment variables. Fonts are self-hosted at build time.

### Demo tips

- **Share a story** (top right, or Part 6) opens a pop-up with the Code's call to share (with "our values") and a button that copies people@journeyfurther.com. Stories can't be shared on the site yet.
- **Values in the Wild is parked for launch.** The story wall, story modal, share form and moderation bar are still in `src/components/stories/` but aren't mounted; `src/app/page.tsx` has a comment where they plug back in. The "Adding a story to the wall" notes below apply when it returns.
- **Things to play with**, each with a small "tap" hint that appears after a moment: the Our Values cards flip over to their lettering; "Why we are obsessive" is a gravity playground; fire the High Standards balloon's burners (one tips it, both make it soar); the boot in "We come together under pressure" stomps again (and "or replay the whole thing" plays the whole sequence); "Proactive" gives a jolt; and the Proactive section stays dark until you flip the light switch.
- Everything is stored in this browser's `localStorage` only.
- **Easter eggs:** type "never settle" anywhere (or the Konami code; a note dares keyboard users to try it once they've scrolled past How We Succeed), click the founders' painting, switch gravity off, or flip the light switch six times fast.
- **Experimental ideas** (`/experimental`, not linked from v1.0 and not indexed): a values quiz, "Sign the Code", and ideas that need new content.

### Checking changes

With the site running (`npm run dev`), from this folder:

- `node scripts/qa/copy-check.mjs`: the brief's banned-strings check
- `node scripts/qa/story-flow.mjs`: end-to-end check of the share pop-up, the value cards, the balloon, the boot, the light switch and the Value in Action flip
- `node scripts/qa/screenshots.mjs 1440 900 qa-out/desktop` (or `390 844 qa-out/mobile`): screenshots down the whole page

The first time, run `npx playwright install chromium`. `CLAUDE.md` has fuller handover notes for anyone (or any AI session) picking the project up.

## Stack

- **Next.js 16** (App Router, static prerender) + **TypeScript** (strict) + **Tailwind CSS 4**
- **Framer Motion** for component motion (springs, flips, layout re-flow on the story wall)
- **GSAP + ScrollTrigger + SplitText** for scroll-driven sequences (pinned statement and "How We Succeed", parallax, timeline drawing, line-by-line text)
- **Lenis** for smooth scrolling, driven by the GSAP ticker
- `next/image` with pre-optimised WebP sources

## How content is organised

All words and data live in `src/content`, separate from components:

| File | What's in it |
|---|---|
| `code.ts` | The approved Culture Code copy, section by section. `**bold**` marks bold text |
| `site.ts` | Navigation, labels, microcopy, timeline stops, counters, benefits, office clocks and their taglines |
| `stories.json` | Stories approved by the People team for Values in the Wild (empty at launch) |
| `media.ts` | Generated list of every image with its size. Don't edit by hand |
| `feeds.ts` | Loads and checks `stories.json`, so a typo in a value or office fails the build loudly |

### Adding a story to the wall

Values in the Wild launches empty apart from the "Add your story" tile, and grows as the People team approves stories. To add one, put an object in `stories` in `src/content/stories.json`:

```json
{
  "id": "unique-id",
  "title": "Short headline",
  "body": "Two to five sentences about what happened.",
  "value": "together",
  "type": "people",
  "office": "Leeds",
  "author": { "name": "First Last", "role": "Role" },
  "date": "2026-10-07"
}
```

`value` is `together`, `open` or `proactive`. `type` is `client`, `people`, `win` or `shout-out`. `office` is `Leeds`, `Manchester`, `London`, `New York` or `Remote`. Use `"author": null` for anonymous. `image` is optional (`{ "src": "/images/…", "alt": "…" }`). Featured stories (`"featured": true`) go first, then newest first.

### Narration (parked for launch)

The Evolution narration and its player were taken out for launch. Everything is in git history (commit `8d7bf77` has `src/components/ui/SectionAudio.tsx`, `src/content/audio.ts` and `public/audio/evolution.mp3`), and `scripts/build_audio.py` still mixes a reading over an original synthesised backing track (`pip install numpy scipy soundfile lameenc`) when it comes back.

### Adding or changing images

Images are built from the supplied files, the "new assets" folder and the layered print PDF by `scripts/build_assets.py` (needs `pip install pymupdf pillow numpy scipy`; reads from the folder above this project). `--new-only` rebuilds just the new-assets art. See `ASSET_MAP.md` for where every image comes from. After replacing an image, delete `.next/dev/cache/images` (dev server) and `.next/cache/images` (production build), or the old optimised copy keeps being served.

## Decisions made

- **Fonts:** Söhne Breit Fett was supplied, so it's used for all headings (self-hosted with `next/font/local`). It's a licensed Klim font: check the licence covers web use before this goes live. Manrope (Google Fonts) is the body face. Print uses Manrope ExtraLight; the site uses regular weights for on-screen legibility.
- **Layers from the PDF:** the supplied PNGs have padding and no position data, but the PDF keeps every spread as photo + lettering + people cut-out. Using those layers at their PDF coordinates is what lets people stand in front of the lettering with parallax. Nothing was redrawn.
- **Proactive opener fix (print p24):** the photo is extended with the wall colour (left on desktop, above on mobile) so the "PROACTIVE / MAKE IT HAPPEN" lettering has clear space, with the presenter cut-out still in front. The lettering dashes in, crackles with sparks and fidgets every few seconds: restless energy.
- **"High Standards. High Care.":** a hot air balloon carried by two balloons, High Standards and High Care, with Journey Further in the basket. Fire one burner and it tips and rocks but won't lift; fire both and it climbs while the photos and clouds drop away. The message is the mechanic: we never let one slip to focus on the other.
- **NEVER SETTLE** is a brand sign-off, so it appears only in the footer, not beside the values in How We Succeed.
- **Light switch:** the Proactive section starts dark with only the switch lit, and a clear "Go on, flip the switch" prompt. Flipping it floods the light out from the switch and reveals the content: nothing happens unless you make it happen. The content is always in the page for screen readers and keyboard users.
- **Hints:** every interactive feature gets a small "tap" pill a couple of seconds after it scrolls into view, which disappears once it's been tried.
- **Values summary (print p7):** set plainly as styled type: Together, Open, Proactive.
- **Colour:** section fields are sampled from the PDF; UI accents come from the 2026 brand palette. Where white text on the print's sage failed AA contrast, the site uses charcoal text on sage instead.
- **Sunburst (p2)** is a CSS gradient so it can turn slowly; everything else visual is the supplied art.
- **No invented facts:** timeline years and notes, the counters and the founding date (16 January 2017, for the live "days young" counter) all come from Journey Further. The pub get-together was 2016 and the Origin Story copy carries no date (Neil's call). There are no made-up stories, wins or tallies on the site; the office-clock taglines are light-hearted guesses and read as such.
- **Reduced motion:** with `prefers-reduced-motion`, nothing pins, slides or scrolls smoothly. Content fades in and every interaction still works.

## Missing assets

Details in `ASSET_MAP.md`. In short:

- No separate team photography was supplied, so photos are extracted from the PDF. Higher-resolution originals would sharpen the large openers.
- No plain versions of the three value graphics (set as type, as briefed).
- Tick and cross icons are simple SVGs rather than supplied artwork.

## How this would work for real

**Content.** The Code's copy rarely changes, so it can stay in the repo or move into a headless CMS (Sanity, Contentful or Payload) so the People team can edit it without a developer. Stories move into a small database (Postgres via Vercel or Supabase) behind a simple API. Nothing in the components needs to change, because they already read from typed content files.

**Submissions.** People share stories from the site form, and also from where they already are: a Slack shortcut ("Share a value in action") posting to the same API, and optionally a monthly prompt in the all-hands channel. Photos go to object storage with an alt-text field. Every submission starts as pending.

**Moderation.** The People team gets a review queue (the prototype's moderation mode, made real): approve, feature, edit lightly or decline, with a Slack notification when something new arrives and a note back to the author when it goes live. Featured stories lead the wall and can feed internal comms. A later version could pull recognition from Motivosity into "Live from the team" strips on each value.

**Access.** Sign-in through Journey Further SSO (the same single sign-on as the internal apps), so names and roles fill in automatically, and anonymous posting stays a genuine choice. The Code itself can stay public as a recruitment asset, while the story wall shows only to signed-in staff until the People team chooses to share stories more widely.

## Verification

- `npm run build`: clean, no type or lint errors.
- Playwright screenshots at 1440px and 390px (with and without reduced motion), reviewed and fixed.
- End-to-end flow tested: story validation, submit, instant "Pending review", refresh persistence, admin approve and feature (persisted), reset; value card flip, the flags, the boot stomp, the light switch, the Value in Action flip.
- Lighthouse (desktop): Performance 96, Accessibility 100, Best Practices 100, SEO 100. LCP 1.2s, CLS 0.
- Lighthouse (mobile, simulated slow 4G and 4x CPU slowdown): Accessibility, Best Practices and SEO 100, CLS 0, but Performance only about 55 (LCP about 6s). The page is one long, fully interactive scroll, so hydrating it all is expensive on a throttled CPU. For production, the next step is to hydrate sections below the fold only when they come near the viewport, and to split the story wall into its own route chunk.
- Copy check: none of the banned strings from the brief appear anywhere in the codebase.
