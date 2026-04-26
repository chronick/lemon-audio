/**
 * Audio engine for DROP #001 — ACID TEKNO
 *
 * Web Audio API synthesis: kick, perc, 303 acid bass, synth stabs, ambient.
 * Look-ahead scheduler for tight timing.
 */

import { getAudioContext, resumeAudio } from "../../shared/audio.ts";
import {
  type DrumPattern,
  type AcidPattern,
  type SynthPattern,
  type AtmoPreset,
  midiToFreq,
  STEPS,
  DEFAULT_BPM,
} from "./patterns.ts";

// ── Types ────────────────────────────────────────────────

export interface ChannelState {
  muted: boolean;
  level: number; // 0–1
  patternIndex: number;
}

export interface EngineState {
  playing: boolean;
  bpm: number;
  currentStep: number;
  kick: ChannelState & { drive: number };
  perc: ChannelState & { tone: number };
  acid: ChannelState & { cutoff: number; resonance: number };
  synth: ChannelState & { cutoff: number; release: number };
  atmo: ChannelState & { reverb: number };
}

export type StepCallback = (step: number) => void;

// ── Engine ───────────────────────────────────────────────

export class AcidEngine {
  private ctx!: AudioContext;
  private masterGain!: GainNode;
  private limiter!: DynamicsCompressorNode;

  // Channel gains
  private kickGain!: GainNode;
  private percGain!: GainNode;
  private acidGain!: GainNode;
  private synthGain!: GainNode;
  private atmoGain!: GainNode;

  // Effects
  private kickDrive!: WaveShaperNode;
  private kickComp!: DynamicsCompressorNode;
  private percComp!: DynamicsCompressorNode;
  private acidFilter!: BiquadFilterNode;
  private synthFilter!: BiquadFilterNode;
  private atmoReverb!: ConvolverNode;
  private atmoReverbGain!: GainNode;
  private atmoDryGain!: GainNode;

  // Atmo continuous nodes
  private atmoNoise: AudioBufferSourceNode | null = null;
  private atmoLfo: OscillatorNode | null = null;
  private atmoLfoGain: GainNode | null = null;
  private atmoNoiseFilter: BiquadFilterNode | null = null;

  // Scheduler
  private schedulerTimer: number | null = null;
  private nextStepTime = 0;
  private readonly LOOK_AHEAD = 0.1; // seconds
  private readonly SCHEDULE_INTERVAL = 25; // ms

  // Pattern data (set externally)
  private kickPatterns: DrumPattern[] = [];
  private acidPatterns: AcidPattern[] = [];
  private synthPatterns: SynthPattern[] = [];
  private atmoPresets: AtmoPreset[] = [];

  // State
  state: EngineState = {
    playing: false,
    bpm: DEFAULT_BPM,
    currentStep: 0,
    kick: { muted: false, level: 0.8, patternIndex: 0, drive: 0.3 },
    perc: { muted: false, level: 0.7, patternIndex: 0, tone: 0.5 },
    acid: { muted: false, level: 0.75, patternIndex: 0, cutoff: 0.5, resonance: 0.6 },
    synth: { muted: false, level: 0.5, patternIndex: 0, cutoff: 0.7, release: 0.4 },
    atmo: { muted: true, level: 0.5, patternIndex: 0, reverb: 0.7 },
  };

  private stepCallbacks: StepCallback[] = [];
  private lastAcidFreq = midiToFreq(33); // for slides

  // ── Init ─────────────────────────────────────────────

  init(
    kickPatterns: DrumPattern[],
    acidPatterns: AcidPattern[],
    synthPatterns: SynthPattern[],
    atmoPresets: AtmoPreset[]
  ) {
    this.ctx = getAudioContext();
    this.kickPatterns = kickPatterns;
    this.acidPatterns = acidPatterns;
    this.synthPatterns = synthPatterns;
    this.atmoPresets = atmoPresets;

    // Master chain: limiter → destination
    this.limiter = this.ctx.createDynamicsCompressor();
    this.limiter.threshold.value = -3;
    this.limiter.knee.value = 3;
    this.limiter.ratio.value = 12;
    this.limiter.attack.value = 0.001;
    this.limiter.release.value = 0.1;
    this.limiter.connect(this.ctx.destination);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.limiter);

    this.buildKickChain();
    this.buildPercChain();
    this.buildAcidChain();
    this.buildSynthChain();
    this.buildAtmoChain();
  }

  private buildKickChain() {
    this.kickComp = this.ctx.createDynamicsCompressor();
    this.kickComp.threshold.value = -15;
    this.kickComp.ratio.value = 4;
    this.kickComp.attack.value = 0.003;
    this.kickComp.release.value = 0.15;

    this.kickDrive = this.ctx.createWaveShaper();
    this.updateDriveCurve(this.state.kick.drive);

    this.kickGain = this.ctx.createGain();
    this.kickGain.gain.value = this.state.kick.level;

    this.kickGain.connect(this.kickDrive);
    this.kickDrive.connect(this.kickComp);
    this.kickComp.connect(this.masterGain);
  }

  private buildPercChain() {
    this.percComp = this.ctx.createDynamicsCompressor();
    this.percComp.threshold.value = -18;
    this.percComp.ratio.value = 3;
    this.percComp.attack.value = 0.001;
    this.percComp.release.value = 0.1;

    this.percGain = this.ctx.createGain();
    this.percGain.gain.value = this.state.perc.level;

    this.percGain.connect(this.percComp);
    this.percComp.connect(this.masterGain);
  }

  private buildAcidChain() {
    this.acidFilter = this.ctx.createBiquadFilter();
    this.acidFilter.type = "lowpass";
    this.acidFilter.frequency.value = this.cutoffToFreq(this.state.acid.cutoff);
    this.acidFilter.Q.value = this.state.acid.resonance * 25;

    this.acidGain = this.ctx.createGain();
    this.acidGain.gain.value = this.state.acid.level;

    this.acidGain.connect(this.acidFilter);
    this.acidFilter.connect(this.masterGain);
  }

  private buildSynthChain() {
    this.synthFilter = this.ctx.createBiquadFilter();
    this.synthFilter.type = "lowpass";
    this.synthFilter.frequency.value = this.cutoffToFreq(this.state.synth.cutoff);
    this.synthFilter.Q.value = 2;

    this.synthGain = this.ctx.createGain();
    this.synthGain.gain.value = this.state.synth.level;

    this.synthGain.connect(this.synthFilter);
    this.synthFilter.connect(this.masterGain);
  }

  private buildAtmoChain() {
    // Reverb via convolver with generated impulse
    this.atmoReverb = this.ctx.createConvolver();
    this.atmoReverb.buffer = this.generateImpulse(3, 4);

    this.atmoReverbGain = this.ctx.createGain();
    this.atmoReverbGain.gain.value = this.state.atmo.reverb;

    this.atmoDryGain = this.ctx.createGain();
    this.atmoDryGain.gain.value = 1 - this.state.atmo.reverb;

    this.atmoGain = this.ctx.createGain();
    this.atmoGain.gain.value = this.state.atmo.level;

    // dry path
    this.atmoGain.connect(this.atmoDryGain);
    this.atmoDryGain.connect(this.masterGain);

    // wet path
    this.atmoGain.connect(this.atmoReverb);
    this.atmoReverb.connect(this.atmoReverbGain);
    this.atmoReverbGain.connect(this.masterGain);
  }

  // ── Synth voices ─────────────────────────────────────

  private playKick(time: number, vel: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.07);

    gain.gain.setValueAtTime(vel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.connect(gain);
    gain.connect(this.kickGain);

    osc.start(time);
    osc.stop(time + 0.45);
  }

  private playHat(time: number, vel: number, open = false) {
    const bufSize = this.ctx.sampleRate * (open ? 0.15 : 0.04);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * vel;
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    // Shift tone based on perc tone knob
    hp.frequency.value = 5000 + this.state.perc.tone * 7000;

    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 8000 + this.state.perc.tone * 4000;
    bp.Q.value = 1.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vel * 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (open ? 0.15 : 0.04));

    src.connect(hp);
    hp.connect(bp);
    bp.connect(gain);
    gain.connect(this.percGain);

    src.start(time);
  }

  private playClap(time: number, vel: number) {
    const envCount = 3;
    for (let i = 0; i < envCount; i++) {
      const t = time + i * 0.01;
      const bufSize = this.ctx.sampleRate * 0.02;
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < bufSize; j++) {
        data[j] = (Math.random() * 2 - 1);
      }

      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const bp = this.ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1200;
      bp.Q.value = 2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vel * 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      src.connect(bp);
      bp.connect(gain);
      gain.connect(this.percGain);

      src.start(t);
    }
  }

  private playRide(time: number, vel: number) {
    const bufSize = this.ctx.sampleRate * 0.3;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vel * 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    src.connect(hp);
    hp.connect(gain);
    gain.connect(this.percGain);

    src.start(time);
  }

  private playAcidNote(time: number, note: number, accent: boolean, slide: boolean) {
    const freq = midiToFreq(note);
    const stepDur = 60 / this.state.bpm / 4;

    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";

    if (slide) {
      osc.frequency.setValueAtTime(this.lastAcidFreq, time);
      osc.frequency.exponentialRampToValueAtTime(freq, time + stepDur * 0.5);
    } else {
      osc.frequency.setValueAtTime(freq, time);
    }

    // Per-note filter envelope
    const noteFilter = this.ctx.createBiquadFilter();
    noteFilter.type = "lowpass";
    const baseCutoff = this.cutoffToFreq(this.state.acid.cutoff);
    const envAmount = accent ? 5000 : 2500;
    noteFilter.frequency.setValueAtTime(baseCutoff + envAmount, time);
    noteFilter.frequency.exponentialRampToValueAtTime(
      Math.max(baseCutoff, 60),
      time + stepDur * 0.8
    );
    noteFilter.Q.value = this.state.acid.resonance * 20;

    const gain = this.ctx.createGain();
    const vol = accent ? 0.45 : 0.3;
    gain.gain.setValueAtTime(vol, time);
    if (!slide) {
      gain.gain.setValueAtTime(vol, time + stepDur * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, time + stepDur * 0.95);
    } else {
      gain.gain.setValueAtTime(vol, time + stepDur);
    }

    osc.connect(noteFilter);
    noteFilter.connect(gain);
    gain.connect(this.acidGain);

    osc.start(time);
    osc.stop(time + stepDur * 1.1);

    this.lastAcidFreq = freq;
  }

  private playSynthChord(time: number, notes: number[], vel: number) {
    const stepDur = 60 / this.state.bpm / 4;
    const release = 0.05 + this.state.synth.release * 0.4;

    for (const note of notes) {
      const freq = midiToFreq(note);

      // Two detuned oscillators
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = "sawtooth";
      osc2.type = "sawtooth";
      osc1.frequency.value = freq;
      osc2.frequency.value = freq * 1.005; // slight detune

      const gain = this.ctx.createGain();
      const noteVol = vel * 0.12;
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(noteVol, time + 0.005);
      gain.gain.setValueAtTime(noteVol, time + stepDur * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, time + stepDur * 0.6 + release);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.synthGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + stepDur + release + 0.1);
      osc2.stop(time + stepDur + release + 0.1);
    }
  }

  // ── Atmo continuous layer ────────────────────────────

  startAtmo() {
    this.stopAtmo();
    const preset = this.atmoPresets[this.state.atmo.patternIndex];
    if (!preset) return;

    // Noise source
    const bufLen = this.ctx.sampleRate * 4;
    const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = buf.getChannelData(0);

    if (preset.type === "rumble" || preset.type === "drone") {
      // Brown noise for low-end
      let last = 0;
      for (let i = 0; i < bufLen; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    } else {
      // White noise
      for (let i = 0; i < bufLen; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    this.atmoNoise = this.ctx.createBufferSource();
    this.atmoNoise.buffer = buf;
    this.atmoNoise.loop = true;

    this.atmoNoiseFilter = this.ctx.createBiquadFilter();
    this.atmoNoiseFilter.type = preset.type === "shimmer" ? "highpass" : "lowpass";
    this.atmoNoiseFilter.frequency.value = preset.filterFreq;
    this.atmoNoiseFilter.Q.value = preset.filterQ;

    // LFO modulating filter
    this.atmoLfo = this.ctx.createOscillator();
    this.atmoLfo.type = "sine";
    this.atmoLfo.frequency.value = preset.lfoRate;

    this.atmoLfoGain = this.ctx.createGain();
    this.atmoLfoGain.gain.value = preset.filterFreq * 0.5;

    this.atmoLfo.connect(this.atmoLfoGain);
    this.atmoLfoGain.connect(this.atmoNoiseFilter.frequency);

    const preGain = this.ctx.createGain();
    preGain.gain.value = preset.gain;

    this.atmoNoise.connect(this.atmoNoiseFilter);
    this.atmoNoiseFilter.connect(preGain);
    preGain.connect(this.atmoGain);

    this.atmoNoise.start();
    this.atmoLfo.start();
  }

  stopAtmo() {
    try { this.atmoNoise?.stop(); } catch {}
    try { this.atmoLfo?.stop(); } catch {}
    this.atmoNoise = null;
    this.atmoLfo = null;
    this.atmoLfoGain = null;
    this.atmoNoiseFilter = null;
  }

  // ── Scheduler ────────────────────────────────────────

  onStep(cb: StepCallback) {
    this.stepCallbacks.push(cb);
  }

  async start() {
    await resumeAudio();
    this.state.playing = true;
    this.state.currentStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.05;
    this.lastAcidFreq = midiToFreq(33);

    if (!this.state.atmo.muted) {
      this.startAtmo();
    }

    this.schedule();
  }

  stop() {
    this.state.playing = false;
    if (this.schedulerTimer !== null) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    this.stopAtmo();
  }

  private schedule() {
    if (!this.state.playing) return;

    const stepDur = 60 / this.state.bpm / 4; // 16th note duration

    while (this.nextStepTime < this.ctx.currentTime + this.LOOK_AHEAD) {
      this.triggerStep(this.state.currentStep, this.nextStepTime);

      // Notify UI
      const step = this.state.currentStep;
      const time = this.nextStepTime;
      const delay = Math.max(0, (time - this.ctx.currentTime) * 1000);
      setTimeout(() => {
        for (const cb of this.stepCallbacks) cb(step);
      }, delay);

      this.nextStepTime += stepDur;
      this.state.currentStep = (this.state.currentStep + 1) % STEPS;
    }

    this.schedulerTimer = window.setTimeout(() => this.schedule(), this.SCHEDULE_INTERVAL);
  }

  private triggerStep(step: number, time: number) {
    // Kick + perc
    if (!this.state.kick.muted) {
      const pat = this.kickPatterns[this.state.kick.patternIndex];
      if (pat) {
        if (pat.kick[step]?.vel) this.playKick(time, pat.kick[step].vel);
        if (pat.hat[step]?.vel) this.playHat(time, pat.hat[step].vel);
        if (pat.clap[step]?.vel) this.playClap(time, pat.clap[step].vel);
        if (pat.ride[step]?.vel) this.playRide(time, pat.ride[step].vel);
      }
    }

    // Extra perc (uses same patterns but separate mute/level)
    // Perc channel controls hats independently — reuse pattern
    // Actually perc is bundled with kick patterns. Let's just use kick channel for all drums.
    // The "perc" channel here acts as a secondary drum control.

    // Acid
    if (!this.state.acid.muted) {
      const pat = this.acidPatterns[this.state.acid.patternIndex];
      const step_data = pat?.steps[step];
      if (step_data) {
        this.playAcidNote(time, step_data.note, step_data.accent, step_data.slide);
      }
    }

    // Synth
    if (!this.state.synth.muted) {
      const pat = this.synthPatterns[this.state.synth.patternIndex];
      const step_data = pat?.steps[step];
      if (step_data) {
        this.playSynthChord(time, step_data.notes, step_data.vel);
      }
    }
  }

  // ── Parameter updates ────────────────────────────────

  setChannelLevel(channel: keyof Pick<EngineState, "kick" | "perc" | "acid" | "synth" | "atmo">, value: number) {
    this.state[channel].level = value;
    const gainMap = {
      kick: this.kickGain,
      perc: this.percGain,
      acid: this.acidGain,
      synth: this.synthGain,
      atmo: this.atmoGain,
    };
    gainMap[channel].gain.setTargetAtTime(value, this.ctx.currentTime, 0.02);
  }

  setMuted(channel: keyof Pick<EngineState, "kick" | "perc" | "acid" | "synth" | "atmo">, muted: boolean) {
    this.state[channel].muted = muted;
    if (channel === "atmo") {
      if (muted) {
        this.stopAtmo();
      } else if (this.state.playing) {
        this.startAtmo();
      }
    }
  }

  setKickDrive(value: number) {
    this.state.kick.drive = value;
    this.updateDriveCurve(value);
  }

  setPercTone(value: number) {
    this.state.perc.tone = value;
  }

  setAcidCutoff(value: number) {
    this.state.acid.cutoff = value;
    this.acidFilter.frequency.setTargetAtTime(
      this.cutoffToFreq(value),
      this.ctx.currentTime,
      0.02
    );
  }

  setAcidResonance(value: number) {
    this.state.acid.resonance = value;
    this.acidFilter.Q.setTargetAtTime(value * 25, this.ctx.currentTime, 0.02);
  }

  setSynthCutoff(value: number) {
    this.state.synth.cutoff = value;
    this.synthFilter.frequency.setTargetAtTime(
      this.cutoffToFreq(value),
      this.ctx.currentTime,
      0.02
    );
  }

  setSynthRelease(value: number) {
    this.state.synth.release = value;
  }

  setAtmoReverb(value: number) {
    this.state.atmo.reverb = value;
    this.atmoReverbGain.gain.setTargetAtTime(value, this.ctx.currentTime, 0.05);
    this.atmoDryGain.gain.setTargetAtTime(1 - value * 0.5, this.ctx.currentTime, 0.05);
  }

  setPattern(channel: keyof Pick<EngineState, "kick" | "perc" | "acid" | "synth" | "atmo">, index: number) {
    this.state[channel].patternIndex = index;
    if (channel === "atmo" && this.state.playing && !this.state.atmo.muted) {
      this.startAtmo();
    }
  }

  setBpm(bpm: number) {
    this.state.bpm = Math.max(80, Math.min(180, bpm));
  }

  // ── Energy estimation (for LEMON_CHAN) ───────────────

  getEnergy(): { total: number; low: number; mid: number; high: number } {
    let low = 0, mid = 0, high = 0;

    if (!this.state.kick.muted) {
      low += this.state.kick.level * 0.8;
    }
    if (!this.state.acid.muted) {
      low += this.state.acid.level * 0.4;
      mid += this.state.acid.level * this.state.acid.cutoff * 0.6;
    }
    if (!this.state.perc.muted) {
      high += this.state.perc.level * 0.7;
    }
    if (!this.state.synth.muted) {
      mid += this.state.synth.level * 0.6;
      high += this.state.synth.level * this.state.synth.cutoff * 0.3;
    }
    if (!this.state.atmo.muted) {
      mid += this.state.atmo.level * 0.2;
    }

    const total = Math.min(1, (low + mid + high) / 2.5);
    return { total, low: Math.min(1, low), mid: Math.min(1, mid), high: Math.min(1, high) };
  }

  // ── Snapshot / batch ────────────────────────────────

  /** Deep copy of current engine state for section sequencer */
  getSnapshot(): EngineState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /** Batch setter for XY pad parameter maps */
  applyParameterMap(values: Partial<Record<string, number>>) {
    const setters: Record<string, (v: number) => void> = {
      kickLevel: (v) => this.setChannelLevel("kick", v),
      percLevel: (v) => this.setChannelLevel("perc", v),
      acidLevel: (v) => this.setChannelLevel("acid", v),
      synthLevel: (v) => this.setChannelLevel("synth", v),
      atmoLevel: (v) => this.setChannelLevel("atmo", v),
      kickDrive: (v) => this.setKickDrive(v),
      percTone: (v) => this.setPercTone(v),
      acidCutoff: (v) => this.setAcidCutoff(v),
      acidResonance: (v) => this.setAcidResonance(v),
      synthCutoff: (v) => this.setSynthCutoff(v),
      synthRelease: (v) => this.setSynthRelease(v),
      atmoReverb: (v) => this.setAtmoReverb(v),
    };
    for (const [key, val] of Object.entries(values)) {
      if (val !== undefined && setters[key]) setters[key](val);
    }
  }

  /** Apply a full snapshot to restore engine state (for section transitions) */
  applySnapshot(snapshot: EngineState) {
    const channels = ["kick", "perc", "acid", "synth", "atmo"] as const;
    for (const ch of channels) {
      this.setChannelLevel(ch, snapshot[ch].level);
      this.setMuted(ch, snapshot[ch].muted);
      this.setPattern(ch, snapshot[ch].patternIndex);
    }
    this.setKickDrive(snapshot.kick.drive);
    this.setPercTone(snapshot.perc.tone);
    this.setAcidCutoff(snapshot.acid.cutoff);
    this.setAcidResonance(snapshot.acid.resonance);
    this.setSynthCutoff(snapshot.synth.cutoff);
    this.setSynthRelease(snapshot.synth.release);
    this.setAtmoReverb(snapshot.atmo.reverb);
    this.setBpm(snapshot.bpm);
  }

  // ── Helpers ──────────────────────────────────────────

  private cutoffToFreq(normalized: number): number {
    // 0–1 → 60–12000 Hz exponential
    return 60 * Math.pow(200, normalized);
  }

  private updateDriveCurve(amount: number) {
    const samples = 256;
    const curve = new Float32Array(samples);
    const k = amount * 50;
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    this.kickDrive.curve = curve;
    this.kickDrive.oversample = "4x";
  }

  private generateImpulse(duration: number, decay: number): AudioBuffer {
    const length = this.ctx.sampleRate * duration;
    const buf = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buf;
  }

  destroy() {
    this.stop();
    this.stepCallbacks = [];
  }
}
