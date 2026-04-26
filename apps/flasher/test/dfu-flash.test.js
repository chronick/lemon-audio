import { describe, it, expect, vi } from "vitest";
import { DfuDevice, STATUS_OK, dfuIDLE, dfuDNBUSY, dfuDNLOAD_IDLE, dfuMANIFEST, dfuMANIFEST_WAIT_RESET, } from "../src/dfu";
import { createMockUSBDevice, createMockDfuSettings, createStatusResponse, } from "./helpers/mock-usb";
function makeFlashDevice(opts = {}) {
    const usb = createMockUSBDevice({ dfuseDescriptor: opts.dfuseDescriptor });
    const settings = createMockDfuSettings(usb, {
        dfuseDescriptor: opts.dfuseDescriptor,
    });
    const dfu = new DfuDevice(usb, settings);
    dfu.logDebug = vi.fn();
    dfu.logInfo = vi.fn();
    dfu.logWarning = vi.fn();
    dfu.logError = vi.fn();
    dfu.logProgress = vi.fn();
    return { dfu, usb };
}
// Helper: queue a GETSTATUS response
function queueStatus(usb, status, pollTimeout, state) {
    usb.controlTransferIn.mockResolvedValueOnce({
        status: "ok",
        data: createStatusResponse(status, pollTimeout, state),
    });
}
// Helper: queue a successful DNLOAD + poll sequence for one chunk
function queueDnloadChunk(usb, chunkSize) {
    // controlTransferOut for DNLOAD
    usb.controlTransferOut.mockResolvedValueOnce({
        status: "ok",
        bytesWritten: chunkSize,
    });
    // GETSTATUS -> DNBUSY
    queueStatus(usb, STATUS_OK, 0, dfuDNBUSY);
    // GETSTATUS -> DNLOAD_IDLE
    queueStatus(usb, STATUS_OK, 0, dfuDNLOAD_IDLE);
}
describe("DfuDevice.flash (plain DFU)", () => {
    it("flashes firmware with correct block sequence", async () => {
        const { dfu, usb } = makeFlashDevice();
        await dfu.open();
        const firmware = new ArrayBuffer(4096);
        const xferSize = 2048;
        // Chunk 0
        queueDnloadChunk(usb, 2048);
        // Chunk 1
        queueDnloadChunk(usb, 2048);
        // Empty final block
        usb.controlTransferOut.mockResolvedValueOnce({
            status: "ok",
            bytesWritten: 0,
        });
        // Manifestation poll -> IDLE (tolerant)
        queueStatus(usb, STATUS_OK, 0, dfuIDLE);
        // device.reset()
        usb.reset.mockResolvedValueOnce(undefined);
        await dfu.flash(firmware, xferSize, true);
        // Verify DNLOAD calls: 2 data chunks + 1 empty
        const dnloadCalls = usb.controlTransferOut.mock.calls.filter((call) => call[0].request === 0x01);
        expect(dnloadCalls).toHaveLength(3);
    });
    it("reports progress during download", async () => {
        const { dfu, usb } = makeFlashDevice();
        await dfu.open();
        const firmware = new ArrayBuffer(2048);
        const xferSize = 1024;
        queueDnloadChunk(usb, 1024);
        queueDnloadChunk(usb, 1024);
        usb.controlTransferOut.mockResolvedValueOnce({
            status: "ok",
            bytesWritten: 0,
        });
        queueStatus(usb, STATUS_OK, 0, dfuIDLE);
        usb.reset.mockResolvedValueOnce(undefined);
        await dfu.flash(firmware, xferSize, true);
        const progressCalls = dfu.logProgress.mock
            .calls;
        // Initial 0, after chunk 1, after chunk 2
        expect(progressCalls).toContainEqual([0, 2048]);
        expect(progressCalls).toContainEqual([1024, 2048]);
        expect(progressCalls).toContainEqual([2048, 2048]);
    });
    it("handles non-manifestation-tolerant device", async () => {
        const { dfu, usb } = makeFlashDevice();
        await dfu.open();
        const firmware = new ArrayBuffer(1024);
        queueDnloadChunk(usb, 1024);
        usb.controlTransferOut.mockResolvedValueOnce({
            status: "ok",
            bytesWritten: 0,
        });
        // Single getStatus for manifestation
        queueStatus(usb, STATUS_OK, 0, dfuMANIFEST_WAIT_RESET);
        usb.reset.mockResolvedValueOnce(undefined);
        await dfu.flash(firmware, 2048, false);
        expect(usb.reset).toHaveBeenCalled();
    });
});
describe("DfuDevice.flash (DfuSe)", () => {
    const DFUSE_DESC = "@Internal Flash  /0x08000000/01*128Kg";
    it("erases then downloads with SET_ADDRESS commands", async () => {
        const { dfu, usb } = makeFlashDevice({ dfuseDescriptor: DFUSE_DESC });
        dfu.startAddress = 0x08000000;
        await dfu.open();
        const firmware = new ArrayBuffer(2048);
        const xferSize = 2048;
        // Erase: DNLOAD (erase command) + poll
        usb.controlTransferOut.mockResolvedValueOnce({
            status: "ok",
            bytesWritten: 5,
        });
        queueStatus(usb, STATUS_OK, 0, dfuDNLOAD_IDLE);
        // Download chunk: SET_ADDRESS command
        usb.controlTransferOut.mockResolvedValueOnce({
            status: "ok",
            bytesWritten: 5,
        });
        queueStatus(usb, STATUS_OK, 0, dfuDNLOAD_IDLE);
        // Actual data DNLOAD
        usb.controlTransferOut.mockResolvedValueOnce({
            status: "ok",
            bytesWritten: 2048,
        });
        queueStatus(usb, STATUS_OK, 0, dfuDNBUSY);
        queueStatus(usb, STATUS_OK, 0, dfuDNLOAD_IDLE);
        // Manifest: SET_ADDRESS
        usb.controlTransferOut.mockResolvedValueOnce({
            status: "ok",
            bytesWritten: 5,
        });
        queueStatus(usb, STATUS_OK, 0, dfuDNLOAD_IDLE);
        // Empty DNLOAD
        usb.controlTransferOut.mockResolvedValueOnce({
            status: "ok",
            bytesWritten: 0,
        });
        // Poll -> MANIFEST
        queueStatus(usb, STATUS_OK, 0, dfuMANIFEST);
        await dfu.flash(firmware, xferSize, false);
        expect(dfu.logInfo).toHaveBeenCalledWith(expect.stringContaining("Erasing"));
        expect(dfu.logInfo).toHaveBeenCalledWith(expect.stringContaining("Wrote 2048 bytes"));
    });
});
