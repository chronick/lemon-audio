# Eval — does the descriptor layer help a model pick a sample?

The endpoint's claim is that a structured descriptor report makes audio *legible* to an LLM.
This eval is the attempt to falsify that on one concrete task.

**Status: designed and runnable up to the model call. The judged run is pending** — it needs
an API key this harness deliberately does not ship with. Run instructions below.

## Task

Given a text brief (`"pick the best kick for a dark 130 BPM techno track"`) and N candidate
samples, the model selects one and ranks the rest.

| Arm | What the model sees |
| --- | --- |
| **A — raw audio** | The candidate audio itself, as multimodal input. |
| **B — descriptors** | The smpl report per candidate: loudness, spectral, qc — no audio. |

Both arms get the identical brief and the identical reply schema
(`{choice, ranking, reason}`), so the only variable is the representation.

## Metrics

1. **Planted-defect accuracy.** One candidate is deliberately broken — hard-clipped, or
   lossy-encoded and re-expanded — and should never be chosen. `qc.clipping.detected` and
   `qc.lossy.confidence` state the defect outright in arm B; arm A has to hear it. Cheap and
   objective: a binary per trial, no human needed.
2. **Rank agreement.** Spearman correlation between the model's ranking and a human ranking
   of the same candidates for the same brief. The expensive half, and the one that actually
   speaks to taste.

## What this cannot show

- **Small N proves little.** A handful of trials with one brief measures whether the
  descriptor layer is *usable*, not whether it is *better*. Treat a result as a smoke test.
- **Arm A is provider-dependent.** The Anthropic Messages API takes no audio input, so arm A
  needs an audio-capable model — a weak arm A may be measuring that provider's audio encoder
  rather than the value of raw audio.
- **The defect metric is friendly to arm B by construction** — smpl's qc stage was written
  to find exactly these defects. It shows the descriptor layer carries the information; it
  does not show a model uses descriptors well for *aesthetic* choices. Metric 2 is the one
  that can embarrass the thesis, which is why it is worth paying for.
- **Descriptors can only ever answer what they measure.** Nothing here captures groove,
  arrangement, or character — the same honest limit the refmatch studies report.

## Running it

```bash
python run_eval.py --make-fixtures ./fixtures      # 3 synthetic wavs + manifest.json
python run_eval.py --candidates ./fixtures --out ./trials \
    --brief "pick the best kick for a dark 130 BPM techno track"
ANTHROPIC_API_KEY=sk-... python run_eval.py --judge ./trials
```

`--make-fixtures` writes a clean sine, a hard-clipped sine, and white noise (stdlib `wave`,
seeded) plus a `manifest.json` naming the planted defect — enough to exercise the harness.
Real trials want real candidates: point `--candidates` at a directory of kick samples with
your own `manifest.json`. It shells the same smpl pipe the endpoint uses and writes
`arm_a.json` (file references) and `arm_b.json` (descriptor reports). `--judge` scores arm B
and exits with a clear message if the key is absent; arm A is not judged here — run
`arm_a.json` against an audio-capable model and score both by hand.
