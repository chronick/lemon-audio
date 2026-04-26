import { vi } from "vitest";
import { STATUS_OK, dfuIDLE, dfuDNLOAD_IDLE, dfuDNBUSY, } from "../../src/dfu";
/**
 * Build a 6-byte DFU GETSTATUS response.
 * Layout: [status(1), pollTimeout(3 LE), state(1), iString(1)]
 */
export function createStatusResponse(status, pollTimeout, state) {
    const buf = new ArrayBuffer(6);
    const view = new DataView(buf);
    view.setUint8(0, status);
    // pollTimeout is 3 bytes LE packed into a 32-bit LE field
    view.setUint32(1, pollTimeout & 0xffffff, true);
    view.setUint8(4, state);
    view.setUint8(5, 0); // iString
    return view;
}
/** 1-byte GETSTATE response */
export function createStateResponse(state) {
    const buf = new ArrayBuffer(1);
    new DataView(buf).setUint8(0, state);
    return new DataView(buf);
}
/** A scripted controlTransferIn: returns responses in sequence */
export function scriptedTransferIn(responses) {
    let idx = 0;
    return vi.fn().mockImplementation(() => {
        if (idx >= responses.length) {
            return Promise.reject(new Error("No more scripted responses"));
        }
        return Promise.resolve(responses[idx++]);
    });
}
/** Standard "idle after busy" sequence for a download chunk */
export function downloadPollSequence() {
    return [
        // GETSTATUS -> DNBUSY with 0ms poll
        { status: "ok", data: createStatusResponse(STATUS_OK, 0, dfuDNBUSY) },
        // GETSTATUS -> DNLOAD_IDLE
        {
            status: "ok",
            data: createStatusResponse(STATUS_OK, 0, dfuDNLOAD_IDLE),
        },
    ];
}
export function createMockUSBDevice(opts = {}) {
    const alternate = {
        alternateSetting: 0,
        interfaceClass: 0xfe,
        interfaceSubclass: 0x01,
        interfaceProtocol: opts.interfaceProtocol ?? 0x02,
        interfaceName: opts.dfuseDescriptor ?? null,
    };
    const iface = {
        interfaceNumber: 0,
        alternate,
        alternates: [alternate],
        claimed: false,
    };
    const configuration = {
        configurationValue: 1,
        interfaces: [iface],
    };
    const device = {
        vendorId: opts.vendorId ?? 0x0483,
        productId: opts.productId ?? 0xdf11,
        productName: opts.productName ?? "STM32 DFU",
        serialNumber: opts.serialNumber ?? "TEST123",
        manufacturerName: "STMicroelectronics",
        configurations: [configuration],
        configuration,
        open: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined),
        reset: vi.fn().mockResolvedValue(undefined),
        selectConfiguration: vi.fn().mockResolvedValue(undefined),
        claimInterface: vi.fn().mockResolvedValue(undefined),
        selectAlternateInterface: vi.fn().mockResolvedValue(undefined),
        controlTransferIn: vi.fn().mockResolvedValue({ status: "ok", data: new DataView(new ArrayBuffer(0)) }),
        controlTransferOut: vi.fn().mockResolvedValue({ status: "ok", bytesWritten: 0 }),
    };
    return device;
}
export function createMockDfuSettings(device, opts = {}) {
    const config = device.configurations[0];
    const intf = config.interfaces[0];
    const alt = {
        ...intf.alternates[0],
        interfaceName: opts.dfuseDescriptor ?? intf.alternates[0].interfaceName,
        interfaceProtocol: opts.interfaceProtocol ?? intf.alternates[0].interfaceProtocol,
    };
    return {
        configuration: config,
        interface: intf,
        alternate: alt,
        name: alt.interfaceName,
    };
}
/** Idle status for simple mocks */
export const IDLE_STATUS = createStatusResponse(STATUS_OK, 0, dfuIDLE);
export const DNLOAD_IDLE_STATUS = createStatusResponse(STATUS_OK, 0, dfuDNLOAD_IDLE);
