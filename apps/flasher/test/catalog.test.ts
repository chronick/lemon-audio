import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resolveRelease, allControls, type CatalogEntry } from "../src/catalog";

const baseEntry: CatalogEntry = {
  id: "qpas-ish",
  name: "QPAS-ish",
  description: "Quad-peak animated filter",
  platform: "patch-init",
  repo: "chronick/qpas-ish",
  asset: "qpas-ish.bin",
  controls: {
    knobs: ["freq", "resonance"],
    cv: ["freq-cv"],
    audio: ["in-L", "out-L"],
  },
};

function mockRelease(tagName: string, assets: Array<{ name: string }>) {
  return {
    tag_name: tagName,
    assets: assets.map((a) => ({
      name: a.name,
      browser_download_url: `https://github.com/test/releases/download/${tagName}/${a.name}`,
    })),
  };
}

describe("resolveRelease", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("resolves latest release with matching asset", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRelease("v0.1.0", [{ name: "qpas-ish.bin" }])),
    }) as unknown as typeof fetch;

    const result = await resolveRelease(baseEntry);

    expect(result).not.toBeNull();
    expect(result!.version).toBe("0.1.0");
    expect(result!.tag).toBe("v0.1.0");
    expect(result!.downloadUrl).toContain("qpas-ish.bin");
    expect(result!.id).toBe("qpas-ish");
  });

  it("strips v prefix from tag for version", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRelease("v2.3.1", [{ name: "qpas-ish.bin" }])),
    }) as unknown as typeof fetch;

    const result = await resolveRelease(baseEntry);
    expect(result!.version).toBe("2.3.1");
  });

  it("handles tag without v prefix", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRelease("1.0.0", [{ name: "qpas-ish.bin" }])),
    }) as unknown as typeof fetch;

    const result = await resolveRelease(baseEntry);
    expect(result!.version).toBe("1.0.0");
    expect(result!.tag).toBe("1.0.0");
  });

  it("returns null when release has no matching asset", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRelease("v1.0.0", [{ name: "wrong.bin" }])),
    }) as unknown as typeof fetch;

    const result = await resolveRelease(baseEntry);
    expect(result).toBeNull();
  });

  it("returns null when API returns 404", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }) as unknown as typeof fetch;

    const result = await resolveRelease(baseEntry);
    expect(result).toBeNull();
  });

  it("returns null on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(
      new Error("Network error")
    ) as unknown as typeof fetch;

    const result = await resolveRelease(baseEntry);
    expect(result).toBeNull();
  });
});

describe("allControls", () => {
  it("flattens all control categories", () => {
    const result = allControls({
      knobs: ["a", "b"],
      cv: ["c"],
      gate: ["d"],
      audio: ["e", "f"],
    });
    expect(result).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  it("handles missing categories", () => {
    const result = allControls({ knobs: ["a"] });
    expect(result).toEqual(["a"]);
  });

  it("returns empty for no controls", () => {
    expect(allControls({})).toEqual([]);
  });
});
