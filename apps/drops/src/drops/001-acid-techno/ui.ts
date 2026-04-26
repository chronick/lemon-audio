/**
 * UI for DROP #001 — ACID TEKNO
 *
 * Channel strips + XY pads + section sequencer + LEMON_CHAN
 */

import { LEMON_THEME as T } from "../../shared/theme.ts";
import { buildShareUrl, stripPresetQuery } from "../../shared/preset.ts";
import type { AcidEngine } from "./audio.ts";
import {
  KICK_PATTERNS,
  ACID_PATTERNS,
  SYNTH_PATTERNS,
  ATMO_PRESETS,
} from "./patterns.ts";
import { createAcidXYPad, createPerformanceXYPad } from "./xy-controls.ts";
import {
  SectionSequencer,
  createSectionTimeline,
  getPresetSections,
} from "./sections.ts";

// ── LEMON_CHAN frames ────────────────────────────────────

const CHAN_IDLE = `
   ╭─────╮
  ╱ ◠   ◠ ╲
 │  ░     ░  │
 │    ω      │
  ╲         ╱
   ╰───┬───╯
    ╱│╲ ╱│╲
   ╱ │ ╳ │ ╲
     │   │
    ╱╲  ╱╲`;

const CHAN_VIBING = `
   ╭─────╮
  ╱ ◡   ◡ ╲
 │  ░     ░  │
 │    ▽      │
  ╲         ╱
   ╰───┬───╯
   ╲│╱  ╲│╱
    ╱╲   ╱╲
    │ ╲ ╱ │
   ╱╲  ╳  ╱╲`;

const CHAN_HYPED = `
   ╭─────╮
  ╱ ◉   ◉ ╲
 │  ░     ░  │
 │    ◇      │
  ╲         ╱
   ╰───┬───╯
  ──╱│╲─╱│╲──
   ╱ │ ╳ │ ╲
     │   │
    ╱ ╲ ╱ ╲`;

const CHAN_BOUNCING = `
   ╭─────╮
  ╱ ◠   ◠ ╲
 │  ░     ░  │
 │    ○      │
  ╲         ╱
   ╰───┬───╯
    │╲   ╱│
    │ ╲ ╱ │
    │  ╳  │
   ╱╲   ╱╲`;

const CHAN_ZEN = `
   ╭─────╮
  ╱ ─   ─ ╲
 │  ░     ░  │
 │    ω      │
  ╲    ~    ╱
   ╰───┬───╯
    │   │
    │   │
   ╱╲  ╱╲
  ╱  ╲╱  ╲`;

type ChannelName = "kick" | "perc" | "acid" | "synth" | "atmo";

interface ChannelConfig {
  name: string;
  label: string;
  color: string;
  patterns: { name: string }[];
  knobs: { label: string; param: string; initial: number }[];
}

const CHANNELS: Record<ChannelName, ChannelConfig> = {
  kick: {
    name: "kick",
    label: "KICK",
    color: T.neonPink,
    patterns: KICK_PATTERNS,
    knobs: [{ label: "DRIVE", param: "kickDrive", initial: 0.3 }],
  },
  perc: {
    name: "perc",
    label: "PERC",
    color: T.neonCyan,
    patterns: KICK_PATTERNS,
    knobs: [{ label: "TONE", param: "percTone", initial: 0.5 }],
  },
  acid: {
    name: "acid",
    label: "ACID",
    color: T.neonGreen,
    patterns: ACID_PATTERNS,
    knobs: [], // cutoff/reso now controlled by XY pad
  },
  synth: {
    name: "synth",
    label: "SYNTH",
    color: T.neonYellow,
    patterns: SYNTH_PATTERNS,
    knobs: [
      { label: "CUTOFF", param: "synthCutoff", initial: 0.7 },
      { label: "DECAY", param: "synthRelease", initial: 0.4 },
    ],
  },
  atmo: {
    name: "atmo",
    label: "ATMO",
    color: "#8866ff",
    patterns: ATMO_PRESETS,
    knobs: [{ label: "REVERB", param: "atmoReverb", initial: 0.7 }],
  },
};

// ── CSS ──────────────────────────────────────────────────

const CSS = `
  .acid-drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: ${T.bgDeep};
    color: ${T.accent};
    font-family: ${T.fontMono};
    padding: 1rem;
    user-select: none;
    gap: 1rem;
  }

  .acid-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 900px;
    padding: 0.5rem 0;
  }

  .acid-title {
    font-size: 1.3rem;
    color: ${T.neonGreen};
    text-shadow: 0 0 10px ${T.neonGreen};
    white-space: nowrap;
  }

  .acid-back {
    color: ${T.textDim};
    text-decoration: none;
    font-size: 0.8rem;
  }
  .acid-back:hover { color: ${T.accent}; }

  /* Transport */
  .transport {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 900px;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(204, 255, 0, 0.15);
    background: rgba(204, 255, 0, 0.02);
  }

  .play-btn {
    background: none;
    border: 2px solid ${T.neonGreen};
    color: ${T.neonGreen};
    font-family: ${T.fontMono};
    font-size: 1rem;
    padding: 0.4rem 1.2rem;
    cursor: pointer;
    text-shadow: 0 0 6px ${T.neonGreen};
    transition: all 0.15s;
  }
  .play-btn:hover {
    background: rgba(57, 255, 20, 0.1);
    box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
  }
  .play-btn.playing {
    border-color: ${T.neonPink};
    color: ${T.neonPink};
    text-shadow: 0 0 6px ${T.neonPink};
  }

  .bpm-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${T.textDim};
    font-size: 0.8rem;
  }
  .bpm-control input {
    width: 60px;
    background: rgba(255,255,255,0.05);
    border: 1px solid ${T.textDim};
    color: ${T.accent};
    font-family: ${T.fontMono};
    font-size: 0.9rem;
    text-align: center;
    padding: 0.2rem;
  }

  .share-btn {
    background: none;
    border: 1px solid ${T.neonCyan};
    color: ${T.neonCyan};
    font-family: ${T.fontMono};
    font-size: 0.7rem;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.15s;
  }
  .share-btn:hover {
    background: rgba(0, 255, 255, 0.08);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.25);
  }
  .share-btn.copied {
    border-color: ${T.neonGreen};
    color: ${T.neonGreen};
    text-shadow: 0 0 6px ${T.neonGreen};
  }

  .step-dots {
    display: flex;
    gap: 3px;
    margin-left: auto;
  }
  .step-dot {
    width: 8px;
    height: 8px;
    background: rgba(204, 255, 0, 0.1);
    transition: background 0.05s;
  }
  .step-dot.active {
    background: ${T.accent};
    box-shadow: 0 0 6px ${T.accentGlow};
  }
  .step-dot.beat {
    background: rgba(204, 255, 0, 0.25);
  }

  /* Channels area */
  .channels-area {
    display: flex;
    gap: 1rem;
    width: 100%;
    max-width: 900px;
    align-items: flex-start;
  }

  .channels {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .channel-strip {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.8rem;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    flex-wrap: wrap;
  }

  .ch-label {
    font-size: 0.7rem;
    font-weight: bold;
    width: 40px;
    text-align: right;
    letter-spacing: 1px;
  }

  .ch-mute {
    width: 24px;
    height: 24px;
    background: none;
    border: 1px solid;
    font-family: ${T.fontMono};
    font-size: 0.65rem;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s;
  }
  .ch-mute.muted {
    opacity: 0.3;
  }

  .ch-level {
    width: 80px;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255,255,255,0.1);
    outline: none;
    cursor: pointer;
  }
  .ch-level::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 16px;
    background: currentColor;
    cursor: pointer;
  }

  .ch-patterns {
    display: flex;
    gap: 3px;
    flex-wrap: wrap;
  }
  .ch-pat {
    font-size: 0.55rem;
    padding: 0.2rem 0.4rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: ${T.textDim};
    cursor: pointer;
    font-family: ${T.fontMono};
    transition: all 0.1s;
    white-space: nowrap;
  }
  .ch-pat:hover {
    border-color: rgba(255,255,255,0.3);
  }
  .ch-pat.active {
    border-color: currentColor;
    color: currentColor;
    background: rgba(255,255,255,0.08);
    text-shadow: 0 0 4px currentColor;
  }

  .ch-knobs {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }

  .knob-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .knob-label {
    font-size: 0.5rem;
    color: ${T.textDim};
    letter-spacing: 1px;
  }
  .knob-slider {
    width: 60px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255,255,255,0.1);
    outline: none;
    cursor: pointer;
  }
  .knob-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 8px;
    height: 14px;
    background: currentColor;
    cursor: pointer;
  }

  /* Side panel for XY pad */
  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
    flex-shrink: 0;
  }

  /* Bottom row: performance pad + lemon chan */
  .bottom-row {
    display: flex;
    gap: 1.5rem;
    width: 100%;
    max-width: 900px;
    align-items: flex-start;
  }

  /* LEMON_CHAN */
  .lemon-chan-container {
    width: 180px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .lemon-chan {
    font-size: 0.6rem;
    line-height: 1.2;
    white-space: pre;
    color: ${T.accent};
    text-shadow: 0 0 4px ${T.accentGlow};
    text-align: center;
    transition: transform 0.1s;
  }

  .lemon-chan.bounce {
    animation: chan-bounce 0.15s ease;
  }

  @keyframes chan-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  .chan-mood {
    font-size: 0.55rem;
    color: ${T.textDim};
    text-align: center;
  }

  .chan-energy-bar {
    width: 100%;
    height: 3px;
    background: rgba(255,255,255,0.05);
    overflow: hidden;
  }
  .chan-energy-fill {
    height: 100%;
    background: ${T.neonGreen};
    transition: width 0.3s;
    box-shadow: 0 0 4px ${T.neonGreen};
  }

  /* Responsive */
  @media (max-width: 700px) {
    .channels-area { flex-direction: column; }
    .side-panel { width: 100%; flex-direction: row; justify-content: center; }
    .bottom-row { flex-direction: column; align-items: center; }
    .lemon-chan-container { width: 100%; flex-direction: row; }
    .channels { width: 100%; }
    .step-dots { display: none; }
    .ch-patterns { flex-wrap: wrap; }
  }
`;

// ── Render ───────────────────────────────────────────────

export interface UIHandle {
  cleanup: () => void;
  syncFromEngine: () => void;
  sequencer: SectionSequencer;
}

export function renderUI(container: HTMLElement, engine: AcidEngine): UIHandle {
  // Inject styles
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  // XY pads
  const acidXY = createAcidXYPad(engine);
  const perfXY = createPerformanceXYPad(engine);

  // Section sequencer
  const sequencer = new SectionSequencer(engine);

  container.innerHTML = `
    <div class="acid-drop">
      <div class="acid-header">
        <a href="#" class="acid-back">&larr; DROPS</a>
        <div class="acid-title">001 &mdash; ACID TEKNO</div>
      </div>

      <div class="transport">
        <button class="play-btn" id="play-btn">PLAY</button>
        <div class="bpm-control">
          <span>BPM</span>
          <input type="number" id="bpm-input" value="${engine.state.bpm}" min="80" max="180" step="1">
        </div>
        <div class="step-dots" id="step-dots">
          ${Array.from({ length: 16 }, (_, i) =>
            `<div class="step-dot${i % 4 === 0 ? " beat" : ""}" data-step="${i}"></div>`
          ).join("")}
        </div>
        <button type="button" class="share-btn" id="share-btn" title="Copy a URL that replays this preset">SHARE</button>
      </div>

      <div class="channels-area">
        <div class="channels" id="channels"></div>
        <div class="side-panel" id="side-panel"></div>
      </div>

      <div class="bottom-row" id="bottom-row">
        <div id="perf-pad-mount"></div>
        <div class="lemon-chan-container">
          <pre class="lemon-chan" id="lemon-chan">${CHAN_IDLE}</pre>
          <div class="chan-mood" id="chan-mood">( zzZ )</div>
          <div class="chan-energy-bar">
            <div class="chan-energy-fill" id="chan-energy" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <div id="section-timeline-mount"></div>
    </div>
  `;

  // Mount XY pads
  const sidePanel = document.getElementById("side-panel")!;
  sidePanel.appendChild(acidXY.element);

  const perfMount = document.getElementById("perf-pad-mount")!;
  perfMount.appendChild(perfXY.element);

  // Mount section timeline
  const sectionTimelineMount = document.getElementById("section-timeline-mount")!;
  const sectionTimeline = createSectionTimeline(sequencer, () => syncFromEngine());
  sectionTimelineMount.appendChild(sectionTimeline.element);

  const channelsEl = document.getElementById("channels")!;
  const channelNames: ChannelName[] = ["kick", "perc", "acid", "synth", "atmo"];

  // Render channel strips
  for (const chName of channelNames) {
    const cfg = CHANNELS[chName];
    const chState = engine.state[chName];

    const strip = document.createElement("div");
    strip.className = "channel-strip";
    strip.style.color = cfg.color;

    strip.innerHTML = `
      <span class="ch-label" style="color: ${cfg.color}">${cfg.label}</span>
      <button class="ch-mute${chState.muted ? " muted" : ""}" data-ch="${chName}"
        style="border-color: ${cfg.color}; color: ${cfg.color}">M</button>
      <input type="range" class="ch-level" data-ch="${chName}" min="0" max="1" step="0.01"
        value="${chState.level}" style="color: ${cfg.color}">
      <div class="ch-patterns" data-ch="${chName}">
        ${cfg.patterns.map((p, i) =>
          `<button class="ch-pat${i === chState.patternIndex ? " active" : ""}"
            data-ch="${chName}" data-idx="${i}" style="color: ${cfg.color}">${p.name}</button>`
        ).join("")}
      </div>
      <div class="ch-knobs">
        ${cfg.knobs.map(k =>
          `<div class="knob-group">
            <span class="knob-label">${k.label}</span>
            <input type="range" class="knob-slider" data-param="${k.param}"
              min="0" max="1" step="0.01" value="${k.initial}" style="color: ${cfg.color}">
          </div>`
        ).join("")}
      </div>
    `;

    channelsEl.appendChild(strip);
  }

  // ── Sync UI from engine state ─────────────────────────

  function syncFromEngine() {
    for (const chName of channelNames) {
      const chState = engine.state[chName];

      // Update level slider
      const levelSlider = channelsEl.querySelector(
        `.ch-level[data-ch="${chName}"]`
      ) as HTMLInputElement | null;
      if (levelSlider) levelSlider.value = String(chState.level);

      // Update mute button
      const muteBtn = channelsEl.querySelector(
        `.ch-mute[data-ch="${chName}"]`
      ) as HTMLElement | null;
      if (muteBtn) muteBtn.classList.toggle("muted", chState.muted);

      // Update pattern active state
      const patBtns = channelsEl.querySelectorAll(
        `.ch-pat[data-ch="${chName}"]`
      );
      patBtns.forEach((btn, i) => {
        btn.classList.toggle("active", i === chState.patternIndex);
      });
    }

    // Update knob sliders
    const knobSliders = channelsEl.querySelectorAll(".knob-slider") as NodeListOf<HTMLInputElement>;
    const paramValues: Record<string, number> = {
      kickDrive: engine.state.kick.drive,
      percTone: engine.state.perc.tone,
      acidCutoff: engine.state.acid.cutoff,
      acidResonance: engine.state.acid.resonance,
      synthCutoff: engine.state.synth.cutoff,
      synthRelease: engine.state.synth.release,
      atmoReverb: engine.state.atmo.reverb,
    };
    knobSliders.forEach((slider) => {
      const param = slider.dataset.param!;
      if (paramValues[param] !== undefined) {
        slider.value = String(paramValues[param]);
      }
    });

    // Update BPM
    const bpmInput = document.getElementById("bpm-input") as HTMLInputElement;
    if (bpmInput) bpmInput.value = String(engine.state.bpm);

    // Update XY pad positions
    acidXY.setPosition(engine.state.acid.cutoff, 1 - engine.state.acid.resonance);
  }

  // ── Event handlers ───────────────────────────────────

  const playBtn = document.getElementById("play-btn") as HTMLButtonElement;
  const bpmInput = document.getElementById("bpm-input") as HTMLInputElement;
  const stepDots = document.querySelectorAll(".step-dot");
  const chanEl = document.getElementById("lemon-chan")!;
  const moodEl = document.getElementById("chan-mood")!;
  const energyEl = document.getElementById("chan-energy")!;

  playBtn.addEventListener("click", () => {
    if (engine.state.playing) {
      engine.stop();
      playBtn.textContent = "PLAY";
      playBtn.classList.remove("playing");
      stepDots.forEach(d => d.classList.remove("active"));
    } else {
      engine.start();
      playBtn.textContent = "STOP";
      playBtn.classList.add("playing");
    }
  });

  bpmInput.addEventListener("change", () => {
    engine.setBpm(parseInt(bpmInput.value));
  });

  const shareBtn = document.getElementById("share-btn") as HTMLButtonElement;
  let shareTimer: number | null = null;
  shareBtn.addEventListener("click", async () => {
    const snapshot = engine.getSnapshot();
    // Strip transient runtime fields — recipient should land stopped at step 0.
    const { playing: _p, currentStep: _s, ...preset } = snapshot;
    void _p; void _s;
    const dropId = stripPresetQuery(window.location.hash) || "001-acid-techno";
    const url = buildShareUrl(dropId, preset);

    let copied = false;
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      // Fallback for browsers without clipboard API or in non-secure contexts.
      window.prompt("Copy this URL:", url);
    }

    if (copied) {
      if (shareTimer !== null) clearTimeout(shareTimer);
      shareBtn.classList.add("copied");
      shareBtn.textContent = "COPIED";
      shareTimer = window.setTimeout(() => {
        shareBtn.classList.remove("copied");
        shareBtn.textContent = "SHARE";
        shareTimer = null;
      }, 1500);
    }
  });

  // Mute buttons + pattern select
  channelsEl.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("ch-mute")) {
      const ch = target.dataset.ch as ChannelName;
      const muted = !engine.state[ch].muted;
      engine.setMuted(ch, muted);
      target.classList.toggle("muted", muted);
    }

    if (target.classList.contains("ch-pat")) {
      const ch = target.dataset.ch as ChannelName;
      const idx = parseInt(target.dataset.idx!);
      engine.setPattern(ch, idx);

      const siblings = target.parentElement!.querySelectorAll(".ch-pat");
      siblings.forEach(s => s.classList.remove("active"));
      target.classList.add("active");
    }
  });

  // Level + knob sliders
  channelsEl.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;

    if (target.classList.contains("ch-level")) {
      const ch = target.dataset.ch as ChannelName;
      engine.setChannelLevel(ch, parseFloat(target.value));
    }

    if (target.classList.contains("knob-slider")) {
      const param = target.dataset.param!;
      const val = parseFloat(target.value);
      const paramMap: Record<string, (v: number) => void> = {
        kickDrive: (v) => engine.setKickDrive(v),
        percTone: (v) => engine.setPercTone(v),
        acidCutoff: (v) => engine.setAcidCutoff(v),
        acidResonance: (v) => engine.setAcidResonance(v),
        synthCutoff: (v) => engine.setSynthCutoff(v),
        synthRelease: (v) => engine.setSynthRelease(v),
        atmoReverb: (v) => engine.setAtmoReverb(v),
      };
      paramMap[param]?.(val);
    }
  });

  // ── Step callback (visual + LEMON_CHAN + sequencer) ────

  let beatCount = 0;

  engine.onStep((step: number) => {
    // Step dots
    stepDots.forEach((d, i) => {
      d.classList.toggle("active", i === step);
    });

    // XY pad beat sync
    acidXY.update(step);
    perfXY.update(step);

    // Section sequencer step
    sequencer.onStep(step);
    sectionTimeline.update();

    // Beat bounce for LEMON_CHAN
    if (step % 4 === 0) {
      beatCount++;
      chanEl.classList.add("bounce");
      setTimeout(() => chanEl.classList.remove("bounce"), 150);
    }

    // Update LEMON_CHAN every beat
    if (step % 4 === 0) {
      const energy = engine.getEnergy();
      energyEl.style.width = `${energy.total * 100}%`;

      if (energy.total < 0.15) {
        chanEl.textContent = CHAN_ZEN;
        moodEl.textContent = "( zzZ )";
      } else if (energy.total < 0.35) {
        chanEl.textContent = beatCount % 2 === 0 ? CHAN_IDLE : CHAN_ZEN;
        moodEl.textContent = "( . . . )";
      } else if (energy.total < 0.55) {
        chanEl.textContent = beatCount % 2 === 0 ? CHAN_VIBING : CHAN_BOUNCING;
        moodEl.textContent = energy.mid > 0.4 ? "( ~ acid ~ )" : "( vibing )";
      } else if (energy.total < 0.8) {
        chanEl.textContent = beatCount % 2 === 0 ? CHAN_BOUNCING : CHAN_HYPED;
        moodEl.textContent = energy.low > 0.6 ? "( BOOM )" : "( LET'S GO )";
      } else {
        chanEl.textContent = beatCount % 3 === 0 ? CHAN_HYPED : CHAN_BOUNCING;
        moodEl.textContent = "( !!!! )";
      }

      if (energy.total > 0.6) {
        chanEl.style.color = T.neonPink;
        chanEl.style.textShadow = `0 0 8px ${T.neonPink}`;
      } else if (energy.mid > 0.3) {
        chanEl.style.color = T.neonGreen;
        chanEl.style.textShadow = `0 0 6px ${T.neonGreen}`;
      } else {
        chanEl.style.color = T.accent;
        chanEl.style.textShadow = `0 0 4px ${T.accentGlow}`;
      }
    }
  });

  // ── Load preset sections (after all DOM + handlers ready) ──

  for (const section of getPresetSections()) {
    sequencer.addSection(section);
  }

  // ── Return handle ─────────────────────────────────────

  return {
    cleanup() {
      style.remove();
      acidXY.destroy();
      perfXY.destroy();
      sectionTimeline.destroy();
    },
    syncFromEngine,
    sequencer,
  };
}
