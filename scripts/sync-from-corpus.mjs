import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, relative, sep } from "node:path";

const args = process.argv.slice(2);
const rootIndex = args.indexOf("--corpus-root");
if (rootIndex < 0 || !args[rootIndex + 1]) throw new Error("usage: node scripts/sync-from-corpus.mjs --corpus-root <path>");

const projectRoot = resolve(import.meta.dirname, "..");
const corpusRoot = resolve(args[rootIndex + 1]);
const registerPath = resolve(corpusRoot, "corpus/programmes/frontier-physics-targets/open_topics_register_v1.json");
const register = JSON.parse(readFileSync(registerPath, "utf8"));
const revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: corpusRoot, encoding: "utf8" }).trim();
const githubRoot = "https://github.com/aaron-alderman/spin23-relational-geometry";
const blobRoot = `${githubRoot}/blob/${revision}`;
const pageRoot = "https://aaron-alderman.github.io/spin23-relational-geometry/edition-3";

function urlFor(path) {
  return path ? `${blobRoot}/${path.split(sep).join("/")}` : null;
}

const topics = register.topics.map(topic => ({
  id: topic.id,
  label: topic.label,
  status: topic.status,
  priority: topic.priority,
  question: topic.question,
  nextAction: topic.nextAction,
  closure: topic.closure,
  killTest: topic.killTest,
  dependencies: topic.dependencies,
  targetIds: topic.targetIds,
  frontierAreaIds: topic.frontierAreaIds,
  detectorIds: topic.detectorIds,
  evidencePath: topic.closureEvidence || topic.progressEvidence || null,
  evidenceUrl: urlFor(topic.closureEvidence || topic.progressEvidence),
}));

const trophies = [
  {
    id: "E3-F04",
    title: "The central sign is not the missing orientation datum",
    finding: "The canonical projective lift returns the carrier frame by -I while preserving determinant orientation. Wilson-loop sign is therefore not automatically a Pfaffian-sheet flip.",
    reopen: "Supply an independently odd datum such as a reflection, oriented area or calibrated boundary orientation.",
  },
  {
    id: "E3-F06",
    title: "One S1 mediator cannot realize the desired pure Furey pulse",
    finding: "The common mediator that produces the two crossed operators also produces a third Wilson edge; one copy is rank-obstructed and common-orientation positive copies do not remove it.",
    reopen: "Derive a split-copy involution, source-incidence rule, boundary realization or physical role for the closed triangle.",
  },
  {
    id: "E3-F07",
    title: "Complete unified triplets are not automatically proton-safe",
    finding: "The desired leptoquark arms arrive with four-quark and proton-decay channels. B-L and matter parity do not isolate the safe subset.",
    reopen: "Provide a source-selecting Pati-Salam, finite-geometry or multi-mediator completion that survives anomaly and mixing tests.",
  },
  {
    id: "E3-F09",
    title: "The simplest continuous and binary protections fail",
    finding: "Family-universal anomaly-free U(1) charges cannot distinguish the safe mask; the universal internal Z2 is weak-anomalous for odd family count.",
    reopen: "Use a larger cyclic, flavor-dependent, non-Abelian, inflow or finite-geometry mechanism with a complete anomaly ledger.",
  },
  {
    id: "E3-F15",
    title: "Healthy bosonic poles do not settle the chiral fold",
    finding: "A stable bosonic completion can pass pole and positivity tests while leaving the fermionic chirality and anomaly problem untouched.",
    reopen: "Construct the chiral parent, its anomaly completion and a shared microscopic action rather than importing a bosonic response alone.",
  },
  {
    id: "E3-F17",
    title: "The minimal six-dimensional parent is anomalous",
    finding: "The canonical completion carries the desired index-three structure, but its minimal local 6D parent fails anomaly cancellation.",
    reopen: "Add a justified spectator or inflow sector without restoring unwanted massless mirrors or changing the claimed index mechanism.",
  },
  {
    id: "E3-F20",
    title: "The softened QWZ curve is not the stated Lindbladian response",
    finding: "The published quadrature can be reproduced phenomenologically, but the exact stationary response of the declared sigma-z Lindbladian vanishes.",
    reopen: "Derive a corrected open-system generator and compute its exact response, including the noncommuting limits and bath record.",
  },
  {
    id: "E3-F23",
    title: "The local gravity route lacks a closed quantum parent",
    finding: "One critical torsion sector can be healthy, but the known local construction does not supply a complete quantum parent, vacuum and spectrum.",
    reopen: "Provide a new parent theory with a controlled vacuum, spectrum, anomaly structure and low-energy matching.",
  },
].map(item => ({ ...item, url: `${pageRoot}/08-result-ledger.html#${item.id}` }));

const bounties = [
  "Extract explicit parity-resolved constants for a weakly coupled projected E8 chain—or prove the measured coupling lies outside the theorem's domain.",
  "Build a certified compressed-chain calculation beyond direct-product enumeration and compare it with the exact width-six plateau.",
  "Lift the projected local-root chain into the full multi-cell charge Hilbert space with controlled error.",
  "Derive a source-native rank-24 boundary candidate from three E8 units and calculate its weight-one spectrum.",
  "Design a blind E8^3 / Niemeier / Leech detector challenge using identical synthetic data and held-out observables.",
  "Give a minimal physical implementation of inversion gauging in which the twisted sector is forced rather than inserted.",
  "Identify one Monster-marked defect or sewing observable with a realistic readout and an explicit smaller-algebra null model.",
  "Improve this expedition surface: make filled, failed, conditional and unfilled nodes easier to reproduce and challenge.",
];

const statusCounts = topics.reduce((counts, topic) => ({ ...counts, [topic.status]: (counts[topic.status] || 0) + 1 }), {});
const generatedAt = new Date().toISOString();
const data = {
  schema: "halloween-monster-hunt/map-v1",
  generatedAt,
  season: { starts: "2026-10-26", ends: "2026-11-02", after: "archive" },
  source: {
    repository: githubRoot,
    revision,
    revisionUrl: `${githubRoot}/tree/${revision}`,
    registerPath: relative(corpusRoot, registerPath).split(sep).join("/"),
    openTopicsUrl: `${blobRoot}/corpus/programmes/frontier-physics-targets/open_topics_register_v1.json`,
    callToActionUrl: `${pageRoot}/articles/monster-distributed-search.html`,
  },
  statusCounts,
  topics,
  trophies,
  bounties,
};

mkdirSync(resolve(projectRoot, "data"), { recursive: true });
writeFileSync(resolve(projectRoot, "data/hunt-map.json"), `${JSON.stringify(data, null, 2)}\n`);

const priorityTopics = topics.filter(topic => topic.priority === "P0");
const topicLines = topics.map(topic => `- **${topic.id} · ${topic.label}** [${topic.status}/${topic.priority}] — ${topic.question}\n  - Next: ${topic.nextAction}\n  - Kill: ${topic.killTest}\n  - Evidence: ${topic.evidenceUrl || data.source.openTopicsUrl}`).join("\n");
const trophyLines = trophies.map(trophy => `- **${trophy.id} · ${trophy.title}** — ${trophy.finding} Reopen only by: ${trophy.reopen}`).join("\n");
const bountyLines = bounties.map((bounty, index) => `${index + 1}. ${bounty}`).join("\n");
const agentFile = `# Halloween Monster Hunt — field file for agents

**Campaign window:** 26 October–2 November 2026; durable archive afterward

**Canonical corpus:** ${githubRoot}

**Pinned corpus revision:** [\`${revision}\`](${data.source.revisionUrl})

**Machine map:** [\`data/hunt-map.json\`](data/hunt-map.json)
**Campaign site:** https://aaron-alderman.github.io/halloween-monster-hunt/

## Mission

Choose one bounded trail in the proposed path from local physical carriers through exceptional structure to Moonshine. Prove it, compute it, build it, reproduce it or kill it cleanly. Return a packet that another person or agent can continue without accepting the programme's larger interpretation.

The Monster is not to be searched by enumerating its roughly \(8\\times10^{53}\) elements. Search compressed structure: carriers, gaps, boundary algebras, rank-24 invariants, orbifold sectors, defects, composition laws and discriminating detector records.

## Non-negotiable authority boundary

- The canonical Spin(2,3) corpus controls scientific claims; this campaign repository is a revision-pinned expedition surface.
- Map membership means relevance, not evidence.
- A matching number, dimension, diagram or group name is not a physical bridge.
- Mathematical construction is not physical realization. Finite-size convergence is not a thermodynamic theorem. A programmed output is not a discovered symmetry.
- Status propagation follows explicit dependency edges only. A defeated claim puts direct dependants under review; it does not automatically make them false.
- Never broaden a scoped no-go into universal impossibility. Preserve assumptions and name the minimum reopening datum.

## Current board

There are **${topics.length} maintained trails** at the pinned revision: ${Object.entries(statusCounts).map(([status, count]) => `${count} ${status}`).join(", ")}.

The P0 board contains **${priorityTopics.length} trails**. Use \`data/hunt-map.json\` for complete fields and source URLs.

## Agent operating procedure

1. **Select one trail.** Prefer a P0/P1 item whose prerequisites and inputs are actually available. State its ID.
2. **Load controlling evidence.** Read the topic record, evidence file, dependencies and nearest terminal-neighbourhood reviews. Do not rely on the campaign summary alone.
3. **Freeze the claim.** Write one sentence describing exactly what success would establish and one sentence describing what it would not establish.
4. **Declare rivals first.** Name the closest conventional, smaller-algebra, nuisance or lookup-table explanation before inspecting the result.
5. **Choose one certificate.** Use a proof, executable verifier, preregistered statistic or reproducible construction. State numerical tolerances and approximation boundaries.
6. **Run the kill test.** A positive-looking output that has not faced the declared kill test remains exploratory.
7. **Return a packet.** Include the ten fields below, source hashes or revision, code/data, logs and the next exposed interface.
8. **Stop honestly.** If external data, hardware, compute, expertise or authorization is absent, mark the exact gate. Do not fill it with analogy.

## Required return packet

1. **Object** — Hamiltonian, algebra, material, detector, theorem or claim.
2. **Input authority** — sources, conventions, normalization and pinned revisions.
3. **Prerequisites** — upstream nodes assumed rather than proved.
4. **Claim** — one falsifiable sentence.
5. **Certificate** — proof, verifier or preregistered statistic.
6. **Convergence axes** — size, truncation, disorder, resolution, temperature and order of limits where relevant.
7. **Negative controls** — nearest conventional or smaller explanations.
8. **Kill test** — observation that closes this bridge.
9. **Claim boundary** — what the result does not establish.
10. **Next interface** — datum another hunter can consume.

Suggested directory:

~~~text
packets/<topic-id>-<short-name>/
  README.md
  packet.json
  src/
  data/
  results/
  verify/
~~~

## Immediate bounties

${bountyLines}

## Scoped no-go trophies

${trophyLines}

## Complete trail index

${topicLines}

## Final response contract

Conclude with exactly one disposition:

- \`closed-positive\` — the declared closure condition is met;
- \`closed-negative\` — the scoped kill test fired;
- \`advanced\` — a named gate was crossed but the topic remains live;
- \`split\` — the topic separated into sharper child questions;
- \`unchanged\` — no evidential movement;
- \`blocked\` — a named external input is required.

Then report: **claim, certificate, boundary, evidence paths, next interface**.
`;

writeFileSync(resolve(projectRoot, "FOR_AGENTS.md"), agentFile);
console.log(JSON.stringify({ revision, topics: topics.length, statusCounts, output: "data/hunt-map.json", agentFile: "FOR_AGENTS.md" }, null, 2));
