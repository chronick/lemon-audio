---
title: "Making audio legible to agents"
status: draft
date: 2026-08-15
tags: [audio, agents, llm, smpl, mixing]
description: "Audio is opaque to language models. A structured descriptor layer — loudness, spectral balance, quality flags — makes it legible, and turns mixing decisions into something an agent can actually close a loop on."
---

# Making audio legible to agents

Hand an agent a Python file and it reads it. Hand it a CSV, a PDF, a log — all legible.
Hand it a WAV and it has a blob. Everything that matters about that file — whether the low
end is too heavy, whether someone clipped it on the way out, whether it sits where a
finished record sits — is encoded in a few million amplitude samples, and none of it is
addressable.

This is not a model-capability complaint that the next release fixes. It is a representation
problem, and it has a boring fix: put a **structured descriptor layer** between the audio
and the agent.

## Opaque is a specific claim

Multimodal models that ingest audio exist, and they are genuinely useful — they will tell
you a clip sounds like a dark techno kick with a long tail. What they hand back is an
*impression*. Impressions are hard to work with:

- You cannot diff them — "slightly boomier than before" is not a delta.
- You cannot threshold them; there is no `if` to write against "sounds a bit loud."
- You cannot regress on them. Re-run tomorrow and the wording moves even if the audio did not.

Meanwhile the things a mixing decision actually turns on are *numbers* — integrated
loudness, true peak, band ratios, stereo width, whether clipping was detected. Those
numbers have been computable for decades. They were simply never on the agent's side of
the wall.

## The descriptor layer

A descriptor layer is the audio's measurements, emitted in a shape a model can read and a
program can parse. Four families cover most of the work:

- **Loudness** — integrated LUFS, true peak, short-term maxima. Where the file sits
  against a mastering target.
- **Spectral** — rolloff, flatness, crest, contrast, spread. The shape of the sound.
- **QC** — clipping, DC offset, SNR, lossy-encoding fingerprints. Whether the file is
  *broken*, which is a different question from whether it is *good*.
- **Embeddings** — a vector for similarity search, for "find me more like this."

[smpl](https://github.com/chronick/smpl) is that layer built as a Unix pipe. One
self-describing NDJSON frame per line; heavy bytes referenced by content hash rather than
carried; every stage passes through the audio *and* its accumulating metadata, so the tail
of a pipe can see the whole lineage.

```bash
smpl read loop.wav | smpl loudness | smpl spectral | smpl qc | smpl view
```

```text
| key                            | value            | unit |
| `loudness.integrated_lufs`     | -20.79           | LUFS |
| `loudness.true_peak_dbtp`      | -6.71            | dBTP |
| `lowlevel.spectral_rolloff`    | 5228.4 (±7381.7) |      |
| `qc.clipping.detected`         | false            |      |
| `qc.snr_db`                    | 13.91            | dB   |
| `qc.lossy.spectral_cutoff_hz`  | 19993.6          | Hz   |
```

That is legible. An agent can rank on it, threshold on it, and — the part that matters —
check its own work against it after making a change.

## The worked example: matching a reference

The best test of a descriptor layer is not a demo but a project that would have been
impossible without it. The refmatch studies (an ongoing series in my own studio notes)
take an original techno or deep-house loop — our pattern, our samples — and move its
measured spectral balance, stereo width and loudness toward a chosen reference recording,
section by section. The reference supplies **measured targets only**; no reference audio
is reproduced, and the output is original.

The loop is mechanical, and every step runs on numbers: segment the reference and measure
per-section targets (band ratios, width, centroid, loudness); measure our loop the same way;
compute a bounded 12-band EQ transfer toward the reference's measured per-band balance —
mean-normalized, sub-protected, clamped; re-measure and report the delta per axis, plus how
many axes landed inside 5%.

Study 1, matching a deep loop to a Bonobo remix's drop section:

| axis | raw loop | matched | reference | read |
| ---- | -------: | ------: | --------: | ---- |
| stereo side/mid | 0.055 | **0.155** | 0.158 | matched dead-on |
| centroid (Hz) | 2803 | **3275** | 3766 | brighter, toward ref |
| mid/sub | 0.43 | **0.47** | 0.69 | moved up, gap remains |
| hi/sub | 0.09 | **0.17** | 0.23 | nearly closed |
| LUFS | — | −16.3 | −12.2 | loop headroom below a finished master |

Every axis moved toward the reference. Across the five studies since, the best per-section
results run from three of five axes within 5% (Nina Kraviz, *I'm Gonna Get You*) to five of
five (Ten Walls, *Walking with Elephants*).

### What the numbers bought that ears did not

The valuable output was not the loops. It was three findings that only exist because the
intermediate state was measured:

**The residual gap was a sound-selection problem, not an EQ problem.** The stubborn
mid/sub shortfall (0.47 against the reference's 0.69) survived every EQ move because the
palette was a Birmingham deep-techno kit — a 20–60 Hz *sub* — while the reference's low end
is a punchy 60–120 Hz *bass*. EQ cannot synthesize a warm 250–500 Hz bassline that was
never played. The fix was upstream, in sample selection. Without numbers this reads as
"still not quite right"; with them it reads as a specific band that is specifically empty.

**References are non-stationary, so "the reference's sound" is not a thing.** That remix
measures mid/sub 0.46 over one window and 0.69 over its drop (loudness range 14). Match
against the section you want to sit in, or you are matching an average that occurs nowhere
in the track.

**Measurement methods do not interchange.** Earlier targets were measured with sox
band-RMS; the studies use FFT Parseval band power. The absolute ratios differ between
methods — compare within a method, never across. This is exactly the kind of thing a
descriptor layer must carry as metadata, because an agent that silently compares a number
from one method against a threshold from another will produce confident nonsense.

### The honesty the numbers force

"Match" here means a handful of measured statistics sit near a reference slice. It does
**not** mean the output sounds like the song. Melody, the vocal line, chord voicings,
specific drum sounds, and within-bar arrangement are not measured and not matched. Read
"replication" as *sits in the reference's measured spectral and stereo register,
section-by-section*.

That precision is a feature of working in descriptors. A vibes-based writeup drifts toward
"we recreated the track." A measured one cannot: five axes within 5% is a claim with a
shape, and so is the LUFS column that never closed.

The same discipline applies to the limits, which the studies file rather than bury:

- The metrics are **time-averaged**, so they are blind to groove micro-timing. Two loops
  with identical band ratios can swing completely differently.
- Three wide bands are a **weak timbre proxy**.
- The success metric *is* the optimization target, which makes a good score partly
  tautological. An independent axis — a perceptual embedding cosine, say — is the honest
  next control.
- Spectral centroid is **pathological with a pure-sine sub**: one huge low-frequency bin
  dominates the magnitude-weighted average, so a section can read far darker than a
  reference whose sub is a harmonic-rich bass, even when the band ratios agree.

A descriptor layer does not make an agent right about music. It makes an agent *specific*,
including specifically wrong, which is the only kind of wrong you can fix.

## The endpoint

All of the above runs locally: install the engine, pipe a file, read the frames. The friction
is that "install the engine" means a Python environment, and the interesting consumer is
often an agent somewhere else. So the public tip of the stack is one endpoint — audio bytes
in, descriptor report out:

```bash
curl --data-binary @loop.wav -H 'Content-Type: audio/wav' \
     'https://lemon.audio/smpl/analyze?name=loop.wav'
```

```json
{"report": "# smpl analysis report…",
 "features": {
   "loudness": {"loudness.integrated_lufs": -20.79, "loudness.true_peak_dbtp": -6.71},
   "qc": {"qc.clipping.detected": false, "qc.snr_db": 13.91,
          "qc.lossy.spectral_cutoff_hz": 19993.6, "qc.lossy.confidence": 0.001}},
 "frames": ["…the raw NDJSON, hashes and lineage included…"]}
```

No account, no key, no multipart, nothing stored. The analysis is done by the open-source
engine shelled as a subprocess; the service adds no DSP and is a transport, not a second
opinion. It is incubating under lemon.audio and will move to its own subdomain once it
holds traffic.

## The open question

Everything above argues descriptors make audio legible. It does not prove they make a model
*better* at a judgment call, and that is the claim worth attacking. The eval: give a model a brief — "pick the best kick for a dark 130 BPM techno track" — and
N candidates. Arm A gets the raw audio as multimodal input. Arm B gets only the descriptor
report per candidate. Same brief, same reply schema, so the representation is the only
variable. Score two ways: agreement with a human ranking, and accuracy on a planted
defect — one candidate is deliberately clipped, which `qc.clipping.detected` states outright
in arm B and arm A has to hear.

The harness is written and the payloads build. The judged run is pending. I expect arm B to
win the defect test easily — the qc stage was written to find exactly those, so that result
mostly confirms the information survives the transformation. The ranking half is the one
that can embarrass the thesis, and it is the one I want the number for.

One line of wider framing and then I will stop: audio is the case I know, but the shape of
the problem — opaque media, an agent that can only reason about what has been made
addressable — is not specific to sound. That argument is its own post.

*Engine: [chronick/smpl](https://github.com/chronick/smpl) ([docs](https://chronick.github.io/smpl/)).
Endpoint source in `apps/smpl/`; eval design and harness in `apps/smpl/eval/`.*
