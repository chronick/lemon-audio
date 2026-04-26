import { describe, it, expect, vi } from "vitest";
import { DfuDevice, dfuIDLE, dfuERROR } from "../src/dfu";
import {
  createMockUSBDevice,
  createMockDfuSettings,
  createStatusResponse,
  createStateResponse,
} from "./helpers/mock-usb";

function makeDevice(opts: { dfuseDescriptor?: string } = {}) {
  const usb = createMockUSBDevice({ dfuseDescriptor: opts.dfuseDescriptor });
  const settings = createMockDfuSettings(usb, {
    dfuseDescriptor: opts.dfuseDescriptor,
  });
  const dfu = new DfuDevice(usb as unknown as USBDevice, settings);
  dfu.logDebug = vi.fn();
  dfu.logInfo = vi.fn();
  dfu.logWarning = vi.fn();
  dfu.logError = vi.fn();
  dfu.logProgress = vi.fn();
  return { dfu, usb };
}

describe("DfuDevice", () => {
  describe("constructor", () => {
    it("detects DfuSe when name is a memory descriptor", () => {
      const { dfu } = makeDevice({
        dfuseDescriptor: "@Internal Flash  /0x08000000/01*128Ke",
      });
      expect(dfu.isDfuSe).toBe(true);
      expect(dfu.memoryMap).not.toBeNull();
      expect(dfu.memoryMap!.name).toBe("Internal Flash");
    });

    it("is not DfuSe for plain interface name", () => {
      const { dfu } = makeDevice();
      expect(dfu.isDfuSe).toBe(false);
      expect(dfu.memoryMap).toBeNull();
    });
  });

  describe("getStatus", () => {
    it("parses 6-byte status response", async () => {
      const { dfu, usb } = makeDevice();
      await dfu.open();

      const statusData = createStatusResponse(0x00, 100, dfuIDLE);
      usb.controlTransferIn.mockResolvedValueOnce({
        status: "ok",
        data: statusData,
      });

      const result = await dfu.getStatus();
      expect(result.status).toBe(0x00);
      expect(result.pollTimeout).toBe(100);
      expect(result.state).toBe(dfuIDLE);
    });

    it("masks pollTimeout to 24 bits", async () => {
      const { dfu, usb } = makeDevice();
      await dfu.open();

      // Write a pollTimeout with high byte set
      const buf = new ArrayBuffer(6);
      const view = new DataView(buf);
      view.setUint8(0, 0); // status OK
      view.setUint32(1, 0xff001234, true); // 32-bit LE, but only low 24 bits matter
      view.setUint8(4, dfuIDLE);

      usb.controlTransferIn.mockResolvedValueOnce({
        status: "ok",
        data: view,
      });

      const result = await dfu.getStatus();
      expect(result.pollTimeout).toBe(0x001234);
    });
  });

  describe("getState", () => {
    it("returns single byte state", async () => {
      const { dfu, usb } = makeDevice();
      await dfu.open();

      usb.controlTransferIn.mockResolvedValueOnce({
        status: "ok",
        data: createStateResponse(dfuIDLE),
      });

      const state = await dfu.getState();
      expect(state).toBe(dfuIDLE);
    });
  });

  describe("abortToIdle", () => {
    it("succeeds when device returns to idle", async () => {
      const { dfu, usb } = makeDevice();
      await dfu.open();

      // abort (controlTransferOut)
      usb.controlTransferOut.mockResolvedValueOnce({
        status: "ok",
        bytesWritten: 0,
      });
      // getState -> idle
      usb.controlTransferIn.mockResolvedValueOnce({
        status: "ok",
        data: createStateResponse(dfuIDLE),
      });

      await expect(dfu.abortToIdle()).resolves.toBeUndefined();
    });

    it("clears error state then returns to idle", async () => {
      const { dfu, usb } = makeDevice();
      await dfu.open();

      // abort
      usb.controlTransferOut.mockResolvedValueOnce({
        status: "ok",
        bytesWritten: 0,
      });
      // getState -> error
      usb.controlTransferIn.mockResolvedValueOnce({
        status: "ok",
        data: createStateResponse(dfuERROR),
      });
      // clearStatus
      usb.controlTransferOut.mockResolvedValueOnce({
        status: "ok",
        bytesWritten: 0,
      });
      // getState -> idle
      usb.controlTransferIn.mockResolvedValueOnce({
        status: "ok",
        data: createStateResponse(dfuIDLE),
      });

      await expect(dfu.abortToIdle()).resolves.toBeUndefined();
    });

    it("throws if stuck in non-idle state", async () => {
      const { dfu, usb } = makeDevice();
      await dfu.open();

      usb.controlTransferOut.mockResolvedValueOnce({
        status: "ok",
        bytesWritten: 0,
      });
      // getState -> some non-idle, non-error state (3 = DNLOAD_SYNC)
      usb.controlTransferIn.mockResolvedValueOnce({
        status: "ok",
        data: createStateResponse(3),
      });

      await expect(dfu.abortToIdle()).rejects.toThrow("Failed to return to idle");
    });
  });

  describe("open", () => {
    it("opens device and claims interface", async () => {
      const { dfu, usb } = makeDevice();
      await dfu.open();

      expect(usb.open).toHaveBeenCalled();
      expect(usb.claimInterface).toHaveBeenCalledWith(0);
    });
  });

  describe("getFirstWritableSegment", () => {
    it("returns first writable segment from DfuSe descriptor", () => {
      const { dfu } = makeDevice({
        dfuseDescriptor:
          "@Flash/0x08000000/04*016Ka,01*064Kg",
      });
      // First segment is read-only (a), second is r+e+w (g)
      const seg = dfu.getFirstWritableSegment();
      expect(seg).not.toBeNull();
      expect(seg!.start).toBe(0x08000000 + 4 * 16 * 1024);
      expect(seg!.writable).toBe(true);
    });

    it("returns null for non-DfuSe device", () => {
      const { dfu } = makeDevice();
      expect(dfu.getFirstWritableSegment()).toBeNull();
    });
  });
});
