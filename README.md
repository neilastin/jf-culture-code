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

- **Share a story** (top right, or Part 6). Submit one and it lands on the wall straight away with a "Pending review" tag and a "Just in" highlight. Refresh: it's still there.
- **Moderation mode:** add `?admin=1` to the URL, or use the "Moderation demo" toggle in the footer. Approve, feature or remove any story; "Simulate a new story" makes one arrive live; "Reset demo" clears everything stored on the device.
- New example stories also arrive on their own a few seconds after the wall scrolls into view.
- Flip the **light switch** in Proactive. Toggle **Value in action / Please don't do this** on each value.
- Everything is stored in this browser's `localStorage` only.
- **Narration:** press play beside "The Evolution" to hear it read aloud over a backing track. Pause, or restart from the beginning.
- **Easter eggs:** type "never settle" anywhere (or the Konami code), click the founders' painting, click either side of the High Standards see-saw, let the values float away in "Why we are obsessive" and click them back down, or flip the light switch six times fast.
- **Experimental ideas** (footer button, or `/experimental`): a values quiz, a gravity playground, "Sign the Code", live office clocks, and ideas that need new content. Kept on a separate page so the main Code stays focused.

### Checking changes

With the site running (`npm run dev`), from this folder:

- `node scripts/qa/copy-check.mjs`: the brief's banned-strings check
- `node scripts/qa/story-flow.mjs`: end-to-end check of sharing, moderation, the light switch, the Value in Action flip and narration
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
| `site.ts` | Navigation, labels, microcopy, timeline stops, counters, benefits |
| `stories.json` | Story wall seed: the six real Value in Action examples, the example stories, and the "incoming" examples used to demo live arrivals |
| `wins.json` | Latest wins ticker (examples) |
| `people.json` | People spotlight cards (examples) |
| `media.ts` | Generated list of every image with its size. Don't edit by hand |
| `feeds.ts` | Loads and checks the JSON files, so a typo in a value or office fails the build loudly |

### Adding a story

Add an object to `stories` in `src/content/stories.json`:

```json
{
  "id": "unique-id",
  "title": "Short headline",
  "body": "Two to five sentences about what happened.",
  "value": "together",
  "type": "people",
  "office": "Leeds",
  "author": { "name": "First Last", "role": "Role" },
  "date": "2026-10-07",
  "source": "submitted",
  "status": "published"
}
```

`value` is `together`, `open` or `proactive`. `type` is `client`, `people`, `win` or `shout-out`. `office` is `Leeds`, `Manchester`, `London`, `New York` or `Remote`. Use `"author": null` for anonymous. `source` drives the honesty labels: `culture-code` shows "From the Culture Code", `example` shows "Example".

### Adding narration to a section

1. Put the recording (MP3, 44.1 kHz) in the folder above this project and add it to `NARRATIONS` in `scripts/build_audio.py`.
2. Run `python scripts/build_audio.py` (needs `pip install numpy scipy soundfile lameenc`). It evens out the voice, puts an original backing track underneath and writes `public/audio/<name>.mp3`.
3. Add the file to `src/content/audio.ts` and place `<SectionAudio narration="…" />` beside the section heading.

The backing track is composed and synthesised by the script itself (an upbeat 112 BPM loop of drums, bass, plucked chords and bells), so it's original to this project with no licence or attribution needed. Levels: speech at about −17 dBFS; music about 10 dB under the voice while someone is talking (with a slight extra dip on words), and fuller for the two-bar intro and outro. Only one narration plays at a time.

### Adding or changing images

Images are built from the supplied files and the layered print PDF by `scripts/build_assets.py` (needs `pip install pymupdf pillow numpy scipy`; reads from the folder above this project). See `ASSET_MAP.md` for where every image comes from.

## Decisions made

- **Fonts:** Söhne Breit Fett was supplied, so it's used for all headings (self-hosted with `next/font/local`). It's a licensed Klim font: check the licence covers web use before this goes live. Manrope (Google Fonts) is the body face. Print uses Manrope ExtraLight; the site uses regular weights for on-screen legibility.
- **Layers from the PDF:** the supplied PNGs have padding and no position data, but the PDF keeps every spread as photo + lettering + people cut-out. Using those layers at their PDF coordinates is what lets people stand in front of the lettering with parallax. Nothing was redrawn.
- **Proactive opener fix (print p24):** the photo is extended with the wall colour (left on desktop, above on mobile) so the full "PROOOO…ACTIVE / MAKE IT HAPPEN" lettering sits in clear space, with the presenter cut-out still in front.
- **"High Standards. High Care.":** no corrected lettering was supplied, so the opener uses the print's own "HIGH" lettering twice, on a see-saw, with "Standards." and "Care." set in Söhne Breit styled to match. The "& Care" graphic isn't used. The presenter is the pivot, and the beam always springs back to level.
- **Values summary (print p7):** set plainly as styled type: Together, Open, Proactive.
- **Colour:** section fields are sampled from the PDF; UI accents come from the 2026 brand palette. Where white text on the print's sage failed AA contrast, the site uses charcoal text on sage instead.
- **Sunburst (p2)** is a CSS gradient so it can turn slowly; everything else visual is the supplied art.
- **No invented facts:** timeline years and notes, the counters and the founding date (16 January 2017, for the live "days young" counter) all come from Journey Further. Every example story, win, spotlight and the pulse tally is marked "Example" and uses placeholder names in [brackets].
- **Reduced motion:** with `prefers-reduced-motion`, nothing pins, slides or scrolls smoothly. Content fades in and every interaction still works.

## Missing assets

Details in `ASSET_MAP.md`. In short:

- No separate team photography was supplied, so photos are extracted from the PDF. Higher-resolution originals would sharpen the large openers.
- No corrected "High Standards. High Care." lettering (see above).
- No plain versions of the three value graphics (set as type, as briefed).
- Tick and cross icons are simple SVGs rather than supplied artwork.

## How this would work for real

**Content.** The Code's copy rarely changes, so it can stay in the repo or move into a headless CMS (Sanity, Contentful or Payload) so the People team can edit it without a developer. Stories, wins and spotlights move into a small database (Postgres via Vercel or Supabase) behind a simple API. Nothing in the components needs to change, because they already read from typed content files.

**Submissions.** People share stories from the site form, and also from where they already are: a Slack shortcut ("Share a value in action") posting to the same API, and optionally a monthly prompt in the all-hands channel. Photos go to object storage with an alt-text field. Every submission starts as pending.

**Moderation.** The People team gets a review queue (the prototype's moderation mode, made real): approve, feature, edit lightly or decline, with a Slack notification when something new arrives and a note back to the author when it goes live. Featured stories feed the homepage, the "Live from the team" strips and internal comms.

**Access.** Sign-in through Journey Further SSO (the same single sign-on as the internal apps), so names and roles fill in automatically, anonymous posting stays a genuine choice, and reactions count once per person. The Code itself can stay public as a recruitment asset, while the story wall shows only to signed-in staff until the People team chooses to share stories more widely.

## Verification

- `npm run build`: clean, no type or lint errors.
- Playwright screenshots at 1440px and 390px (with and without reduced motion), reviewed and fixed.
- End-to-end story flow tested: validation, submit, instant "Pending review", refresh persistence, reactions, filters and search, admin approve and feature (persisted), simulated arrival.
- Lighthouse (desktop): Performance 96, Accessibility 100, Best Practices 100, SEO 100. LCP 1.2s, CLS 0.
- Lighthouse (mobile, simulated slow 4G and 4x CPU slowdown): Accessibility, Best Practices and SEO 100, CLS 0, but Performance only about 55 (LCP about 6s). The page is one long, fully interactive scroll, so hydrating it all is expensive on a throttled CPU. For production, the next step is to hydrate sections below the fold only when they come near the viewport, and to split the story wall into its own route chunk.
- Copy check: none of the banned strings from the brief appear anywhere in the codebase.
