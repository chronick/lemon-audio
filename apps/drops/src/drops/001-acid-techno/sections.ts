/**
 * Section sequencer for DROP #001 — ACID TEKNO
 *
 * Captures snapshots of engine state, queues them for playback,
 * auto-advances at bar boundaries.
 */

import { LEMON_THEME as T } from "../../shared/theme.ts";
import type { AcidEngine, EngineState } from "./audio.ts";
import {
  KICK_PATTERNS,
  ACID_PATTERNS,
  SYNTH_PATTERNS,
  ATMO_PRESETS,
  STEPS,
} from "./patterns.ts";

// ── Types ────────────────────────────────────────────

export interface Section {
  id: string;
  name: string;
  bars: number;
  snapshot: EngineState;
}

export type LoopMode = "loop-all" | "loop-one" | "one-shot";

// ── Pattern lookup by name ───────────────────────────

function findPatternIndex(patterns: { name: string }[], name: string): number {
  const idx = patterns.findIndex((p) => p.name === name);
  return idx >= 0 ? idx : 0;
}

// ── Pre-built section snapshots ──────────────────────

function makeSnapshot(
  overrides: Partial<{
    bpm: number;
    kick: Partial<EngineState["kick"]>;
    perc: Partial<EngineState["perc"]>;
    acid: Partial<EngineState["acid"]>;
    synth: Partial<EngineState["synth"]>;
    atmo: Partial<EngineState["atmo"]>;
  }>
): EngineState {
  const base: EngineState = {
    playing: true,
    bpm: overrides.bpm ?? 138,
    currentStep: 0,
    kick: {
      muted: false, level: 0.8, patternIndex: 0, drive: 0.3,
      ...overrides.kick,
    },
    perc: {
      muted: false, level: 0.7, patternIndex: 0, tone: 0.5,
      ...overrides.perc,
    },
    acid: {
      muted: false, level: 0.75, patternIndex: 0, cutoff: 0.5, resonance: 0.6,
      ...overrides.acid,
    },
    synth: {
      muted: false, level: 0.5, patternIndex: 0, cutoff: 0.7, release: 0.4,
      ...overrides.synth,
    },
    atmo: {
      muted: false, level: 0.5, patternIndex: 0, reverb: 0.7,
      ...overrides.atmo,
    },
  };
  return base;
}

let idCounter = 0;
function nextId(): string {
  return `sec-${++idCounter}`;
}

export function getPresetSections(): Section[] {
  return [
    {
      id: nextId(),
      name: "MURK",
      bars: 4,
      snapshot: makeSnapshot({
        kick: {
          patternIndex: findPatternIndex(KICK_PATTERNS, "HEARTBEAT"),
          level: 0.4, drive: 0.1,
        },
        perc: { muted: true },
        acid: {
          patternIndex: findPatternIndex(ACID_PATTERNS, "DRIP"),
          level: 0.5, cutoff: 0.2, resonance: 0.7,
        },
        synth: { muted: true },
        atmo: {
          patternIndex: findPatternIndex(ATMO_PRESETS, "VOID"),
          level: 0.7, reverb: 0.9,
        },
      }),
    },
    {
      id: nextId(),
      name: "EMERGE",
      bars: 4,
      snapshot: makeSnapshot({
        kick: {
          patternIndex: findPatternIndex(KICK_PATTERNS, "STUMBLE"),
          level: 0.7, drive: 0.3,
        },
        perc: { level: 0.3, tone: 0.7 },
        acid: {
          patternIndex: findPatternIndex(ACID_PATTERNS, "CRAWL"),
          level: 0.6, cutoff: 0.4, resonance: 0.6,
        },
        synth: {
          patternIndex: findPatternIndex(SYNTH_PATTERNS, "FLICKER"),
          level: 0.3, cutoff: 0.5,
        },
        atmo: {
          patternIndex: findPatternIndex(ATMO_PRESETS, "BREATH"),
          level: 0.4, reverb: 0.7,
        },
      }),
    },
    {
      id: nextId(),
      name: "MELT",
      bars: 8,
      snapshot: makeSnapshot({
        kick: {
          patternIndex: findPatternIndex(KICK_PATTERNS, "POUNDING"),
          level: 1.0, drive: 0.7,
        },
        perc: { level: 0.8, tone: 0.4 },
        acid: {
          patternIndex: findPatternIndex(ACID_PATTERNS, "RELENTLESS"),
          level: 0.9, cutoff: 0.8, resonance: 0.8,
        },
        synth: {
          patternIndex: findPatternIndex(SYNTH_PATTERNS, "RHYTHMIC"),
          level: 0.5, cutoff: 0.9,
        },
        atmo: { muted: true },
      }),
    },
  ];
}

// ── Section Sequencer ────────────────────────────────

export class SectionSequencer {
  sections: Section[] = [];
  currentIndex = -1;
  currentBar = 0;
  loopMode: LoopMode = "loop-all";
  private stepInBar = 0;
  private onChangeCallbacks: (() => void)[] = [];
  private engine: AcidEngine;

  constructor(engine: AcidEngine) {
    this.engine = engine;
  }

  /** Subscribe to section changes */
  onChange(cb: () => void) {
    this.onChangeCallbacks.push(cb);
  }

  private notify() {
    for (const cb of this.onChangeCallbacks) cb();
  }

  /** Capture current engine state as a new section */
  captureSection(name: string, bars: number): Section {
    const section: Section = {
      id: nextId(),
      name,
      bars,
      snapshot: this.engine.getSnapshot(),
    };
    this.sections.push(section);
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    this.notify();
    return section;
  }

  addSection(section: Section) {
    this.sections.push(section);
    if (this.currentIndex < 0) this.currentIndex = 0;
    this.notify();
  }

  removeSection(id: string) {
    const idx = this.sections.findIndex((s) => s.id === id);
    if (idx < 0) return;
    this.sections.splice(idx, 1);
    if (this.currentIndex >= this.sections.length) {
      this.currentIndex = Math.max(0, this.sections.length - 1);
    }
    if (this.sections.length === 0) this.currentIndex = -1;
    this.notify();
  }

  moveSection(fromIdx: number, toIdx: number) {
    if (fromIdx < 0 || fromIdx >= this.sections.length) return;
    toIdx = Math.max(0, Math.min(this.sections.length - 1, toIdx));
    const [section] = this.sections.splice(fromIdx, 1);
    this.sections.splice(toIdx, 0, section);
    // Track current
    if (this.currentIndex === fromIdx) this.currentIndex = toIdx;
    this.notify();
  }

  jumpToSection(index: number) {
    if (index < 0 || index >= this.sections.length) return;
    this.currentIndex = index;
    this.currentBar = 0;
    this.stepInBar = 0;
    this.applyCurrentSection();
    this.notify();
  }

  /** Apply current section snapshot to engine */
  private applyCurrentSection() {
    const section = this.sections[this.currentIndex];
    if (!section) return;
    this.engine.applySnapshot(section.snapshot);
  }

  /** Called from engine step callback */
  onStep(step: number) {
    if (this.sections.length === 0 || this.currentIndex < 0) return;

    this.stepInBar++;
    // One bar = 16 steps (STEPS)
    if (step === 0 || this.stepInBar >= STEPS) {
      if (this.stepInBar >= STEPS) {
        this.stepInBar = 0;
        this.currentBar++;

        const section = this.sections[this.currentIndex];
        if (section && this.currentBar >= section.bars) {
          this.advanceSection();
        }
      }
    }
  }

  private advanceSection() {
    this.currentBar = 0;
    this.stepInBar = 0;

    if (this.loopMode === "loop-one") {
      // Stay on same section
      this.applyCurrentSection();
    } else if (this.currentIndex < this.sections.length - 1) {
      this.currentIndex++;
      this.applyCurrentSection();
    } else if (this.loopMode === "loop-all") {
      this.currentIndex = 0;
      this.applyCurrentSection();
    }
    // one-shot: just stop advancing
    this.notify();
  }

  toggleLoopMode() {
    const modes: LoopMode[] = ["loop-all", "loop-one", "one-shot"];
    const idx = modes.indexOf(this.loopMode);
    this.loopMode = modes[(idx + 1) % modes.length];
    this.notify();
  }

  /** Start sequencing from first section */
  start() {
    if (this.sections.length === 0) return;
    this.currentIndex = 0;
    this.currentBar = 0;
    this.stepInBar = 0;
    this.applyCurrentSection();
    this.notify();
  }

  get isActive(): boolean {
    return this.sections.length > 0 && this.currentIndex >= 0;
  }

  get progress(): number {
    const section = this.sections[this.currentIndex];
    if (!section) return 0;
    return this.currentBar / section.bars;
  }
}

// ── Timeline UI ──────────────────────────────────────

const SECTION_COLORS: Record<string, string> = {
  MURK: "#4466ff",
  EMERGE: T.neonGreen,
  MELT: T.neonPink,
};

function sectionColor(name: string): string {
  return SECTION_COLORS[name] || T.accent;
}

export function createSectionTimeline(
  sequencer: SectionSequencer,
  onSectionApplied?: () => void
): { element: HTMLElement; update: () => void; destroy: () => void } {

  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    width:100%;max-width:900px;
    border:1px solid rgba(204,255,0,0.1);
    background:rgba(204,255,0,0.02);
    padding:0.5rem 0.8rem;
    display:flex;flex-direction:column;gap:0.4rem;
  `;

  // Controls row
  const controls = document.createElement("div");
  controls.style.cssText = `display:flex;align-items:center;gap:0.5rem;`;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "+SAVE";
  saveBtn.style.cssText = `
    background:none;border:1px solid ${T.neonGreen};color:${T.neonGreen};
    font-family:${T.fontMono};font-size:0.6rem;padding:0.2rem 0.5rem;
    cursor:pointer;white-space:nowrap;
  `;
  controls.appendChild(saveBtn);

  const timeline = document.createElement("div");
  timeline.style.cssText = `display:flex;gap:3px;flex:1;min-height:36px;align-items:stretch;`;
  controls.appendChild(timeline);

  const loopBtn = document.createElement("button");
  loopBtn.style.cssText = `
    background:none;border:1px solid ${T.textDim};color:${T.textDim};
    font-family:${T.fontMono};font-size:0.55rem;padding:0.2rem 0.4rem;
    cursor:pointer;white-space:nowrap;
  `;
  controls.appendChild(loopBtn);

  wrapper.appendChild(controls);

  // Edit area (shown when editing a section)
  const editArea = document.createElement("div");
  editArea.style.cssText = `display:none;gap:0.5rem;align-items:center;font-size:0.55rem;color:${T.textDim};font-family:${T.fontMono};`;
  wrapper.appendChild(editArea);

  let editingId: string | null = null;

  function renderTimeline() {
    timeline.innerHTML = "";

    if (sequencer.sections.length === 0) {
      const empty = document.createElement("div");
      empty.style.cssText = `color:${T.textDim};font-size:0.55rem;font-family:${T.fontMono};padding:0.5rem;`;
      empty.textContent = "No sections — click +SAVE to capture current state";
      timeline.appendChild(empty);
      return;
    }

    sequencer.sections.forEach((section, idx) => {
      const block = document.createElement("div");
      const color = sectionColor(section.name);
      const isCurrent = idx === sequencer.currentIndex;

      block.style.cssText = `
        flex:${section.bars};min-width:50px;
        border:1px solid ${isCurrent ? color : "rgba(255,255,255,0.1)"};
        background:${isCurrent ? color + "15" : "rgba(255,255,255,0.02)"};
        padding:0.2rem 0.4rem;cursor:pointer;position:relative;
        display:flex;flex-direction:column;justify-content:center;
        transition:all 0.15s;
      `;

      // Name + bars
      const label = document.createElement("div");
      label.style.cssText = `font-size:0.55rem;font-family:${T.fontMono};color:${color};white-space:nowrap;overflow:hidden;`;
      label.textContent = `${section.name}`;
      block.appendChild(label);

      const barsLabel = document.createElement("div");
      barsLabel.style.cssText = `font-size:0.45rem;color:${T.textDim};font-family:${T.fontMono};`;
      barsLabel.textContent = `${section.bars} bars`;
      block.appendChild(barsLabel);

      // Progress bar (only for current section)
      if (isCurrent) {
        const progress = document.createElement("div");
        progress.style.cssText = `
          position:absolute;bottom:0;left:0;height:2px;
          background:${color};transition:width 0.1s;
          box-shadow:0 0 4px ${color};
        `;
        progress.style.width = `${sequencer.progress * 100}%`;
        progress.className = "section-progress";
        block.appendChild(progress);
      }

      // Click to jump
      block.addEventListener("click", (e) => {
        if ((e as MouseEvent).shiftKey) {
          // Shift-click to edit
          showEdit(section);
          return;
        }
        sequencer.jumpToSection(idx);
        onSectionApplied?.();
        renderTimeline();
      });

      // Right-click context: delete
      block.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showEdit(section);
      });

      timeline.appendChild(block);
    });
  }

  function showEdit(section: Section) {
    editingId = section.id;
    editArea.style.display = "flex";
    editArea.innerHTML = `
      <span>Edit:</span>
      <input type="text" value="${section.name}" style="
        width:80px;background:rgba(255,255,255,0.05);border:1px solid ${T.textDim};
        color:${T.accent};font-family:${T.fontMono};font-size:0.55rem;padding:2px 4px;
      " data-field="name">
      <span>Bars:</span>
      <input type="number" value="${section.bars}" min="1" max="32" style="
        width:40px;background:rgba(255,255,255,0.05);border:1px solid ${T.textDim};
        color:${T.accent};font-family:${T.fontMono};font-size:0.55rem;padding:2px 4px;text-align:center;
      " data-field="bars">
      <button data-action="update" style="background:none;border:1px solid ${T.neonGreen};color:${T.neonGreen};font-family:${T.fontMono};font-size:0.5rem;padding:2px 6px;cursor:pointer;">UPDATE</button>
      <button data-action="delete" style="background:none;border:1px solid ${T.neonPink};color:${T.neonPink};font-family:${T.fontMono};font-size:0.5rem;padding:2px 6px;cursor:pointer;">DEL</button>
      <button data-action="close" style="background:none;border:1px solid ${T.textDim};color:${T.textDim};font-family:${T.fontMono};font-size:0.5rem;padding:2px 6px;cursor:pointer;">×</button>
    `;

    editArea.onclick = (e) => {
      const target = e.target as HTMLElement;
      const action = target.dataset.action;
      if (!action || !editingId) return;

      const sec = sequencer.sections.find((s) => s.id === editingId);
      if (!sec) return;

      if (action === "update") {
        const nameInput = editArea.querySelector('[data-field="name"]') as HTMLInputElement;
        const barsInput = editArea.querySelector('[data-field="bars"]') as HTMLInputElement;
        sec.name = nameInput.value.toUpperCase();
        sec.bars = Math.max(1, parseInt(barsInput.value) || 4);
        // Re-capture current state
        const snap = sequencer["engine"].getSnapshot();
        sec.snapshot = snap;
        renderTimeline();
      } else if (action === "delete") {
        sequencer.removeSection(editingId);
        renderTimeline();
      }

      if (action === "close" || action === "delete" || action === "update") {
        editingId = null;
        editArea.style.display = "none";
      }
    };
  }

  function updateLoopBtn() {
    const labels: Record<LoopMode, string> = {
      "loop-all": "LOOP:ALL",
      "loop-one": "LOOP:ONE",
      "one-shot": "ONE-SHOT",
    };
    loopBtn.textContent = labels[sequencer.loopMode];
  }

  // Save button
  saveBtn.addEventListener("click", () => {
    const name = `SEC ${sequencer.sections.length + 1}`;
    sequencer.captureSection(name, 4);
    renderTimeline();
  });

  // Loop mode toggle
  loopBtn.addEventListener("click", () => {
    sequencer.toggleLoopMode();
    updateLoopBtn();
  });

  // Subscribe to sequencer changes
  sequencer.onChange(() => {
    renderTimeline();
    onSectionApplied?.();
  });

  // Initial render
  renderTimeline();
  updateLoopBtn();

  return {
    element: wrapper,
    update() {
      // Update progress bar
      const progressEl = timeline.querySelector(".section-progress") as HTMLElement;
      if (progressEl) {
        progressEl.style.width = `${sequencer.progress * 100}%`;
      }
    },
    destroy() {},
  };
}
