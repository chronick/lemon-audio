import { describe, it, expect } from "vitest";
import { parseMemoryDescriptor } from "../src/dfu-parse";

describe("parseMemoryDescriptor", () => {
  it("parses standard STM32H750 descriptor", () => {
    // Real descriptor from STM32H750 (Daisy Seed)
    const desc =
      "@Internal Flash  /0x08000000/01*128Ke";
    const info = parseMemoryDescriptor(desc);

    expect(info.name).toBe("Internal Flash");
    expect(info.segments).toHaveLength(1);

    const seg = info.segments[0];
    expect(seg.start).toBe(0x08000000);
    expect(seg.sectorSize).toBe(128 * 1024);
    expect(seg.end).toBe(0x08000000 + 128 * 1024);
    expect(seg.readable).toBe(true);
    expect(seg.erasable).toBe(false);
    expect(seg.writable).toBe(true);
  });

  it("parses multi-sector descriptor", () => {
    const desc =
      "@Internal Flash  /0x08000000/04*016Kg,01*064Kg,07*128Kg";
    const info = parseMemoryDescriptor(desc);

    expect(info.name).toBe("Internal Flash");
    expect(info.segments).toHaveLength(3);

    // 4 * 16K sectors, readable+erasable+writable (g=7)
    expect(info.segments[0].start).toBe(0x08000000);
    expect(info.segments[0].sectorSize).toBe(16 * 1024);
    expect(info.segments[0].end).toBe(0x08000000 + 4 * 16 * 1024);
    expect(info.segments[0].readable).toBe(true);
    expect(info.segments[0].erasable).toBe(true);
    expect(info.segments[0].writable).toBe(true);

    // 1 * 64K sector, starts after previous
    expect(info.segments[1].start).toBe(0x08000000 + 4 * 16 * 1024);
    expect(info.segments[1].sectorSize).toBe(64 * 1024);

    // 7 * 128K sectors, starts after 64K
    const seg2Start = 0x08000000 + 4 * 16 * 1024 + 64 * 1024;
    expect(info.segments[2].start).toBe(seg2Start);
    expect(info.segments[2].sectorSize).toBe(128 * 1024);
    expect(info.segments[2].end).toBe(seg2Start + 7 * 128 * 1024);
  });

  it("parses permission bits correctly", () => {
    // a=1(readable), b=2(erasable), c=3(r+e), d=4(writable),
    // e=5(r+w), f=6(e+w), g=7(r+e+w)
    const cases: Array<{
      letter: string;
      readable: boolean;
      erasable: boolean;
      writable: boolean;
    }> = [
      { letter: "a", readable: true, erasable: false, writable: false },
      { letter: "b", readable: false, erasable: true, writable: false },
      { letter: "c", readable: true, erasable: true, writable: false },
      { letter: "d", readable: false, erasable: false, writable: true },
      { letter: "e", readable: true, erasable: false, writable: true },
      { letter: "f", readable: false, erasable: true, writable: true },
      { letter: "g", readable: true, erasable: true, writable: true },
    ];

    for (const { letter, readable, erasable, writable } of cases) {
      const desc = `@Flash/0x08000000/01*128K${letter}`;
      const info = parseMemoryDescriptor(desc);
      const seg = info.segments[0];
      expect(seg.readable, `${letter}: readable`).toBe(readable);
      expect(seg.erasable, `${letter}: erasable`).toBe(erasable);
      expect(seg.writable, `${letter}: writable`).toBe(writable);
    }
  });

  it("handles byte multipliers", () => {
    // B = 1, K = 1024, M = 1048576, space = 1
    const descB = "@Flash/0x00000000/01*512Be";
    expect(parseMemoryDescriptor(descB).segments[0].sectorSize).toBe(512);

    const descK = "@Flash/0x00000000/01*064Ke";
    expect(parseMemoryDescriptor(descK).segments[0].sectorSize).toBe(
      64 * 1024
    );

    const descM = "@Flash/0x00000000/01*002Me";
    expect(parseMemoryDescriptor(descM).segments[0].sectorSize).toBe(
      2 * 1048576
    );
  });

  it("extracts name with whitespace", () => {
    const desc = "@Option Bytes  /0x1FF00000/01*032Be";
    const info = parseMemoryDescriptor(desc);
    expect(info.name).toBe("Option Bytes");
  });

  it("throws for invalid descriptor (no @)", () => {
    expect(() => parseMemoryDescriptor("Internal Flash/0x08000000/01*128Ke")).toThrow(
      "Not a DfuSe memory descriptor"
    );
  });

  it("throws for invalid descriptor (no /)", () => {
    expect(() => parseMemoryDescriptor("@InternalFlash")).toThrow(
      "Not a DfuSe memory descriptor"
    );
  });

  it("returns empty segments for malformed segment string", () => {
    const desc = "@Flash/garbage";
    const info = parseMemoryDescriptor(desc);
    expect(info.name).toBe("Flash");
    expect(info.segments).toHaveLength(0);
  });
});
