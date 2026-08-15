#!/usr/bin/env python3
"""Sample-selection eval harness: descriptor layer (arm B) vs raw audio (arm A).

Stdlib only; analysis is the same smpl pipe the endpoint uses. See README.md for the
design, the metrics, and what a run of this size can and cannot show.
"""

import argparse
import json
import math
import os
import random
import struct
import sys
import wave

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import server  # noqa: E402  (the analyze pipeline, reused verbatim)

SR = 44100
INSTRUCTION = ("Choose exactly one candidate that best fits the brief. Reply with JSON: "
               '{"choice": "<id>", "ranking": ["<id>", ...], "reason": "<one sentence>"}.')


def write_wav(path, samples):
    with wave.open(path, "wb") as out:
        out.setnchannels(1), out.setsampwidth(2), out.setframerate(SR)
        out.writeframes(b"".join(struct.pack("<h", int(max(-1.0, min(1.0, s)) * 32767))
                                 for s in samples))


def make_fixtures(outdir, n=SR):
    """Three tiny candidates, one of them deliberately clipped (the ground truth)."""
    os.makedirs(outdir, exist_ok=True)
    rng = random.Random(1312)
    tone = [0.25 * math.sin(2 * math.pi * 110.0 * i / SR) for i in range(n)]
    write_wav(os.path.join(outdir, "clean-sine.wav"), tone)
    write_wav(os.path.join(outdir, "clipped-sine.wav"), [t * 6.0 for t in tone])
    write_wav(os.path.join(outdir, "white-noise.wav"),
              [rng.uniform(-0.3, 0.3) for _ in range(n)])
    dump(os.path.join(outdir, "manifest.json"), {
        "planted_defect": "clipped-sine",
        "note": "clipped-sine is hard-clipped; qc.clipping.detected should catch it"})
    return sorted(f for f in os.listdir(outdir) if f.endswith(".wav"))


def dump(path, obj):
    with open(path, "w") as handle:
        json.dump(obj, handle, indent=2)


def load(path, default=None):
    if default is not None and not os.path.exists(path):
        return default
    with open(path) as handle:
        return json.load(handle)


def build_trial(candidates_dir, out_dir, brief):
    wavs = sorted(f for f in os.listdir(candidates_dir) if f.endswith(".wav"))
    if not wavs:
        sys.exit("no .wav candidates in %s" % candidates_dir)
    os.makedirs(out_dir, exist_ok=True)
    ground_truth = load(os.path.join(candidates_dir, "manifest.json"), default={})
    arm_a, arm_b = [], []
    for name in wavs:
        cid = os.path.splitext(name)[0]
        arm_a.append({"id": cid, "file": name,
                      "attach_as": "raw audio (requires an audio-capable model)"})
        with open(os.path.join(candidates_dir, name), "rb") as handle:
            report = server.analyze_bytes(handle.read(), name)
        arm_b.append({"id": cid, "report": report["report"], "features": report["features"]})
        print("described %-18s lufs=%s clipping=%s" % (
            cid,
            report["features"].get("loudness", {}).get("loudness.integrated_lufs"),
            report["features"].get("qc", {}).get("qc.clipping.detected")))

    common = {"brief": brief, "instruction": INSTRUCTION, "ground_truth": ground_truth}
    payloads = {
        "arm_a.json": dict(common, arm="A", modality="raw-audio", candidates=arm_a),
        "arm_b.json": dict(common, arm="B", modality="smpl-descriptors", candidates=arm_b),
    }
    for name, payload in payloads.items():
        path = os.path.join(out_dir, name)
        dump(path, payload)
        print("wrote %s (%d candidates, %d bytes)"
              % (name, len(payload["candidates"]), os.path.getsize(path)))
    return out_dir


def judge(trial_dir):
    """Score a built trial. Arm B is text; arm A needs an audio-capable provider."""
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        sys.exit("--judge needs ANTHROPIC_API_KEY in the environment (arm B, text judge). "
                 "Export it and re-run: ANTHROPIC_API_KEY=sk-... python run_eval.py --judge %s"
                 % trial_dir)
    import urllib.request  # local: the harness stays importable without network intent

    payload = load(os.path.join(trial_dir, "arm_b.json"))
    prompt = "%s\n\n%s\n\nCandidates:\n%s" % (
        payload["brief"], payload["instruction"],
        json.dumps(payload["candidates"], indent=2))
    body = json.dumps({"model": os.environ.get("EVAL_MODEL", "claude-sonnet-4-5"),
                       "max_tokens": 512,
                       "messages": [{"role": "user", "content": prompt}]}).encode()
    request = urllib.request.Request(
        "https://api.anthropic.com/v1/messages", data=body,
        headers={"content-type": "application/json", "x-api-key": key,
                 "anthropic-version": "2023-06-01"})
    with urllib.request.urlopen(request, timeout=120) as response:
        answer = json.load(response)
    text = "".join(block.get("text", "") for block in answer.get("content", []))
    out = os.path.join(trial_dir, "arm_b_result.json")
    dump(out, {"raw": text, "ground_truth": payload["ground_truth"]})
    print(text)
    print("wrote %s" % out)
    print("arm A is NOT judged here: the Anthropic Messages API takes no audio input. "
          "Run arm_a.json against an audio-capable model and score both by hand.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--make-fixtures", metavar="DIR")
    parser.add_argument("--candidates", metavar="DIR")
    parser.add_argument("--out", metavar="DIR", default="trials")
    parser.add_argument("--brief", default="pick the best kick for a dark 130 BPM techno track")
    parser.add_argument("--judge", metavar="TRIAL_DIR")
    args = parser.parse_args()

    if args.make_fixtures:
        print("fixtures:", ", ".join(make_fixtures(args.make_fixtures)))
    if args.candidates:
        build_trial(args.candidates, args.out, args.brief)
    if args.judge:
        judge(args.judge)
    elif not (args.make_fixtures or args.candidates):
        parser.print_help()


if __name__ == "__main__":
    main()
