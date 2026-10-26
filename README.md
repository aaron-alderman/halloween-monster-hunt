# Halloween Monster Hunt

_Pick a trail. Prove it, compute it, build it, reproduce it—or kill it cleanly._

This repository is a time-boxed public expedition surface over the canonical [Admissibility Frontier](https://github.com/aaron-alderman/spin23-relational-geometry) corpus. It turns the distributed Monster/Moonshine search into a searchable map of active, open, gated, audited, closed and blocked trails.

The seasonal presentation runs from **26 October through 2 November 2026** and then switches to archive mode. The map and contribution packets remain useful afterward.

## Enter

- **Campaign site:** https://aaron-alderman.github.io/halloween-monster-hunt/
- **Agent field file:** [FOR_AGENTS.md](FOR_AGENTS.md)
- **Machine-readable map:** [data/hunt-map.json](data/hunt-map.json)
- **Contribution guide:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Controlling scientific corpus:** https://github.com/aaron-alderman/spin23-relational-geometry

## Authority boundary

This repository is a revision-pinned navigation and contribution layer. The upstream corpus controls scientific claims. Map membership is not evidence; a closed route is scoped to its assumptions; and a matching number or diagram is not a physical bridge.

## Refresh from a local corpus checkout

~~~powershell
node scripts/sync-from-corpus.mjs --corpus-root C:\path\to\spin23-relational-geometry
node scripts/validate.mjs
~~~

The refresh records the exact upstream Git revision in both the JSON map and the agent field file.

## Local preview

Serve the repository root with any static server, for example:

~~~powershell
node scripts/serve.mjs
~~~

Then open `http://127.0.0.1:4179/`.

## License

Research content and documentation follow the upstream corpus under CC BY-SA 4.0. Software is GPL-3.0-or-later. See [LICENSE.md](LICENSE.md).
