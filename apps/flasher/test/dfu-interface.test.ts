import { describe, it, expect } from "vitest";
import { findDeviceDfuInterfaces } from "../src/dfu";

function makeAlternate(
  interfaceClass: number,
  interfaceSubclass: number,
  interfaceProtocol: number,
  interfaceName: string | null = null
) {
  return {
    alternateSetting: 0,
    interfaceClass,
    interfaceSubclass,
    interfaceProtocol,
    interfaceName,
  };
}

function makeDevice(
  alternates: ReturnType<typeof makeAlternate>[]
): USBDevice {
  return {
    configurations: [
      {
        configurationValue: 1,
        interfaces: alternates.map((alt, i) => ({
          interfaceNumber: i,
          alternate: alt,
          alternates: [alt],
          claimed: false,
        })),
      },
    ],
  } as unknown as USBDevice;
}

describe("findDeviceDfuInterfaces", () => {
  it("finds DFU mode interface (protocol 0x02)", () => {
    const device = makeDevice([makeAlternate(0xfe, 0x01, 0x02)]);
    const result = findDeviceDfuInterfaces(device);
    expect(result).toHaveLength(1);
    expect(result[0].alternate.interfaceProtocol).toBe(0x02);
  });

  it("finds runtime interface (protocol 0x01)", () => {
    const device = makeDevice([makeAlternate(0xfe, 0x01, 0x01)]);
    const result = findDeviceDfuInterfaces(device);
    expect(result).toHaveLength(1);
  });

  it("skips non-DFU interfaces", () => {
    const device = makeDevice([
      makeAlternate(0x02, 0x02, 0x01), // CDC
      makeAlternate(0x03, 0x01, 0x01), // HID
      makeAlternate(0xfe, 0x01, 0x02), // DFU
    ]);
    const result = findDeviceDfuInterfaces(device);
    expect(result).toHaveLength(1);
  });

  it("returns empty for device with no DFU interfaces", () => {
    const device = makeDevice([makeAlternate(0x03, 0x01, 0x01)]);
    expect(findDeviceDfuInterfaces(device)).toHaveLength(0);
  });

  it("excludes protocol 0x00", () => {
    const device = makeDevice([makeAlternate(0xfe, 0x01, 0x00)]);
    expect(findDeviceDfuInterfaces(device)).toHaveLength(0);
  });

  it("returns multiple DFU alternates", () => {
    const device = makeDevice([
      makeAlternate(0xfe, 0x01, 0x02, "@Internal Flash"),
      makeAlternate(0xfe, 0x01, 0x02, "@Option Bytes"),
    ]);
    const result = findDeviceDfuInterfaces(device);
    expect(result).toHaveLength(2);
  });
});
