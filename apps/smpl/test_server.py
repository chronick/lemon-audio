#!/usr/bin/env python3
"""Tests for the smpl analyze endpoint. Stdlib unittest; needs smpl on PATH.

    python test_server.py

The reference asset is the four-second loop shipped in the smpl repo. It is
found via $SMPL_LOOP_WAV, else a sibling checkout of chronick/smpl.
"""

import http.client
import json
import os
import threading
import unittest
from http.server import ThreadingHTTPServer

import server

HERE = os.path.dirname(os.path.abspath(__file__))
LOOP_WAV = os.environ.get("SMPL_LOOP_WAV") or os.path.normpath(
    os.path.join(HERE, "..", "..", "..", "smpl", "docs", "assets", "loop.wav"))

_httpd = None
_thread = None


def setUpModule():
    global _httpd, _thread
    _httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
    _thread = threading.Thread(target=_httpd.serve_forever, daemon=True)
    _thread.start()


def tearDownModule():
    _httpd.shutdown()
    _thread.join(timeout=10)
    _httpd.server_close()


def request(method, path, body=None, headers=None, declared_length=None):
    conn = http.client.HTTPConnection(*_httpd.server_address, timeout=180)
    try:
        if declared_length is None:
            conn.request(method, path, body=body, headers=headers or {})
        else:  # declare a size without paying to send it — exercises the cap
            conn.putrequest(method, path)
            for key, value in (headers or {}).items():
                conn.putheader(key, value)
            conn.putheader("Content-Length", str(declared_length))
            conn.endheaders()
        response = conn.getresponse()
        return response.status, response.read()
    finally:
        conn.close()


class HealthTest(unittest.TestCase):
    def test_healthz(self):
        status, raw = request("GET", "/healthz")
        self.assertEqual(status, 200)
        body = json.loads(raw)
        self.assertTrue(body["ok"])
        self.assertEqual(body["pipeline"], ["read", "loudness", "spectral", "qc", "view"])
        self.assertIsNotNone(body["smpl"], "smpl CLI must be on PATH")

    def test_landing_page(self):
        status, raw = request("GET", "/")
        self.assertEqual(status, 200)
        self.assertIn(b"/analyze", raw)


class RejectionTest(unittest.TestCase):
    def test_bad_content_type(self):
        status, raw = request("POST", "/analyze", body=b"not audio",
                              headers={"Content-Type": "application/json"})
        self.assertEqual(status, 415)
        self.assertIn("audio/*", json.loads(raw)["error"])

    def test_oversized_body(self):
        status, raw = request("POST", "/analyze",
                              headers={"Content-Type": "audio/wav"},
                              declared_length=server.MAX_BODY + 1)
        self.assertEqual(status, 413)
        self.assertIn("cap", json.loads(raw)["error"])

    def test_unknown_route(self):
        self.assertEqual(request("GET", "/nope")[0], 404)


@unittest.skipUnless(os.path.exists(LOOP_WAV), "loop.wav not found: set $SMPL_LOOP_WAV")
class AnalyzeTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(LOOP_WAV, "rb") as handle:
            audio = handle.read()
        status, raw = request("POST", "/analyze?name=loop.wav", body=audio,
                              headers={"Content-Type": "audio/wav"})
        cls.status, cls.raw = status, raw
        cls.body = json.loads(raw) if status == 200 else {}

    def test_ok(self):
        self.assertEqual(self.status, 200, self.raw[:400])

    def test_loudness(self):
        loudness = self.body["features"]["loudness"]
        self.assertAlmostEqual(loudness["loudness.integrated_lufs"], -20.79, delta=0.1)
        self.assertAlmostEqual(loudness["loudness.true_peak_dbtp"], -6.71, delta=0.1)

    def test_spectral_and_qc_keys(self):
        spectral = self.body["features"]["spectral"]
        for key in ("lowlevel.spectral_flatness_db", "lowlevel.spectral_rolloff",
                    "lowlevel.spectral_crest", "lowlevel.spectral_contrast"):
            self.assertIn(key, spectral)
        qc = self.body["features"]["qc"]
        for key in ("qc.clipping.detected", "qc.dc_offset_dbfs", "qc.snr_db",
                    "qc.lossy.spectral_cutoff_hz"):
            self.assertIn(key, qc)

    def test_report_and_frames(self):
        self.assertIn("smpl analysis report", self.body["report"])
        self.assertGreaterEqual(len(self.body["frames"]), 5)

    def test_no_server_paths_leak(self):
        text = self.raw.decode("utf-8", "replace")
        self.assertNotIn(os.path.realpath(os.environ.get("TMPDIR", "/tmp")), text)
        self.assertIn("loop.wav", text)


if __name__ == "__main__":
    unittest.main(verbosity=2)
