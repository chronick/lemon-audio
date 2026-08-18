# smpl analyze

A hosted analyze endpoint: **audio bytes in, a structured descriptor report out.** It is a
thin stdlib HTTP wrapper around the open-source [smpl](https://github.com/chronick/smpl)
engine — it shells `smpl read | loudness | spectral | qc | view` and adds no DSP of its own.

Zero dependencies: Python 3.11+ stdlib plus the `smpl` CLI on `PATH`. No framework, no
database, no queue. Stateless — every request gets a temp dir removed before the response
is written, and the server's own paths never appear in a response.

| Route | Purpose |
| ----- | ------- |
| `POST /analyze` | Raw audio bytes (`Content-Type: audio/*`, optional `?name=`) → descriptor JSON |
| `GET /healthz` | Liveness plus the smpl version behind the endpoint |
| `GET /` | The landing page (`index.html`) |

Limits: 25 MB request cap (413), 120 s analysis budget (504), `audio/*` only (415). Bodies
are raw — no multipart, which is what keeps the server stdlib-clean.

## Run it locally

```bash
uv venv .venv && source .venv/bin/activate
uv pip install -e <path-to-smpl>/packages/smpl -e <path-to-smpl>/packages/smpl-analysis
python server.py            # 127.0.0.1:8791; override with $SMPL_ANALYZE_PORT / _HOST
```

```bash
curl -LO https://chronick.github.io/smpl/assets/loop.wav
curl --data-binary @loop.wav -H 'Content-Type: audio/wav' \
     'http://localhost:8791/analyze?name=loop.wav'
```

Measured response for that loop (10,824 bytes; excerpt):

```json
{
  "report": "# smpl analysis report\n\n**5 frame(s):** 1× audio, 3× feature, 1× marker…",
  "features": {
    "loudness": {"loudness.integrated_lufs": -20.79, "loudness.true_peak_dbtp": -6.71,
                 "loudness.max_short_term_lufs": -20.71},
    "spectral": {"lowlevel.spectral_rolloff": {"mean": 5228.386549, "stdev": 7381.694114}, "…": "…"},
    "qc": {"qc.clipping.detected": false, "qc.dc_offset_dbfs": -68.9, "qc.snr_db": 13.91,
           "qc.lossy.spectral_cutoff_hz": 19993.6, "qc.lossy.confidence": 0.001}
  },
  "frames": ["…6 raw NDJSON frames: audio/source, feature×3, marker/defect, text/report…"]
}
```

`-20.79 LUFS` / `-6.71 dBTP` are the numbers the smpl README quotes for a local install of
the same loop — the endpoint is a transport, not a second opinion.

## Tests

```bash
python test_server.py       # stdlib unittest; smpl must be on PATH
```

Starts the server on an ephemeral port and covers `/healthz`, the landing page, a real
analyze round-trip against `loop.wav` (asserts integrated LUFS ≈ −20.79 and the spectral +
qc key sets), path-leak redaction, oversized-body rejection, and content-type rejection.
The loop is located via `$SMPL_LOOP_WAV`, else a sibling `smpl/` checkout; those tests skip
with a clear message if it is absent.

## Eval

`eval/` holds the sample-selection eval — descriptor layer vs raw audio. Designed and
runnable up to the model call; the judged run is pending an API key. See `eval/README.md`.

## Deploy notes

**Not deployed yet.** What follows is the intended path; `rig/config/skiff.yml` has *not*
been edited — that is the owner's move.

**Primary: a skiff service on the mini,** modeled on the `vault.mcp` pattern (a long-lived
local HTTP service on a fixed port, reverse-proxied at the edge):

- service name `lemon.smpl-analyze`, port `8791`
- install: a venv on the mini with `smpl` + `smpl-analysis` installed into it, and that
  venv's `bin` first on the service's `PATH` — the server resolves `smpl` via `PATH` and
  reports what it found at `/healthz`, so a mis-wired install is visible immediately
- command: `python <repo>/apps/smpl/server.py`, env `SMPL_ANALYZE_HOST=127.0.0.1`
- fronted by the existing edge so it lands under `lemon.audio`; keep it bound to loopback
  and let the proxy terminate TLS

**Why not a Cloudflare Worker.** A Worker cannot run this. The analysis is a Python
subprocess pipe over libsndfile/numpy — Workers have no process model, no filesystem to
write the temp upload to, and no way to execute a CLI. Python Workers do not change that.
A Worker's only honest role here is a thin reverse proxy in front of the mini (auth, rate
limiting, caching by content hash); that proxy is deliberately **not** built yet.

**Subdomain graduation.** Incubate at a path under `lemon.audio`, move to
`smpl.lemon.audio` once it holds traffic, and to `smpl.audio` when the engine's own site
and this endpoint are worth pointing one apex at. Nothing in the server hardcodes a host.

**Before exposing it publicly**, decide on a rate limit (analysis is CPU-bound and a 25 MB
body buys ~120 s of work) and whether `/analyze` stays unauthenticated.

Engine source and spec: <https://github.com/chronick/smpl> ·
docs and demo assets: <https://chronick.github.io/smpl/>
