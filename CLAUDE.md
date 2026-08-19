# CLAUDE.md

Guidance for AI agents working in the LEMON AUDIO monorepo. `README.md` is the
human-facing overview; this file is the per-app command surface.

## What this is

A monorepo of **independent apps**. There is no workspace root, no root
`package.json`, and no repo-wide build, lint, or test command. Every command
runs from inside an app directory. Adding a root-level toolchain is a decision,
not a convenience — don't do it as a side effect of another task.

## Apps

| App | Path | Stack | Dev | Build | Test |
| --- | ---- | ----- | --- | ----- | ---- |
| website | `apps/website` | Static HTML, no build step | open `apps/website/public/index.html` | none | none |
| drops | `apps/drops` | Vite + TypeScript, Web Audio | `npm install && npm run dev` (:5173) | `npm run build` (`tsc && vite build`) | none |
| flasher | `apps/flasher` | Vite + TypeScript, WebUSB | `npm install && npm run dev` | `npm run build` | `npm test` (vitest) |
| normalled | `apps/normalled` | Node stdlib scripts + JSON data, zero deps | n/a | `node scripts/generate.mjs` | `node scripts/validate.mjs`, `node scripts/check-verbatim.mjs` |

`apps/flasher` also has `npm run deploy`, which builds and copies `dist` into
`apps/website/public/flasher`. Both Vite apps have `npm run preview`.

## Deploy

- **Pages** (`.github/workflows/deploy.yml`): every push to `main` builds
  flasher, stages its `dist` into `apps/website/public/flasher`, and publishes
  `apps/website/public/` to GitHub Pages → `lemon.audio`.
- **Drops** (`.github/workflows/deploy-drops.yml`): pushes to `main` touching
  `apps/drops/**` build drops and push `dist` to `chronick/lemon-drops` →
  `drops.lemon.audio`.
- `apps/normalled` **is not deployed**. It produces a committed data file.

## apps/normalled

A provenance-carrying dataset of Eurorack normalization behavior. Facts are
addressable records that must cite a page of the manufacturer's `manual.pdf` in
the sibling `patch-library` checkout (discovered via `$NORMALLED_PATCH_LIBRARY`
or `../patch-library`). A `patch-library` `manual.md` is a model-derived summary
and is **never** a citable source; nothing is written from model memory.

Read `apps/normalled/README.md` before touching records or the schema — the
provenance rules there are the point of the dataset, and `scripts/validate.mjs`
enforces them.

## Conventions

- Tasks live in the vault's `.beads/` with label `repo:lemon-audio`. File
  deferred work as a beads task rather than leaving a TODO comment.
- Commit or push only when asked.
- Keep apps independent: no cross-app imports, no shared node_modules.
