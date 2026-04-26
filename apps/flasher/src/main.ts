import "./style.css";
import {
  DfuDevice,
  findDeviceDfuInterfaces,
  dfuERROR,
  type DfuProperties,
} from "./dfu";
import {
  resolveRelease,
  allControls,
  type CatalogEntry,
  type FirmwareEntry,
} from "./catalog";

// STM32 DFU VID/PID
const STM_VID = 0x0483;
const STM_DFU_PID = 0xdf11;
// STM32H750 flash start
const FLASH_START = 0x08000000;

let firmware: FirmwareEntry[] = [];
let selectedFirmware: FirmwareEntry | null = null;
let dfuDevice: DfuDevice | null = null;
let dfuProperties: DfuProperties | null = null;

// --- DOM refs ---
const firmwareListEl = document.getElementById("firmware-list")!;
const connectBtn = document.getElementById("connect-btn") as HTMLButtonElement;
const flashBtn = document.getElementById("flash-btn") as HTMLButtonElement;
const deviceInfoEl = document.getElementById("device-info")!;
const progressFill = document.getElementById("progress-fill")!;
const progressText = document.getElementById("progress-text")!;
const statusLog = document.getElementById("status-log")!;
const browserWarning = document.getElementById("browser-warning")!;

// --- Init ---
async function init() {
  if (!navigator.usb) {
    browserWarning.style.display = "block";
    connectBtn.disabled = true;
    return;
  }

  navigator.usb.addEventListener("disconnect", (event) => {
    if (dfuDevice && dfuDevice.usbDevice === event.device) {
      dfuDevice.disconnected = true;
      onDisconnect("Device disconnected");
    }
  });

  await loadFirmware();
}

// --- Catalog + GitHub releases ---
async function loadFirmware() {
  firmwareListEl.innerHTML = `<div class="no-firmware">Loading firmware catalog...</div>`;

  let catalog: CatalogEntry[];
  try {
    const resp = await fetch("firmware/catalog.json");
    catalog = await resp.json();
  } catch {
    catalog = [];
  }

  // Fetch latest release for each repo in parallel
  const resolved = await Promise.all(catalog.map(resolveRelease));
  firmware = resolved.filter((fw): fw is FirmwareEntry => fw !== null);
  renderCatalog();
}

// --- Render ---
function renderCatalog() {
  if (firmware.length === 0) {
    firmwareListEl.innerHTML = `
      <div class="no-firmware">
        No firmware releases found.<code>Publish a GitHub release with a .bin asset</code>
      </div>`;
    return;
  }

  firmwareListEl.innerHTML = firmware
    .map(
      (fw) => `
    <div class="firmware-card" data-id="${fw.id}">
      <div class="firmware-card-header">
        <h3>${fw.name}</h3>
        <span class="version">v${fw.version}</span>
        <span class="platform">${fw.platform}</span>
      </div>
      <p>${fw.description}</p>
      <div class="firmware-controls">
        ${allControls(fw.controls)
          .map((c) => `<span>${c}</span>`)
          .join("")}
      </div>
    </div>`
    )
    .join("");

  firmwareListEl.querySelectorAll(".firmware-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectFirmware((card as HTMLElement).dataset.id!);
    });
  });
}

function selectFirmware(id: string) {
  selectedFirmware = firmware.find((fw) => fw.id === id) ?? null;

  firmwareListEl.querySelectorAll(".firmware-card").forEach((card) => {
    card.classList.toggle(
      "selected",
      (card as HTMLElement).dataset.id === id
    );
  });

  updateFlashButton();
}

// --- Connection ---
connectBtn.addEventListener("click", async () => {
  if (dfuDevice) {
    await dfuDevice.close();
    onDisconnect();
    return;
  }

  try {
    const usbDevice = await navigator.usb.requestDevice({
      filters: [{ vendorId: STM_VID, productId: STM_DFU_PID }],
    });

    const interfaces = findDeviceDfuInterfaces(usbDevice);
    if (interfaces.length === 0) {
      log("error", "No DFU interface found on selected device.");
      return;
    }

    const settings = interfaces[0];
    dfuDevice = new DfuDevice(usbDevice, settings);

    dfuDevice.logDebug = (msg) => console.log(msg);
    dfuDevice.logInfo = (msg) => log("info", msg);
    dfuDevice.logWarning = (msg) => log("warning", msg);
    dfuDevice.logError = (msg) => log("error", msg);
    dfuDevice.logProgress = onProgress;

    await dfuDevice.open();

    dfuProperties = await dfuDevice.getDfuDescriptorProperties();
    if (dfuProperties) {
      dfuDevice.properties = dfuProperties;
    }

    if (dfuDevice.isDfuSe) {
      const segment = dfuDevice.getFirstWritableSegment();
      dfuDevice.startAddress = segment ? segment.start : FLASH_START;
    }

    onConnect();
  } catch (e) {
    if ((e as Error).name === "NotFoundError") return;
    log("error", `Connection failed: ${e}`);
  }
});

function onConnect() {
  if (!dfuDevice) return;
  const dev = dfuDevice.usbDevice;

  connectBtn.textContent = "DISCONNECT";

  const isDfuSe = dfuDevice.isDfuSe;
  const xferSize = dfuProperties?.TransferSize ?? 2048;

  deviceInfoEl.style.display = "block";
  deviceInfoEl.innerHTML = `
    <span class="label">Device:</span> <span class="value">${dev.productName ?? "STM32 DFU"}</span><br>
    <span class="label">Serial:</span> <span class="value">${dev.serialNumber ?? "n/a"}</span><br>
    <span class="label">Protocol:</span> <span class="value">${isDfuSe ? "DfuSe" : "DFU"}</span>
    <span class="label">Transfer:</span> <span class="value">${xferSize}B</span>
    ${dfuDevice.isDfuSe ? `<br><span class="label">Address:</span> <span class="value">0x${dfuDevice.startAddress.toString(16)}</span>` : ""}
  `;

  log("info", `Connected: ${dev.productName ?? "DFU device"}`);
  updateFlashButton();
}

function onDisconnect(reason?: string) {
  dfuDevice = null;
  dfuProperties = null;
  connectBtn.textContent = "CONNECT";
  deviceInfoEl.style.display = "none";
  deviceInfoEl.innerHTML = "";
  resetProgress();
  updateFlashButton();
  if (reason) log("info", reason);
}

function updateFlashButton() {
  flashBtn.disabled = !dfuDevice || !selectedFirmware;
}

// --- Flash ---
flashBtn.addEventListener("click", async () => {
  if (!dfuDevice || !selectedFirmware) return;

  flashBtn.disabled = true;
  connectBtn.disabled = true;
  clearLog();
  resetProgress();

  try {
    log("info", `Downloading ${selectedFirmware.name} v${selectedFirmware.version}...`);
    const resp = await fetch(selectedFirmware.downloadUrl);
    if (!resp.ok) {
      throw new Error(`Firmware download failed (${resp.status})`);
    }
    const fw = await resp.arrayBuffer();
    log("info", `Firmware loaded: ${fw.byteLength} bytes`);

    try {
      const status = await dfuDevice.getStatus();
      if (status.state === dfuERROR) {
        await dfuDevice.clearStatus();
      }
    } catch {
      log("warning", "Could not clear device status");
    }

    const xferSize = dfuProperties?.TransferSize ?? 2048;
    const manifestationTolerant =
      dfuProperties?.ManifestationTolerant ?? false;

    await dfuDevice.flash(fw, xferSize, manifestationTolerant);

    log("success", "Flash complete! Device is running new firmware.");
  } catch (e) {
    log("error", `Flash failed: ${e}`);
  } finally {
    flashBtn.disabled = false;
    connectBtn.disabled = false;
    updateFlashButton();
  }
});

// --- Progress ---
function onProgress(done: number, total?: number) {
  if (total !== undefined && total > 0) {
    const pct = Math.round((done / total) * 100);
    progressFill.style.width = `${pct}%`;
    progressText.textContent = `${done} / ${total} bytes (${pct}%)`;
  } else {
    progressText.textContent = `${done} bytes`;
  }
}

function resetProgress() {
  progressFill.style.width = "0%";
  progressText.textContent = "";
}

// --- Logging ---
function log(level: "info" | "warning" | "error" | "success", msg: string) {
  const p = document.createElement("p");
  p.className = level;
  p.textContent = msg;
  statusLog.appendChild(p);
  statusLog.scrollTop = statusLog.scrollHeight;
}

function clearLog() {
  statusLog.innerHTML = "";
}

// --- Go ---
init();
