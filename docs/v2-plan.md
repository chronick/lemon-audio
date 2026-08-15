# lemon.audio v2 — Play, Make, Flash

Plan document for `vault-2htws`. Produced 2026-08-15 against the state of
`chronick/lemon-audio` at `19d41c5`, `chronick/smpl`, and
`chronick/lemon-agent`. Nothing here is implemented; this is the plan the
implementation children get filed against.

## 1. What this plan is for

lemon.audio is the standalone, weirder half of a deliberate twin. The house
vision (`vault/lemon/vision.md`) records the split verbatim:

> "lemon.audio gets its own site with audio toys, smple-based command-line
> DAW, other audio tools, but lemon-agent.dev/audio applies lemon-agent
> principles to audio (also using smpl), basically these overlap but are
> distinct: lemon.audio gets a bit 'weirder' but leomon.dev/audio gets a nod
> in that direction but still under the lemon-agent brand"

Same substrate, two registers. lemon.audio is the **experimental product and
toy surface** — neon, mascot-led, first-person-plural weird. lemon-agent.dev
is the disciplined field guide. This plan keeps that separation load-bearing
rather than decorative, and it refuses to describe anything as more finished
than it is.

The homepage today is a one-screen teaser: ASCII Lemon-Chan, ASCII wordmark,
one nav link (`/flasher/`), one credit line. It routes nobody to the toys.
That is the problem v2 solves.

## 2. Inventory — what is actually live

Status vocabulary, used consistently in this document and in the site copy
it specifies:

| Status | Means |
| --- | --- |
| **live** | Deployed at a public URL, works for a stranger with no setup beyond a browser. |
| **usable** | Works today, but needs install/hardware/CLI knowledge. Real, not a demo. |
| **experimental** | Runs, is being used by the operator, no packaging or support promise. |
| **planned** | Named, scoped, not built. No date. |

### 2.1 Web surfaces (this repo)

| Surface | Status | Where | Notes |
| --- | --- | --- | --- |
| lemon.audio homepage | **live** | https://lemon.audio | `apps/website/public/index.html`. Static, no build. Hero only; the sole nav link is the flasher. Deployed by `.github/workflows/deploy.yml` on push to `main`. |
| Drop #001 — ACID TEKNO | **live** | https://drops.lemon.audio (`#001-acid-techno`) | `apps/drops/src/drops/001-acid-techno/`. Pure Web Audio, no samples. Shareable preset URLs (`?p=`). |
| Drops index | **live** | https://drops.lemon.audio | `apps/drops/src/main.ts` hash router. One drop in the registry. |
| `lemon.audio/drops/` | **live (redirect)** | https://lemon.audio/drops/ | `apps/website/public/drops/index.html` — meta-refresh + JS redirect preserving hash/query. |
| Firmware flasher | **live** | https://lemon.audio/flasher/ | `apps/flasher/`. WebUSB DFU. Built in CI and staged into `apps/website/public/flasher` by `deploy.yml`. 38 tests across 5 files, green. |
| `fm.lemon.audio` (stream) | **planned** | — | Named in `vault/lemon/CONTEXT.md`. No code in this repo. |
| Albums | **planned** | — | Named in `vault/lemon/CONTEXT.md`. No code, no files. |

**Correction to record:** `README.md` says drops.lemon.audio is "planned" and
that drops is "also published at `lemon.audio/drops/`". Both are stale.
`.github/workflows/deploy-drops.yml` builds `apps/drops` and publishes to
`chronick/lemon-drops` with `CNAME=drops.lemon.audio`, and `/drops/` is now
only a redirect stub. The README fix belongs in the first implementation
child. (DNS resolution itself was not verified from this environment — the
pipeline is in CI and the redirect assumes it; if the host is not answering,
that is a deploy bug, not a plan question.)

### 2.2 Firmware (flashable today)

`apps/flasher/public/firmware/catalog.json` has exactly two entries. Neither
binary is checked in; `apps/flasher/src/catalog.ts` resolves
`api.github.com/repos/<repo>/releases/latest` at page load and looks for a
named asset.

| Firmware | Status | Source | Asset |
| --- | --- | --- | --- |
| DuoPulse — 2-voice algorithmic percussion sequencer | **usable** (Daisy Patch.init() hardware required) | `chronick/duopulse` | `duopulse.bin` |
| QPAS-ish — quad-peak animated filter | **usable** (same) | `chronick/qpas-ish` | `qpas-ish.bin` |

Two consequences the site must be honest about:

- The offering is exactly as live as those two GitHub releases. If a release
  or asset is missing, `resolveRelease` returns `null` and the entry silently
  degrades. The Flash page should say "resolved from GitHub releases" rather
  than implying a hosted binary store.
- Flashing needs the physical module in DFU mode and a Chromium-family
  browser (WebUSB). "Live" applies to the page; "usable" applies to the act.

Known open defect: **vault-3ajh** — "lemon-audio flasher: DfuSe memory-map
recovery (verify on hardware, deploy)" (p3, `repo:lemon`). Unresolved as of
the 2026-08-09 triage. It does not block v2 but should be named on the Flash
page's own limitations line rather than discovered by a user mid-flash.

### 2.3 Make — the command-line tools

| Tool | Status | Where | Honest note |
| --- | --- | --- | --- |
| **smpl** (core toolchain) | **usable** | https://github.com/chronick/smpl · site https://chronick.github.io/smpl/ | Public, MIT. 47 subcommands. One `uv tool install` line; core cold-starts without torch. NDJSON frames + content-addressed blobs. The memo key is specified but **cache lookups are not wired — re-runs recompute**; the README says so and the site must too. |
| smpl heavy tools (`gen`, `cloud`, `stems`, `transcribe`, `embed`, `synth`, `midi`) | **usable** | `tools/` in the same repo | Separate `uv tool install` per tool, discovered on PATH. Not part of the quick start. |
| smpl agent skills (`smpl-dissect`, `smpl-audit`) | **usable** | `skills/` in the same repo | `npx skills add chronick/smpl --global --agent codex claude-code --yes`. |
| **smplmix** (session render) | **experimental** | referenced as `github.com/chronick/smplmix`; **not cloned in this environment, not verified public** | This is the only thing that renders a session to audio. It is not part of the smpl install, not in the smpl tools table, and not covered by `spec.md`. See §6. |
| **smplgen** | **experimental** | `~/git/smplgen` (separate repo) | Lean text-to-audio + melody generation CLI, CPU-slow (~15s per 4s of audio). Overlaps `smpl gen`; the relationship is not settled. Do not surface on v2. |
| **lemon-record** | **experimental — status per vault docs, repo not inspected** | not cloned here | `music-hub/CLAUDE.md` describes it as "primary audio recorder, writes to `~/.music-hub-data/recordings/`". One open task carries the `repo:lemon-record` label: **vault-3p16** (p2, 62 days stale) "sample-kit: replace sample-curator Tauri GUI with recorder app + CLI pipeline". No install path, no docs, no release. **Do not surface on v2 at all** — see §5.4. |

### 2.4 Adjacent, not a lemon.audio surface

**Lemon Chan** is active (Telegram `@LemonChanBot`, NanoClaw on the Mac mini)
and is the brand's persona everywhere. It is not a web surface and gets no
site section in v2 — at most a byline. Its identity constraints live in
`vault/lemon/identity.md` and are not changed by anything here.

## 3. v2 site map and homepage hierarchy

### 3.1 Map

```
lemon.audio/                  home — three doors + status chips        [new content]
├── /make/                    the command-line studio page             [new page]
├── /flasher/                 WebUSB flasher (existing app)            [exists; copy edits]
└── /drops/                   redirect → drops.lemon.audio             [exists, unchanged]

drops.lemon.audio/            the Play runtime: drop index + toys      [exists]
```

Three doors, three real destinations. No `/play/` page in v2: PLAY has
exactly one member (Drops), and inventing an index page above a single item
is the fog this ticket exists to prevent. The house rule from
`vault/lemon/vision.md` — a namespace earns existence at two members —
applies. When a second toy family lands (a one-off web toy that is not a
numbered Drop, or fm.lemon.audio), `/play/` gets built and the home link
repoints. Until then PLAY links straight to `drops.lemon.audio`.

### 3.2 Homepage hierarchy

The hero stays exactly as it is — ASCII Lemon-Chan, the ASCII wordmark, the
`レモン /// 🍋` line, scan lines, the flicker/float/glow animations. That is
the register and it is not up for negotiation in v2. What changes is what
sits under it: the single `firmware flasher` button becomes three doors.

```
[ hero: lemon-chan + LEMON AUDIO wordmark + レモン /// 🍋 ]

   PLAY                     MAKE                     FLASH
   noise you can poke       tools you can pipe       firmware you can burn
   in a browser             in a terminal            onto a module
   ── live ──               ── usable ──             ── live ──
   drop #001 acid tekno     smpl · 47 subcommands    2 firmwares · WebUSB
   → drops.lemon.audio      → /make/                 → /flasher/

   run by nick donohue · counterpart: lemon agent
```

Rules the implementation must hold to:

- **Order is Play → Make → Flash**, easiest to hardest. A stranger with a
  phone can use exactly one of the three; it is first.
- **Every door carries a status chip** using the §2 vocabulary, rendered in
  the existing neon palette (`--neon-green` live, `--neon-cyan` usable,
  `--neon-pink` experimental, `--text-dim` planned).
- **Every door carries one countable fact** ("drop #001", "47 subcommands",
  "2 firmwares"), not an adjective. Counts are cheap to keep true and are
  the anti-fog mechanism.
- **No hover-only information.** Phones exist.
- The page stays a single static HTML file with inline CSS and no build
  step. It may now need to scroll on small screens; `overflow: hidden` on
  `body` must go.
- The existing credit line stays, including the `lemon-agent.dev` backlink
  (shipped in `19d41c5` for LEM-01).

## 4. First implementation slice

**Slice: the three-door homepage + the `/make/` page.** One PR, two files
(`apps/website/public/index.html`, `apps/website/public/make/index.html`),
plus the stale-README fix. No new dependency, no build step, no server
state.

Why this slice and not a new toy or flasher work: the two things that are
already **live** cannot be reached from the front door. Drops has a
subdomain, a CI pipeline, and a redirect stub — and zero inbound links from
lemon.audio. Every other candidate slice adds surface before fixing that.

Why `/make/` is in the same slice: MAKE is the door with no destination.
Shipping the three doors while one of them 404s or points off-site to a
GitHub README would make the homepage less honest, not more.

### 4.1 Complete user-use path (MAKE — the one that needs proving)

A stranger lands on lemon.audio, clicks MAKE, and finishes with a measured
audio report in their terminal. Every step below is copy-pasteable and comes
from the smpl README, not invented for this plan.

1. **Land.** `/make/` opens with the honest frame: "smpl is a public,
   MIT-licensed audio toolchain you pipe like `jq`. It measures, edits, and
   describes audio. It does not yet compose a session end to end — see
   *What's missing* below."
2. **Install `uv`** (linked to https://docs.astral.sh/uv/), then the core in
   one isolated environment:
   ```bash
   uv tool install git+https://github.com/chronick/smpl#subdirectory=packages/smpl \
     --with git+https://github.com/chronick/smpl#subdirectory=packages/smplstream \
     --with git+https://github.com/chronick/smpl#subdirectory=packages/smpl-analysis
   ```
   No model download, no API key, no account.
3. **Get the demo loop** (four seconds, shipped with smpl):
   ```bash
   curl -LO https://chronick.github.io/smpl/assets/loop.wav
   ```
4. **Run the first pipe:**
   ```bash
   smpl read loop.wav | smpl loudness | smpl view > /dev/null
   ```
5. **Verify.** The page prints the expected rows so the user can confirm
   their install rather than guess:
   ```text
   | `loudness.integrated_lufs` | -20.79 | LUFS | loudness | loudness |
   | `loudness.true_peak_dbtp`  | -6.71  | dBTP | loudness | loudness |
   ```
   Small last-decimal differences across platforms are fine.
6. **Do something with their own audio** — one worked second pipe, the
   forensic one, because it produces a picture and is the clearest
   demonstration of why frames beat path-in/path-out:
   ```bash
   smpl read yours.wav | smpl qc | smpl spectrogram | smpl view
   ```
7. **Hand it to an agent** (the lemon.audio-register version of the pitch:
   the toolkit is the instrument, the agent plays it):
   ```bash
   npx skills add chronick/smpl --global --agent codex claude-code --yes
   ```
   with one line on what `smpl-dissect` and `smpl-audit` do.
8. **Exit ramps.** Two, clearly labelled: *"want the disciplined version of
   this workflow?"* → https://lemon-agent.dev/audio/ ; *"want the whole
   protocol?"* → https://chronick.github.io/smpl/ and `spec.md`.

Acceptance for the slice: a person who has never seen any of this can get
from lemon.audio to those two measured numbers without opening GitHub, and
the page never once calls smpl a DAW.

## 5. Honest availability language

### 5.1 The rule

Every surfaced product carries: **a status chip, a countable fact, a real
destination, and — where the status is not "live" — one sentence naming what
the user still has to bring** (hardware, a terminal, a browser flag, an
install). Adjectives are not availability. If a claim needs a hedge longer
than one sentence, the product is not ready to be surfaced.

### 5.2 Per-surface copy contract

| Surface | Chip | Countable fact | Destination | What the user brings |
| --- | --- | --- | --- | --- |
| Drops | live | drop #001 | `https://drops.lemon.audio` | a browser (audio starts on click) |
| Drop #001 ACID TEKNO | live | 303 acid + kick sequencer, shareable presets | `https://drops.lemon.audio/#001-acid-techno` | — |
| smpl | usable | 47 subcommands, MIT | `/make/` → `https://github.com/chronick/smpl` | a terminal and `uv` |
| smpl agent skills | usable | 2 skills | `/make/` | an agent CLI (Claude Code or Codex) |
| Flasher | live | 2 firmwares | `/flasher/` | a Chromium-family browser + the module in DFU mode |
| DuoPulse | usable | Daisy Patch.init() | resolved from `chronick/duopulse` releases | the hardware |
| QPAS-ish | usable | Daisy Patch.init() | resolved from `chronick/qpas-ish` releases | the hardware |
| fm.lemon.audio | planned | — | not linked | — |
| Albums | planned | — | not linked | — |

### 5.3 Banned phrasings

- **"DAW"** anywhere on the site until §6 is satisfied. Use **command-line
  studio** or **audio toolkit**. The lemon-agent audio page already models
  this restraint ("leads toward toys, performance tools, and a command-line
  studio") and the two sites must not disagree.
- "Coming soon", "beta", "early access" — none map to §2's vocabulary.
- "Powered by AI" as a product claim. The provenance line
  ("mostly AI-generated, human-guided and reviewed") is a footer fact, not a
  feature.
- Any count that is not mechanically checkable against a file in a repo.

### 5.4 Not surfaced in v2, and why

- **lemon-record** — experimental, uninspected, no install path, its only
  tracked task is 62 days stale. Surfacing it would be exactly the fog this
  ticket forbids. Revisit when it has a README and a public repo.
- **smplgen** — overlaps `smpl gen`; the relationship is unsettled. One tool
  per job on the site.
- **smplmix** — see §6. It is the render engine, and naming it before it is
  installable would advertise the missing half.
- **Lemon Chan** — persona, not a product surface.

## 6. What must ship before "DAW"

Today the composition story stops one tool short. `smpl pattern` (shipped, in
the public repo) expands a step-grid DSL into a session file:

```bash
smpl pattern --pattern-file loop.json --out loop.smplset.json
smplmix render loop.smplset.json -o loop.wav     # ← different tool, different repo
```

`smplmix` is where composition actually runs. It is not installed by the smpl
quick start, does not appear in the smpl tools table, and `.smplset.json` is
not described in `spec.md`. Meanwhile `smpl mix` — the many→1 combinator that
would make composition native — is deliberately **unphased** in the plan of
record (`vault/music/smplstream/plan.md`): *"the session model is an open
design call."*

So the honest state is: **measure and edit are a product; compose and render
are a personal rig.** The word DAW is unlocked when all of the following are
true.

1. **A session format inside the public contract.** `.smplset.json` (or its
   successor) specified in `smpl/spec.md` and versioned like the rest of the
   wire protocol — not an implementation detail of one unlisted repo.
2. **`smpl mix` exists as a first-class combinator.** Many→1: select N audio
   frames from the accumulated stream, place them on the spec's
   sample-accurate timebase, emit one audio frame whose lineage names every
   input. `--dry-run` returns the planned arrangement without rendering.
3. **The session state-model decision is made and written down.** Per
   agent-as-UI: the session is canonical data on disk, `smpl mix` is a
   stateless control plane over it (add-clip / set-gain / automate / render),
   the agent drives the verbs. This is the open design call above; it is a
   decision, not a coding task, and it blocks 1 and 2.
4. **One install path.** Rendering must be reachable from the same
   `uv tool install` the quick start already teaches — whether smplmix is
   absorbed into the workspace or published as a heavy tool alongside
   `smpl-stems`. A second undocumented repo is not a shipping story.
5. **Render correctness fixed at the source.** smplmix currently places the
   downbeat at sample ~249 (5.2 ms in) on a 2-bar timeline render and
   hard-cuts tails at the boundary, so naive repeats sit late with a seam
   click (measured seam discontinuity 0.09–0.13). The workaround is an
   out-of-band `loopify.py`. A studio that needs a post-processing script to
   make its own loops tile is not one we name a DAW. The filed `smpl loop` op
   is a candidate home for the fix.
6. **Memoization actually wired.** The memo key is specified; subcommand
   cache lookups are not implemented, so every re-run recomputes. An
   iterative composition loop re-renders constantly; this is the difference
   between a plausible session workflow and a slow one.
7. **One end-to-end worked example a stranger can run** — pattern → session →
   render → audit — published with expected output the way the loudness
   quick start is, and green in the smpl e2e suite.

Until 1–7: **command-line studio**. The `/make/` page carries a short
*What's missing* block naming items 1, 4, and 6 in user terms ("smpl measures
and edits today; composing a session end to end still needs a tool that is
not packaged yet"). Naming the gap on the page is what earns the right to
describe the ambition at all.

## 7. Cross-link contract with lemon-agent.dev/audio

Both sites already point at each other; v2 makes the division explicit so
neither drifts into duplicating the other.

**Live state:** the audio craft page is at `https://lemon-agent.dev/audio/`
(raw markdown at `/craft/audio.md`, index at `/craft/`, machine catalog at
`/catalog.json` where it appears as `audio-craft`, `status: v0`,
`listed: false` — incubating, gated out of nav). It already closes with a
link to lemon.audio and already says the studio version "runs on **smpl**…
not packaged for outside use yet". lemon.audio already links
`lemon-agent.dev` in its credit line.

### 7.1 Who owns what (canonical content)

| Content | Canonical home | The other site may |
| --- | --- | --- |
| Bounce-audit workflow, export gates, "checks before ears" discipline | lemon-agent.dev/audio | link to it; never restate the prompt or the gates |
| Repeatable agent practice, failure lists, the operating pattern | lemon-agent.dev | link |
| smpl install line, first pipe, expected numbers | **lemon.audio/make/** (mirroring the smpl README, which is upstream of both) | link |
| Toys, Drops, the weird register, mascot | **lemon.audio** | link, in one sentence, without reproducing the visual language |
| Firmware, WebUSB, hardware | **lemon.audio/flasher/** | link |
| smpl protocol, spec, subcommand reference | `chronick/smpl` + `chronick.github.io/smpl` (upstream of both sites) | both link, neither forks |

**One-hop rule:** each site links to the other's canonical page, never to a
copy. When a fact lives in the smpl README, both sites quote it and neither
paraphrases it into a new number.

### 7.2 Required links

- lemon.audio `/make/` → `https://lemon-agent.dev/audio/`, labelled as the
  disciplined counterpart (one line, exit-ramp position, §4.1 step 8).
- lemon.audio home → keeps the existing `lemon agent` credit-line link.
- lemon-agent.dev/audio → already links lemon.audio; **no change requested**
  in this repo, and this plan files no work against that repo.

### 7.3 Register boundary

lemon.audio may be strange: mascot, scan lines, second-person weirdness,
"noise you can poke". It may not be vague. lemon-agent.dev stays plain and
instructional. The one thing they must say identically is availability — if
lemon-agent.dev says smpl is not packaged for outside use, lemon.audio does
not call it a product. Register diverges; facts do not.

### 7.4 Drift check

When either site changes an availability claim about smpl, the other's copy
is re-read in the same session. The mechanical anchors: this document's §2
table, and `lemon-agent.dev/catalog.json` → `audio-craft.how_to_use`.

## 8. Open questions for the owner

1. **drops.lemon.audio DNS** — the CI pipeline and the redirect stub both
   assume it resolves. Not verifiable from this environment. Confirm before
   the homepage points PLAY at it.
2. **smplmix visibility** — is `chronick/smplmix` public? §6 item 4 differs
   depending on the answer (absorb vs. publish).
3. **`/make/` vs. a subdomain** — this plan puts MAKE on the apex as a static
   page. If it grows a real docs tree, `make.lemon.audio` becomes the same
   conversation drops already had.
4. **Second Drop** — PLAY currently reads "drop #001" with no cadence claim.
   The vault calls Drops "weekly". v2 makes no cadence promise; say so or
   ship #002.

## 9. Proposed implementation children

Filed by the owner **after this plan is approved**. No tasks were created by
this document.

1. **lemon.audio home: three-door hierarchy (Play/Make/Flash) with status
   chips** — rewrite the nav block in `apps/website/public/index.html` per
   §3.2; drop `overflow: hidden`; keep hero and credit line intact.
2. **lemon.audio `/make/`: the command-line studio page** — new static page
   implementing the §4.1 path verbatim, including the *What's missing* block
   from §6 and the lemon-agent exit ramp from §7.2.
3. **README: correct the drops deploy reality** — drops.lemon.audio is the
   live target and `/drops/` is a redirect; remove the "planned" language and
   the stale manual-copy note.
4. **Flasher page: availability + limitations line** — state that firmware is
   resolved from GitHub releases at load, name the browser and DFU-mode
   requirements, and surface the graceful-degradation case when a release is
   missing.
5. **Flasher: finish vault-3ajh (DfuSe memory-map recovery)** — existing
   ticket; v2 gives it a user-visible reason to land.
6. **smpl: specify the session format and `smpl mix`** — §6 items 1–3. Lands
   in `chronick/smpl`, not here; blocks any DAW language.
7. **smpl/smplmix: one install path for render** — §6 item 4.
8. **`smpl loop` op: fix the render downbeat offset at source** — §6 item 5,
   retiring the out-of-band `loopify.py`.
9. **Drop #002** — unblocks a real `/play/` index and lets the homepage make
   a cadence claim.
10. **Availability drift check** — a recurring read of §2 against
    `lemon-agent.dev/catalog.json`, per §7.4.
