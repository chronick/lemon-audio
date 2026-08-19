# normalled

A provenance-carrying dataset of Eurorack **normalization** behavior: what a
module internally connects when nothing is patched, what breaks that internal
connection, and what voltage sits behind each unpatched jack.

Normalization is the part of a module that no panel graphic shows and that a
language model most reliably invents. Every claim here is therefore an
addressable fact tied to a page of the manufacturer's own PDF. Nothing here is
published or deployed; the app produces `modules.json`.

## Layout

| Path | What it is |
| ---- | ---------- |
| `schema/normalled.schema.json` | JSON Schema (draft 2020-12), `$id` + `version` |
| `records/<slug>.json` | One pretty-printed record per module — the human-audited source of truth |
| `modules.json` | Generated, minified projection of `records/` (do not hand-edit) |
| `scripts/generate.mjs` | `records/*.json` → `modules.json` |
| `scripts/validate.mjs` | Schema + provenance rules over records and the projection |
| `scripts/check-verbatim.mjs` | Fails if any fact string exceeds 200 characters |
| `scripts/lib.mjs` | Shared helpers: JSON loading, library discovery, the validator |

## Running it

Node 18+ (v22 used here). Zero dependencies — Node stdlib only, no install step.
```bash
cd apps/normalled
node scripts/generate.mjs        # rebuild modules.json from records/
node scripts/validate.mjs        # schema + provenance gate (exit 1 on error)
node scripts/check-verbatim.mjs  # verbatim guard (exit 1 on error)
```

`validate.mjs` also confirms that every cited `manual.pdf` exists and really is
a PDF. That needs the sibling `patch-library` checkout, discovered in order:

1. `$NORMALLED_PATCH_LIBRARY`
2. `../patch-library` relative to the repo root
3. `../../patch-library` relative to the repo root

If none is found the PDF existence checks are skipped with a printed note and
everything else still runs. Never point this at `~/.patch-library` — that is a
local `PATCH_LIBRARY_HOME` data dir, not the checkout, and it does not exist in
cloud sessions.

## The provenance rules

These are the reason the dataset exists, and `validate.mjs` enforces all of them.

- **A fact cites a page of the manufacturer PDF.** `source.type: pdf_page`,
  `ref` ending in `#page=<n>`, pointing at that module's own `manual.pdf`, with
  `n` within the PDF's page count. Page numbers are 1-based PDF page order (the
  number a reader's page control shows), which may differ from a printed footer.
- **`manual.md` is never a source.** In `patch-library`, each `modules/<slug>/`
  holds `manual.pdf` (the manufacturer's manual) *and* `manual.md` (a
  **model-derived summary**). `manual.md` is fine for *locating* a candidate
  fact; citing it would launder unverified model output into a dataset whose
  whole value is that it is not that. The validator rejects any source
  mentioning `manual.md`.
- **Nothing comes from model memory.** If a claim cannot be found in the PDF it
  is either dropped or recorded as `confidence: low` + `source.type: derived`,
  with `ref` naming what it was derived from.
- **`derived` facts are excluded from `modules.json` v1.** They stay in
  `records/` as an audit trail; `generate.mjs` drops any fact with
  `source.type: derived` or `confidence: low` from the projection.
- **Facts paraphrase; they never quote at length.** `check-verbatim.mjs` caps
  every `value`/`description` string at 200 characters.

### Confidence rubric

| Level | Meaning |
| ----- | ------- |
| `high` | Stated explicitly in the manufacturer PDF |
| `medium` | Inferred from a spec table, panel table, or two explicit statements in the PDF |
| `low` | Derived from secondary text or arithmetic the PDF does not confirm — excluded from `modules.json` |

## Schema

Root of `schema/normalled.schema.json` is one **record**; `$defs.collection`
describes the `modules.json` envelope (`schema_version`, `generator`,
`excludes`, `modules[]`, each element a record).

```jsonc
{
  "schema_version": "1.0.0",
  "module": { "slug", "name", "manufacturer", "format", "hp", "depth_mm",
              "firmware_version", "power", "manual", "jacks[]", "controls[]" },
  "facts": [ { "id", "subject", "predicate", "value", "description",
               "source", "confidence" } ]
}
```

### Fact fields

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | string | `<module-slug>:<predicate-kebab>:<n>` — stable and addressable |
| `subject` | string | `<module-slug>` or `<module-slug>/<jack-or-control-id>`; must resolve to something the record declares |
| `predicate` | enum | `normalled_to`, `normalization_breaks_at`, `summed_into`, `default_level`, `control_range` |
| `value` | string \| object | A voltage, a path to another jack, or a small object of cases |
| `description` | string | One sentence of paraphrase, ≤200 chars |
| `source` | object | `{ type: pdf_page \| html_anchor \| vendor_url \| derived, ref, page? }` |
| `confidence` | enum | `high` \| `medium` \| `low` (rubric above) |

### Predicates

| Predicate | Reads as |
| --------- | -------- |
| `normalled_to` | subject jack carries *value* when nothing is patched into it |
| `normalization_breaks_at` | the subject's normalization is broken by *value* (usually inserting a cable) |
| `summed_into` | subject is internally bussed into *value* while unpatched |
| `default_level` | the voltage or range present at subject given the normals |
| `control_range` | what a knob/fader/switch sweeps over the normalled source |

### Mapping to patch-library `manual.md` frontmatter

The `module` object is a documented **superset** of the frontmatter fields in
`patch-library`'s `modules/<slug>/manual.md`, so a record can be produced for a
module that already exists there. (The frontmatter is used for shape only —
its *values* are still verified against the PDF before they land in a record.)

| patch-library frontmatter | normalled field | Notes |
| ------------------------- | --------------- | ----- |
| `name` | `module.name` | Same |
| `manufacturer` | `module.manufacturer` | Same |
| `format` | `module.format` | `3U` \| `1U`; absent frontmatter means `3U` there, explicit here |
| `hp` | `module.hp` | Same |
| `depth_mm` | `module.depth_mm` | Same |
| `firmware_version` | `module.firmware_version` | Same, nullable |
| `power.+12V` / `power.-12V` / `power.+5V` | `module.power.plus_12v_ma` / `minus_12v_ma` / `plus_5v_ma` | Renamed to JSON-safe keys; unit (mA) moved into the key |
| `io.inputs[]` | `module.jacks[]` with `direction: "in"` | Merged into one list; `id` is new (facts address it), `voltage` is not carried — voltages are facts, not fields |
| `io.outputs[]` | `module.jacks[]` with `direction: "out"` | Same merge |
| `io.controls[]` | `module.controls[]` | `id` is new; `type` constrained to an enum |
| `io.*[].type` | `jacks[].kind` | Renamed to avoid colliding with `controls[].type` |
| `io.*[].description` | — | Dropped: descriptive prose belongs in a fact with a citation |
| `source_url` | — | Not carried; `module.manual` points at the PDF that facts cite |
| `category`, `created`, `updated` | — | Not carried in v1 |
| — | `module.manual` | New: `{ path, pages }`, the PDF every `pdf_page` source must cite |
| — | `module.jacks[].id` / `controls[].id` | New: the address space fact subjects resolve against |
| — | `facts[]` | New: the entire point of the format |

## Module selection

Picked from the locked pool on two factors: **gnarly normalization** (there is
real hidden routing to record) and **low pretraining salience** (a model with no
context should not be able to answer from memory — a famous module like Maths or
Mother-32 would let a no-context eval arm score at ceiling).

### `duatt-1u` — Intellijel Duatt 1U

- **Gnarliness.** Both inputs are normalled to +5V DC, so an untouched channel
  is a DC source rather than silence; `OUT A` is bussed into `OUT B` and summed
  unless you patch it, so the module silently changes from a summing mixer into
  two independent attenuverters the moment a cable lands in `OUT A`. The `Ax2`
  switch multiplies the *normal* as well as a patched signal, so the internal
  source is +5V or +10V depending on a switch, and −10V through the attenuverter.
- **Salience.** A 1U utility. 1U is an Intellijel-case-specific format with a
  small install base and little written about it; utilities of this size are
  under-documented on the web relative to voices and filters.

### `channel-saver` — Make Noise Channel Saver (Ch.Svr)

- **Gnarliness.** Three channels with three *different* normals: +5V DC on
  Channel 1, +8V DC on Channel 2, and ground on Channel 3's A input. All three
  are normalled onto both a SUM and an Inverted SUM bus through their own output
  jacks, so patching a channel output subtracts that channel from both buses.
  The asymmetry between +5V and +8V is exactly the kind of detail that is
  guessed wrong.
- **Salience.** Recent and small (6HP), and it lives in the shadow of Maths —
  the manual literally introduces it as Maths' buddy. Discussion of it online is
  overwhelmingly *about Maths*, so the module's own specifics are thin in
  training data even though its parent is famous.

### `navigator` — Acid Rain Technology Navigator

- **Gnarliness.** Both inputs are normalled to 5V, and the attenuator output is
  mixed at unity gain into the attenuverter output unless it is patched — so one
  cable turns a single mixed offset generator into two separate utilities. The
  interesting facts are all about what happens with *nothing* patched.
- **Salience.** Small boutique manufacturer, 4HP utility, one-page manual. Close
  to a floor case for pretraining coverage while still having real normalization
  content to record.

v1 holds 25 facts — 23 in `modules.json`, 2 excluded as `derived`.

## Adding a module

1. Pick a module with a real `manual.pdf` in the `patch-library` checkout.
2. Read the PDF. `manual.md` may point you at where to look; it is not evidence.
3. Write `records/<slug>.json`, citing the PDF page each fact was read on.
4. `node scripts/generate.mjs && node scripts/validate.mjs && node scripts/check-verbatim.mjs`.
