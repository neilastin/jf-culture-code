// Screenshots the whole page, one viewport at a time, for visual review.
// Usage: node scripts/qa/screenshots.mjs [width] [height] [outdir] [reduce] [url]
//   e.g. node scripts/qa/screenshots.mjs 1440 900 qa-out/desktop
//        node scripts/qa/screenshots.mjs 390 844 qa-out/mobile
//        node scripts/qa/screenshots.mjs 1440 900 qa-out/reduced reduce
// Needs a running server (default http://localhost:3000) and `npx playwright install chromium` once.
import fs from "node:fs";
import { chromium } from "playwright";

const [w = "1440", h = "900", out = "qa-out/desktop", reduce, url = "http://localhost:3000/"] = process.argv.slice(2);
const width = Number(w);
const height = Number(h);
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await (
  await browser.newContext({
    viewport: { width, height },
    reducedMotion: reduce === "reduce" ? "reduce" : "no-preference",
    isMobile: width < 600,
    hasTouch: width < 600,
  })
).newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
console.log("viewport", await page.evaluate(() => ({ innerWidth, scrollWidth: document.documentElement.scrollWidth })));

let y = 0;
let i = 0;
for (;;) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1300); // let scroll-triggered animations land
  await page.screenshot({ path: `${out}/s${String(i++).padStart(3, "0")}.png` });
  y += Math.round(height * 0.9);
  if (y >= (await page.evaluate(() => document.documentElement.scrollHeight))) break;
}
console.log(JSON.stringify({ shots: i, errors: [...new Set(errors)] }, null, 1));
await browser.close();
