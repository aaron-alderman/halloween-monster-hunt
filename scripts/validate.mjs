import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const required = ["index.html", "styles.css", "app.js", "FOR_AGENTS.md", "CONTRIBUTING.md", "data/hunt-map.json", ".github/workflows/pages.yml"];
for (const path of required) {
  if (!existsSync(resolve(root, path))) throw new Error(`missing ${path}`);
}

const data = JSON.parse(readFileSync(resolve(root, "data/hunt-map.json"), "utf8"));
if (data.schema !== "halloween-monster-hunt/map-v1") throw new Error("unexpected map schema");
if (data.topics.length < 50) throw new Error(`topic map too small: ${data.topics.length}`);
if (data.trophies.length < 8) throw new Error("trophy room lost scoped no-go records");
if (data.bounties.length !== 8) throw new Error("expected eight campaign bounties");
for (const topic of data.topics) {
  for (const key of ["id", "label", "status", "question", "nextAction", "killTest"]) {
    if (!topic[key]) throw new Error(`${topic.id || "unknown topic"} missing ${key}`);
  }
}

const html = readFileSync(resolve(root, "index.html"), "utf8");
for (const marker of ["Halloween Monster Hunt", "id=\"map\"", "id=\"trophies\"", "id=\"agents\"", "FOR_AGENTS.md", "data/hunt-map.json"]) {
  if (!html.includes(marker)) throw new Error(`index missing ${marker}`);
}

const agent = readFileSync(resolve(root, "FOR_AGENTS.md"), "utf8");
for (const marker of ["Non-negotiable authority boundary", "Required return packet", "Complete trail index", data.source.revision]) {
  if (!agent.includes(marker)) throw new Error(`agent field file missing ${marker}`);
}

console.log(`validated ${data.topics.length} trails, ${data.trophies.length} trophies and ${data.bounties.length} bounties`);
