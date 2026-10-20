// End-to-end check of the living features: share a story, refresh persistence,
// reactions, filters, moderation, simulated arrivals, light switch, VIA toggle, narration.
// Usage: node scripts/qa/story-flow.mjs [url]   (server must be running; default http://localhost:3000)
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const check = (label, ok) => console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
const wallCard = (title) => page.locator("#values-in-the-wild article", { hasText: title }).first();

await page.goto(base + "/", { waitUntil: "networkidle" });

// Share a story
await page.getByRole("banner").getByRole("button", { name: "Share a story" }).click();
const dialog = page.getByRole("dialog");
await dialog.getByRole("button", { name: "Share a story" }).click();
check("validation messages", await dialog.getByText("Pick the value you saw.").isVisible());
await dialog.getByText("Proactive", { exact: true }).click();
await dialog.getByLabel("What happened?").fill("QA test story: spotted a broken tag on Friday and fixed it before launch.");
await dialog.getByLabel(/Give it a headline/).fill("QA test story");
await dialog.getByLabel("Office", { exact: true }).selectOption("Leeds");
await dialog.getByRole("button", { name: "Share a story" }).click();
await dialog.getByText("Thanks! Your story's with the People team.").waitFor();
await dialog.getByRole("button", { name: "See it on the wall" }).click();
await page.waitForTimeout(2000);
check("story on wall, pending, just in", (await wallCard("QA test story").getByText("Pending review").isVisible()) && (await wallCard("QA test story").getByText("Just in").isVisible()));

// Persistence and reactions
await page.reload({ waitUntil: "networkidle" });
check("survives refresh", (await wallCard("QA test story").count()) > 0);
await wallCard("QA test story").getByRole("button", { name: "QA test story" }).click();
const modal = page.getByRole("dialog", { name: "QA test story" });
await modal.getByRole("button", { name: /Love this/ }).click();
check("reaction toggles", (await modal.getByRole("button", { name: /Love this: 1/ }).getAttribute("aria-pressed")) === "true");
await page.keyboard.press("Escape");

// Filters
await page.getByLabel("Search stories").fill("onboarding");
await page.waitForTimeout(600);
check("search filters", (await page.locator("#values-in-the-wild article").count()) === 1);
await page.getByRole("button", { name: "Clear filters" }).click();

// Moderation
await page.goto(base + "/?admin=1", { waitUntil: "networkidle" });
const bar = page.getByRole("complementary", { name: "Moderation demo" });
await wallCard("QA test story").getByRole("button", { name: "Approve" }).click();
await wallCard("QA test story").getByRole("button", { name: "Feature" }).click();
await page.reload({ waitUntil: "networkidle" });
check("approve + feature persist", (await wallCard("QA test story").getByText("Featured").count()) === 1);
await bar.getByRole("button", { name: "Simulate a new story" }).click();
await page.waitForTimeout(600);
check("simulated arrival", (await page.locator("article", { hasText: "Hackathon to handover" }).count()) > 0);

// Light switch, VIA flip, narration
await page.getByRole("button", { name: /Flip the switch/ }).click();
check("light switch", (await page.getByRole("button", { name: /Switch off/ }).getAttribute("aria-pressed")) === "true");
const dont = page.locator("#proactive").getByRole("tab", { name: "Please don't do this" });
await dont.scrollIntoViewIfNeeded();
await dont.click();
check("VIA flips", (await dont.getAttribute("aria-selected")) === "true");
const play = page.getByRole("button", { name: /Play the narration of The Evolution/ });
await play.scrollIntoViewIfNeeded();
await play.click();
await page.waitForTimeout(1500);
check("narration plays", await page.evaluate(() => !document.querySelector('audio[src="/audio/evolution.mp3"]').paused));

// Clean up the demo data this run created
await bar.getByRole("button", { name: "Reset demo" }).click();
await bar.getByRole("button", { name: "Exit" }).click();
check("no console errors", errors.length === 0);
if (errors.length) console.log(errors);
await browser.close();
