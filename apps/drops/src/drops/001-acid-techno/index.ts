/**
 * DROP #001 — ACID TEKNO
 *
 * 303-style acid loops, synthesized drums, stab synths, ambient textures.
 * All Web Audio API — no samples needed.
 */

import type { Drop } from "../../shared/types.ts";
import { readPresetFromHash } from "../../shared/preset.ts";
import { AcidEngine, type EngineState } from "./audio.ts";
import { KICK_PATTERNS, ACID_PATTERNS, SYNTH_PATTERNS, ATMO_PRESETS } from "./patterns.ts";
import { renderUI, type UIHandle } from "./ui.ts";

const meta = {
  id: "001-acid-techno",
  number: 1,
  title: "ACID TEKNO",
  genre: "Acid Techno",
  description: "303-style acid loops with kick sequencer and SVG resonance controls",
  color: "#39FF14",
  date: "2026-03-01",
} as const;

let engine: AcidEngine | null = null;
let uiHandle: UIHandle | null = null;

function mount(container: HTMLElement): void {
  engine = new AcidEngine();
  engine.init(KICK_PATTERNS, ACID_PATTERNS, SYNTH_PATTERNS, ATMO_PRESETS);

  // Apply shared preset, if the URL carries one. Audio stays stopped
  // until the user clicks PLAY (browsers require a gesture anyway).
  const preset = readPresetFromHash<Partial<EngineState>>();
  if (preset) {
    const safe = { ...engine.state, ...preset, playing: false, currentStep: 0 } as EngineState;
    engine.applySnapshot(safe);
  }

  uiHandle = renderUI(container, engine);
  if (preset) uiHandle.syncFromEngine();
}

function destroy(): void {
  engine?.destroy();
  uiHandle?.cleanup();
  engine = null;
  uiHandle = null;
}

export default { meta, mount, destroy } satisfies Drop;
