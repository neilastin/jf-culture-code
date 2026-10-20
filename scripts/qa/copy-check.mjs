// The brief's copy check: none of these strings may appear anywhere in the project.
// This file is the only place they're allowed (it skips itself).
// Usage: node scripts/qa/copy-check.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BANNED = [
  "maximize",
  "optimize",
  "candor",
  "defense",
  "fake news",
  "big network agency",
  "get in a room",
  "team culture",
  "180 people",
  "High Standards & Care",
  "Bringing the right thought and care is our commitment",
  "lorem",
  "hilitas",
  "unnecessary.We",
  "asked.We",
  "events.These",
];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "qa-out", "public"]);
const self = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(self), "../..");

const hits = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full);
    } else if (full !== self && /\.(tsx?|mjs|js|json|md|css|py|html)$/.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8").toLowerCase();
      for (const s of BANNED) if (text.includes(s.toLowerCase())) hits.push(`${path.relative(root, full)}: "${s}"`);
    }
  }
};
walk(root);
console.log(hits.length ? `FAIL\n${hits.join("\n")}` : `PASS  none of the ${BANNED.length} banned strings appear`);
process.exit(hits.length ? 1 : 0);
