// End-to-end check of the interactive features: the share pop-up, value card flip, the balloon, stomp again, light switch, VIA toggle.
// Usage: node scripts/qa/story-flow.mjs [url]   (server must be running; default http://localhost:3000)
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const check = (label, ok) => console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);

await page.goto(base + "/", { waitUntil: "networkidle" });

// Share a story: a pop-up pointing to the People team's inbox (the story wall is parked for launch)
check("no Share button in the nav", (await page.getByRole("banner").getByRole("button", { name: "Share a story" }).count()) === 0);
await page.locator("#shape-the-code").getByRole("button", { name: "Share a story" }).click();
const dialog = page.getByRole("dialog", { name: "Share a story" });
check("share pop-up opens", await dialog.isVisible());
check("share pop-up has the Code's wording", await dialog.getByText("to live our values").isVisible());
await dialog.getByRole("button", { name: "Copy email address" }).click();
check("copies the People team's email", (await page.evaluate(() => navigator.clipboard.readText())) === "people@journeyfurther.com");
await page.keyboard.press("Escape");
check("share pop-up closes", !(await dialog.isVisible()));
check("no story wall", (await page.locator("#values-in-the-wild").count()) === 0);

// Leeds 2017 throwback
const throwback = page.getByRole("button", { name: "A throwback from Leeds, 2017" });
await throwback.scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await throwback.click({ force: true });
await page.waitForTimeout(900);
check("throwback Polaroid pops out", await page.getByRole("dialog", { name: "Throwback: Leeds, 2017" }).isVisible());
await page.keyboard.press("Escape");
await page.waitForTimeout(800);

// Our Values cards flip
const flip = page.getByRole("button", { name: "Flip Together for more" });
await flip.scrollIntoViewIfNeeded();
await flip.click();
check("value card flips", (await page.getByRole("button", { name: "Flip Together back" }).getAttribute("aria-pressed")) === "true");

// The balloon only flies with both burners
await page.locator("[data-sky]").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.getByRole("button", { name: "Fire the High Standards burner" }).click({ force: true });
await page.waitForTimeout(800);
check("one burner tips it", await page.getByText("No soaring yet. We'll wobble if we focus only on standards and not care!").isVisible());
await page.getByRole("button", { name: "Fire the High Care burner" }).click({ force: true });
await page.waitForTimeout(800);
check("both burners and it soars", await page.getByText("Now we're soaring!").isVisible());

// Stomp again
const boot = page.getByRole("button", { name: "Stomp again" });
await boot.scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
await boot.click({ force: true });
await page.waitForTimeout(1200);
check("boot stomps and the words crack", (await page.locator("[data-cracked]").evaluate((el) => getComputedStyle(el).opacity)) === "1");

// Light switch and VIA flip
const lightSwitch = page.getByRole("button", { name: /Flip the switch/ });
await lightSwitch.scrollIntoViewIfNeeded();
await lightSwitch.click();
await page.waitForTimeout(800);
check("light switch", (await page.getByRole("button", { name: /Switch the lights off/ }).getAttribute("aria-pressed")) === "true");
const dont = page.locator("#proactive").getByRole("tab", { name: "Please don't do this" });
await dont.scrollIntoViewIfNeeded();
await dont.click();
check("VIA flips", (await dont.getAttribute("aria-selected")) === "true");

check("no console errors", errors.length === 0);
if (errors.length) console.log(errors);
await browser.close();
