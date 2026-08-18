#!/usr/bin/env python3
"""smpl analyze endpoint — a stdlib HTTP wrapper around the smpl CLI.

    POST /analyze   raw audio bytes in (Content-Type: audio/*, optional ?name=),
                    JSON descriptor report out
    GET  /healthz   liveness + smpl version
    GET  /          the landing page (index.html, from this directory)

Zero dependencies: Python stdlib plus the `smpl` CLI on PATH. Stateless — each request
gets its own temp dir, removed before the response is written.
"""

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

MAX_BODY = 25 * 1024 * 1024          # 25 MB request cap
TIMEOUT_S = 120                      # whole-pipeline subprocess budget
PIPELINE = ("loudness", "spectral", "qc", "view")
UNSAFE = re.compile(r"[^A-Za-z0-9._-]")
HERE = os.path.dirname(os.path.abspath(__file__))
VERSION = "0.1.0"


class AnalyzeError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status
        self.message = message


def smpl_version():
    """Version string of the smpl CLI on PATH, or None if it isn't there."""
    exe = shutil.which("smpl")
    if exe is None:
        return None
    try:
        done = subprocess.run([exe, "--version"], capture_output=True, text=True, timeout=20)
    except (OSError, subprocess.SubprocessError):
        return None
    return (done.stdout or done.stderr).strip() or None


def safe_name(raw):
    """A filename we are willing to create on disk, derived from a hint."""
    base = os.path.basename(raw or "").strip()
    base = UNSAFE.sub("_", base).lstrip(".")[:64]
    if not base or "." not in base:
        base = (base or "upload") + ".wav"
    return base


def redact(text, tmpdir):
    """Strip the server's temp directory out of anything we hand back."""
    return text.replace(tmpdir + os.sep, "").replace(tmpdir, "")


def run_pipeline(path):
    """read | loudness | spectral | qc | view — returns the NDJSON stdout."""
    exe = shutil.which("smpl")
    if exe is None:
        raise AnalyzeError(503, "the smpl CLI is not on this server's PATH")
    deadline = time.monotonic() + TIMEOUT_S
    stages = [[exe, "read", path]] + [[exe, stage] for stage in PIPELINE]
    stream = b""
    for cmd in stages:
        left = deadline - time.monotonic()
        if left <= 0:
            raise AnalyzeError(504, "analysis exceeded the time budget")
        try:
            done = subprocess.run(cmd, input=stream, capture_output=True, timeout=left)
        except subprocess.TimeoutExpired:
            raise AnalyzeError(504, "analysis exceeded the time budget")
        except OSError as exc:
            raise AnalyzeError(500, "could not run smpl %s: %s" % (cmd[1], exc))
        if done.returncode != 0:
            detail = done.stderr.decode("utf-8", "replace").strip()[-400:]
            raise AnalyzeError(422, "smpl %s failed: %s" % (cmd[1], detail))
        stream = done.stdout
    return stream


def build_payload(ndjson):
    """Split the frame stream into {report, features, frames}."""
    frames, features, report = [], {}, ""
    for line in ndjson.decode("utf-8", "replace").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            frame = json.loads(line)
        except ValueError:
            continue
        frames.append(frame)
        kind, role = frame.get("kind"), frame.get("role")
        if kind == "feature":
            features.setdefault(role or "feature", {}).update(frame.get("data") or {})
        elif kind == "text" and role == "report":
            report = frame.get("data") or ""
    if not frames:
        raise AnalyzeError(422, "smpl produced no frames for this input")
    return {"report": report, "features": features, "frames": frames}


def analyze_bytes(data, name):
    """Whole request path: bytes in, JSON-ready dict out. Leaves no files."""
    tmpdir = tempfile.mkdtemp(prefix="smpl-analyze-")
    try:
        target = os.path.join(tmpdir, safe_name(name))
        with open(target, "wb") as handle:
            handle.write(data)
        try:
            payload = build_payload(run_pipeline(target))
        except AnalyzeError as exc:
            raise AnalyzeError(exc.status, redact(exc.message, tmpdir))
        return json.loads(redact(json.dumps(payload), tmpdir))
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


class Handler(BaseHTTPRequestHandler):
    server_version = "smpl-analyze/" + VERSION
    protocol_version = "HTTP/1.1"

    def _send(self, status, body, ctype):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        if self.close_connection:
            self.send_header("Connection", "close")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, status, obj):
        self._send(status, json.dumps(obj).encode("utf-8") + b"\n",
                   "application/json; charset=utf-8")

    def _fail(self, status, message):
        # We answer these before reading the body, so the socket still holds
        # bytes we never consumed — close rather than mis-parse them.
        self.close_connection = True
        self._json(status, {"error": message})

    def do_GET(self):
        route = urlsplit(self.path).path
        if route == "/healthz":
            version = smpl_version()
            self._json(200, {"ok": True, "service": "smpl-analyze",
                             "version": VERSION, "smpl": version,
                             "pipeline": ["read"] + list(PIPELINE)})
        elif route in ("/", "/index.html"):
            try:
                with open(os.path.join(HERE, "index.html"), "rb") as handle:
                    self._send(200, handle.read(), "text/html; charset=utf-8")
            except OSError:
                self._fail(404, "landing page not found")
        else:
            self._fail(404, "no such route")

    def do_POST(self):
        parts = urlsplit(self.path)
        if parts.path != "/analyze":
            self._fail(404, "no such route")
            return
        ctype = self.headers.get("Content-Type", "").split(";")[0].strip().lower()
        if not ctype.startswith("audio/"):
            self._fail(415, "send raw audio bytes with an audio/* Content-Type")
            return
        try:
            length = int(self.headers.get("Content-Length", ""))
        except ValueError:
            self._fail(411, "a Content-Length header is required")
            return
        if length <= 0:
            self._fail(400, "empty request body")
            return
        if length > MAX_BODY:
            self.close_connection = True
            self._fail(413, "body exceeds the %d byte cap" % MAX_BODY)
            return
        data = self.rfile.read(length)
        if len(data) != length:
            self._fail(400, "request body was shorter than Content-Length")
            return
        name = (parse_qs(parts.query).get("name") or ["upload.wav"])[0]
        try:
            self._json(200, analyze_bytes(data, name))
        except AnalyzeError as exc:
            self._fail(exc.status, exc.message)

    def log_message(self, fmt, *args):  # one tidy line per request, no paths
        sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))


def main(argv):
    host = os.environ.get("SMPL_ANALYZE_HOST", "127.0.0.1")
    port = int(argv[1] if len(argv) > 1 else os.environ.get("SMPL_ANALYZE_PORT", "8791"))
    httpd = ThreadingHTTPServer((host, port), Handler)
    sys.stderr.write("smpl-analyze %s on http://%s:%d (smpl: %s)\n" %
                     (VERSION, host, port, smpl_version() or "MISSING"))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main(sys.argv)
