/**
 * WebUSB DFU/DfuSe implementation
 * Ported from devanlai/webdfu (MIT license)
 * Supports USB DFU 1.1 and ST DfuSe 1.1a
 */

import { parseMemoryDescriptor, type MemoryInfo, type MemorySegment } from "./dfu-parse";
export { parseMemoryDescriptor, type MemoryInfo, type MemorySegment } from "./dfu-parse";

// DFU request codes
const DETACH = 0x00;
const DNLOAD = 0x01;
const UPLOAD = 0x02;
const GETSTATUS = 0x03;
const CLRSTATUS = 0x04;
const GETSTATE = 0x05;
const ABORT = 0x06;

// DFU states
export const dfuIDLE = 2;
export const dfuDNLOAD_SYNC = 3;
export const dfuDNBUSY = 4;
export const dfuDNLOAD_IDLE = 5;
export const dfuMANIFEST_SYNC = 6;
export const dfuMANIFEST = 7;
export const dfuMANIFEST_WAIT_RESET = 8;
export const dfuERROR = 10;
export const STATUS_OK = 0x00;

// DfuSe commands
const DFUSE_SET_ADDRESS = 0x21;
const DFUSE_ERASE_SECTOR = 0x41;

// USB DFU interface class/subclass
const USB_CLASS_APP_SPECIFIC = 0xfe;
const USB_SUBCLASS_DFU = 0x01;

export interface DfuInterfaceSettings {
  configuration: USBConfiguration;
  interface: USBInterface;
  alternate: USBAlternateInterface;
  name: string | null;
}

export interface DfuStatus {
  status: number;
  pollTimeout: number;
  state: number;
}

export interface DfuProperties {
  WillDetach: boolean;
  ManifestationTolerant: boolean;
  CanUpload: boolean;
  CanDnload: boolean;
  TransferSize: number;
  DetachTimeOut: number;
  DFUVersion: number;
}

export type LogFn = (msg: string) => void;
export type ProgressFn = (done: number, total?: number) => void;

export function findDeviceDfuInterfaces(
  device: USBDevice
): DfuInterfaceSettings[] {
  const interfaces: DfuInterfaceSettings[] = [];
  for (const conf of device.configurations) {
    for (const intf of conf.interfaces) {
      for (const alt of intf.alternates) {
        if (
          alt.interfaceClass === USB_CLASS_APP_SPECIFIC &&
          alt.interfaceSubclass === USB_SUBCLASS_DFU &&
          (alt.interfaceProtocol === 0x01 || alt.interfaceProtocol === 0x02)
        ) {
          interfaces.push({
            configuration: conf,
            interface: intf,
            alternate: alt,
            name: alt.interfaceName,
          });
        }
      }
    }
  }
  return interfaces;
}

function parseConfigurationDescriptor(data: DataView) {
  const descriptorData = new DataView(data.buffer.slice(9));
  const descriptors = parseSubDescriptors(descriptorData);
  return {
    bConfigurationValue: data.getUint8(5),
    descriptors,
  };
}

function parseSubDescriptors(descriptorData: DataView) {
  const DT_INTERFACE = 4;
  const DT_DFU_FUNCTIONAL = 0x21;
  let remaining = descriptorData;
  const descriptors: Array<{
    bDescriptorType: number;
    bInterfaceClass?: number;
    bInterfaceSubClass?: number;
    bmAttributes?: number;
    wDetachTimeOut?: number;
    wTransferSize?: number;
    bcdDFUVersion?: number;
  }> = [];
  let inDfuIntf = false;

  while (remaining.byteLength > 2) {
    const bLength = remaining.getUint8(0);
    const bDescriptorType = remaining.getUint8(1);
    const descData = new DataView(remaining.buffer.slice(0, bLength));

    if (bDescriptorType === DT_INTERFACE) {
      const bInterfaceClass = descData.getUint8(5);
      const bInterfaceSubClass = descData.getUint8(6);
      inDfuIntf =
        bInterfaceClass === USB_CLASS_APP_SPECIFIC &&
        bInterfaceSubClass === USB_SUBCLASS_DFU;
      descriptors.push({ bDescriptorType, bInterfaceClass, bInterfaceSubClass });
    } else if (inDfuIntf && bDescriptorType === DT_DFU_FUNCTIONAL) {
      descriptors.push({
        bDescriptorType,
        bmAttributes: descData.getUint8(2),
        wDetachTimeOut: descData.getUint16(3, true),
        wTransferSize: descData.getUint16(5, true),
        bcdDFUVersion: descData.getUint16(7, true),
      });
    } else {
      descriptors.push({ bDescriptorType });
    }

    remaining = new DataView(remaining.buffer.slice(bLength));
  }

  return descriptors;
}

export class DfuDevice {
  private device: USBDevice;
  private intfNumber: number;
  private settings: DfuInterfaceSettings;
  private memoryInfo: MemoryInfo | null = null;
  private _startAddress: number = NaN;
  properties: DfuProperties | null = null;
  disconnected = false;

  logDebug: LogFn = () => {};
  logInfo: LogFn = console.log;
  logWarning: LogFn = console.warn;
  logError: LogFn = console.error;
  logProgress: ProgressFn = () => {};

  constructor(device: USBDevice, settings: DfuInterfaceSettings) {
    this.device = device;
    this.settings = settings;
    this.intfNumber = settings.interface.interfaceNumber;

    if (settings.name) {
      try {
        this.memoryInfo = parseMemoryDescriptor(settings.name);
      } catch {
        // Not a DfuSe device or bad descriptor
      }
    }
  }

  get usbDevice(): USBDevice {
    return this.device;
  }

  get isDfuSe(): boolean {
    return this.memoryInfo !== null;
  }

  get startAddress(): number {
    return this._startAddress;
  }

  set startAddress(addr: number) {
    this._startAddress = addr;
  }

  get memoryMap(): MemoryInfo | null {
    return this.memoryInfo;
  }

  async open(): Promise<void> {
    await this.device.open();
    const confValue = this.settings.configuration.configurationValue;
    if (
      this.device.configuration === null ||
      this.device.configuration.configurationValue !== confValue
    ) {
      await this.device.selectConfiguration(confValue);
    }

    const intfNumber = this.settings.interface.interfaceNumber;
    if (!this.device.configuration!.interfaces[intfNumber].claimed) {
      await this.device.claimInterface(intfNumber);
    }

    const altSetting = this.settings.alternate.alternateSetting;
    const intf = this.device.configuration!.interfaces[intfNumber];
    if (
      intf.alternate === null ||
      intf.alternate.alternateSetting !== altSetting ||
      intf.alternates.length > 1
    ) {
      await this.device.selectAlternateInterface(intfNumber, altSetting);
    }
  }

  async close(): Promise<void> {
    try {
      await this.device.close();
    } catch (e) {
      console.log(e);
    }
  }

  private async requestOut(
    bRequest: number,
    data?: BufferSource,
    wValue = 0
  ): Promise<number> {
    const result = await this.device.controlTransferOut(
      {
        requestType: "class",
        recipient: "interface",
        request: bRequest,
        value: wValue,
        index: this.intfNumber,
      },
      data
    );
    if (result.status === "ok") return result.bytesWritten;
    throw new Error(`ControlTransferOut failed: ${result.status}`);
  }

  private async requestIn(
    bRequest: number,
    wLength: number,
    wValue = 0
  ): Promise<DataView> {
    const result = await this.device.controlTransferIn(
      {
        requestType: "class",
        recipient: "interface",
        request: bRequest,
        value: wValue,
        index: this.intfNumber,
      },
      wLength
    );
    if (result.status === "ok") return result.data!;
    throw new Error(`ControlTransferIn failed: ${result.status}`);
  }

  async detach(): Promise<void> {
    await this.requestOut(DETACH, undefined, 1000);
  }

  async download(data: BufferSource, blockNum: number): Promise<number> {
    return this.requestOut(DNLOAD, data, blockNum);
  }

  async upload(length: number, blockNum: number): Promise<DataView> {
    return this.requestIn(UPLOAD, length, blockNum);
  }

  async clearStatus(): Promise<void> {
    await this.requestOut(CLRSTATUS);
  }

  async getStatus(): Promise<DfuStatus> {
    const data = await this.requestIn(GETSTATUS, 6);
    return {
      status: data.getUint8(0),
      pollTimeout: data.getUint32(1, true) & 0xffffff,
      state: data.getUint8(4),
    };
  }

  async getState(): Promise<number> {
    const data = await this.requestIn(GETSTATE, 1);
    return data.getUint8(0);
  }

  async abort(): Promise<void> {
    await this.requestOut(ABORT);
  }

  async abortToIdle(): Promise<void> {
    await this.abort();
    let state = await this.getState();
    if (state === dfuERROR) {
      await this.clearStatus();
      state = await this.getState();
    }
    if (state !== dfuIDLE) {
      throw new Error(`Failed to return to idle state after abort: state ${state}`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async pollUntil(
    predicate: (state: number) => boolean
  ): Promise<DfuStatus> {
    let status = await this.getStatus();
    while (!predicate(status.state) && status.state !== dfuERROR) {
      await this.sleep(status.pollTimeout);
      status = await this.getStatus();
    }
    return status;
  }

  private async pollUntilIdle(idleState: number): Promise<DfuStatus> {
    return this.pollUntil((state) => state === idleState);
  }

  async readConfigurationDescriptor(index: number): Promise<DataView> {
    const GET_DESCRIPTOR = 0x06;
    const DT_CONFIGURATION = 0x02;
    const wValue = (DT_CONFIGURATION << 8) | index;
    const setup = {
      requestType: "standard" as const,
      recipient: "device" as const,
      request: GET_DESCRIPTOR,
      value: wValue,
      index: 0,
    };

    const result = await this.device.controlTransferIn(setup, 4);
    if (result.status !== "ok") throw new Error(result.status);
    const wLength = result.data!.getUint16(2, true);
    const full = await this.device.controlTransferIn(setup, wLength);
    if (full.status !== "ok") throw new Error(full.status);
    return full.data!;
  }

  async getDfuDescriptorProperties(): Promise<DfuProperties | null> {
    try {
      const data = await this.readConfigurationDescriptor(0);
      const configDesc = parseConfigurationDescriptor(data);
      const configValue = this.settings.configuration.configurationValue;
      if (configDesc.bConfigurationValue !== configValue) return null;

      for (const desc of configDesc.descriptors) {
        if (
          desc.bDescriptorType === 0x21 &&
          desc.bcdDFUVersion !== undefined
        ) {
          return {
            WillDetach: (desc.bmAttributes! & 0x08) !== 0,
            ManifestationTolerant: (desc.bmAttributes! & 0x04) !== 0,
            CanUpload: (desc.bmAttributes! & 0x02) !== 0,
            CanDnload: (desc.bmAttributes! & 0x01) !== 0,
            TransferSize: desc.wTransferSize!,
            DetachTimeOut: desc.wDetachTimeOut!,
            DFUVersion: desc.bcdDFUVersion,
          };
        }
      }
    } catch {
      // Could not read descriptor
    }
    return null;
  }

  // --- DfuSe methods ---

  private getSegment(addr: number): MemorySegment | null {
    if (!this.memoryInfo) return null;
    for (const segment of this.memoryInfo.segments) {
      if (segment.start <= addr && addr < segment.end) return segment;
    }
    return null;
  }

  getFirstWritableSegment(): MemorySegment | null {
    if (!this.memoryInfo) return null;
    for (const segment of this.memoryInfo.segments) {
      if (segment.writable) return segment;
    }
    return null;
  }

  private getSectorStart(addr: number, segment?: MemorySegment): number {
    const seg = segment ?? this.getSegment(addr);
    if (!seg)
      throw new Error(`Address 0x${addr.toString(16)} outside of memory map`);
    const sectorIndex = Math.floor((addr - seg.start) / seg.sectorSize);
    return seg.start + sectorIndex * seg.sectorSize;
  }

  private getSectorEnd(addr: number): number {
    const seg = this.getSegment(addr);
    if (!seg)
      throw new Error(`Address 0x${addr.toString(16)} outside of memory map`);
    const sectorIndex = Math.floor((addr - seg.start) / seg.sectorSize);
    return seg.start + (sectorIndex + 1) * seg.sectorSize;
  }

  private async dfuseCommand(
    command: number,
    param: number,
    len: number
  ): Promise<void> {
    const payload = new ArrayBuffer(len + 1);
    const view = new DataView(payload);
    view.setUint8(0, command);
    if (len === 1) {
      view.setUint8(1, param);
    } else if (len === 4) {
      view.setUint32(1, param, true);
    }

    await this.download(payload, 0);
    const status = await this.pollUntil((state) => state !== dfuDNBUSY);
    if (status.status !== STATUS_OK) {
      throw new Error(`DfuSe command failed: status=${status.status}`);
    }
  }

  private async erase(startAddr: number, length: number): Promise<void> {
    let segment = this.getSegment(startAddr);
    let addr = this.getSectorStart(startAddr, segment!);
    const endAddr = this.getSectorEnd(startAddr + length - 1);

    let bytesErased = 0;
    const bytesToErase = endAddr - addr;
    if (bytesToErase > 0) this.logProgress(bytesErased, bytesToErase);

    while (addr < endAddr) {
      if (segment && segment.end <= addr) {
        segment = this.getSegment(addr);
      }
      if (!segment || !segment.erasable) {
        if (segment) {
          bytesErased = Math.min(
            bytesErased + segment.end - addr,
            bytesToErase
          );
          addr = segment.end;
        }
        this.logProgress(bytesErased, bytesToErase);
        continue;
      }
      const sectorIndex = Math.floor(
        (addr - segment.start) / segment.sectorSize
      );
      const sectorAddr = segment.start + sectorIndex * segment.sectorSize;
      this.logDebug(
        `Erasing ${segment.sectorSize}B at 0x${sectorAddr.toString(16)}`
      );
      await this.dfuseCommand(DFUSE_ERASE_SECTOR, sectorAddr, 4);
      addr = sectorAddr + segment.sectorSize;
      bytesErased += segment.sectorSize;
      this.logProgress(bytesErased, bytesToErase);
    }
  }

  /**
   * Flash firmware to device. Handles both plain DFU and DfuSe.
   */
  async flash(
    data: ArrayBuffer,
    transferSize: number,
    manifestationTolerant: boolean
  ): Promise<void> {
    if (this.isDfuSe) {
      await this.flashDfuSe(data, transferSize);
    } else {
      await this.flashDfu(data, transferSize, manifestationTolerant);
    }
  }

  private async flashDfuSe(
    data: ArrayBuffer,
    xferSize: number
  ): Promise<void> {
    if (!this.memoryInfo) throw new Error("No memory map available");

    let startAddress = this._startAddress;
    if (isNaN(startAddress)) {
      startAddress = this.memoryInfo.segments[0].start;
      this.logWarning(
        `Using inferred start address 0x${startAddress.toString(16)}`
      );
    }

    this.logInfo("Erasing DFU device memory");
    await this.erase(startAddress, data.byteLength);

    this.logInfo("Copying data from browser to DFU device");
    let bytesSent = 0;
    const expectedSize = data.byteLength;
    let address = startAddress;

    while (bytesSent < expectedSize) {
      const bytesLeft = expectedSize - bytesSent;
      const chunkSize = Math.min(bytesLeft, xferSize);

      await this.dfuseCommand(DFUSE_SET_ADDRESS, address, 4);
      this.logDebug(`Set address to 0x${address.toString(16)}`);
      const bytesWritten = await this.download(
        data.slice(bytesSent, bytesSent + chunkSize),
        2
      );
      this.logDebug(`Sent ${bytesWritten} bytes`);
      const status = await this.pollUntilIdle(dfuDNLOAD_IDLE);
      if (status.status !== STATUS_OK) {
        throw new Error(
          `DFU DOWNLOAD failed state=${status.state}, status=${status.status}`
        );
      }

      address += chunkSize;
      bytesSent += bytesWritten;
      this.logProgress(bytesSent, expectedSize);
    }

    this.logInfo(`Wrote ${bytesSent} bytes`);
    this.logInfo("Manifesting new firmware");

    await this.dfuseCommand(DFUSE_SET_ADDRESS, startAddress, 4);
    await this.download(new ArrayBuffer(0), 0);

    try {
      await this.pollUntil((state) => state === dfuMANIFEST);
    } catch (e) {
      this.logDebug(`Manifest poll ended: ${e}`);
    }
  }

  private async flashDfu(
    data: ArrayBuffer,
    xferSize: number,
    manifestationTolerant: boolean
  ): Promise<void> {
    let bytesSent = 0;
    const expectedSize = data.byteLength;
    let transaction = 0;

    this.logInfo("Copying data from browser to DFU device");
    this.logProgress(bytesSent, expectedSize);

    while (bytesSent < expectedSize) {
      const bytesLeft = expectedSize - bytesSent;
      const chunkSize = Math.min(bytesLeft, xferSize);

      const bytesWritten = await this.download(
        data.slice(bytesSent, bytesSent + chunkSize),
        transaction++
      );
      const status = await this.pollUntilIdle(dfuDNLOAD_IDLE);
      if (status.status !== STATUS_OK) {
        throw new Error(
          `DFU DOWNLOAD failed state=${status.state}, status=${status.status}`
        );
      }

      bytesSent += bytesWritten;
      this.logProgress(bytesSent, expectedSize);
    }

    // Send empty block to signal end
    await this.download(new ArrayBuffer(0), transaction++);

    this.logInfo(`Wrote ${bytesSent} bytes`);
    this.logInfo("Manifesting new firmware");

    if (manifestationTolerant) {
      try {
        const status = await this.pollUntil(
          (state) =>
            state === dfuIDLE || state === dfuMANIFEST_WAIT_RESET
        );
        if (status.status !== STATUS_OK) {
          throw new Error(
            `DFU MANIFEST failed state=${status.state}, status=${status.status}`
          );
        }
      } catch (e) {
        this.logWarning(`Unable to poll final manifestation status: ${e}`);
      }
    } else {
      try {
        await this.getStatus();
      } catch {
        // Expected — device may disconnect
      }
    }

    try {
      await this.device.reset();
    } catch {
      // Expected — device disconnects after reset
    }
  }
}
