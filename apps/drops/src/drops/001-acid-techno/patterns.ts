/**
 * Pattern data for DROP #001 — ACID TEKNO
 *
 * All patterns are 16 steps (16th notes).
 * Kick/Perc: velocity 0-1 (0 = off)
 * Acid: { note: MIDI, accent: bool, slide: bool } | null
 * Synth: { note: MIDI[], vel: number } | null
 * Atmo: continuous textures, no step data
 */

// ── Helpers ──────────────────────────────────────────────

export function midiToFreq(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// ── Types ────────────────────────────────────────────────

export interface DrumStep {
  vel: number; // 0–1
}

export interface AcidStep {
  note: number; // MIDI note
  accent: boolean;
  slide: boolean;
}

export interface SynthStep {
  notes: number[]; // MIDI chord
  vel: number;
}

export type Energy = "low" | "mid" | "high";

export interface DrumPattern {
  name: string;
  energy: Energy;
  kick: DrumStep[];
  hat: DrumStep[];
  clap: DrumStep[];
  ride: DrumStep[];
}

export interface AcidPattern {
  name: string;
  energy: Energy;
  steps: (AcidStep | null)[];
}

export interface SynthPattern {
  name: string;
  energy: Energy;
  steps: (SynthStep | null)[];
}

export interface AtmoPreset {
  name: string;
  energy: Energy;
  type: "wash" | "drone" | "sweep" | "rumble" | "shimmer";
  filterFreq: number;
  filterQ: number;
  lfoRate: number; // Hz, for slow modulation
  gain: number;
}

// ── Constants ────────────────────────────────────────────

const O = { vel: 0 }; // off
const s = (v: number): DrumStep => ({ vel: v }); // hit

const n = (note: number, accent = false, slide = false): AcidStep => ({
  note,
  accent,
  slide,
});
const _ = null; // rest

// Notes (MIDI) — rooted in A minor
const A1 = 33,
  C2 = 36,
  D2 = 38,
  E2 = 40,
  G2 = 43;
const A2 = 45,
  C3 = 48;

// Synth chord voicings (MIDI)
const Am = [57, 60, 64]; // A minor
const Dm = [62, 65, 69]; // D minor
const Em = [52, 55, 59]; // E minor
const F = [53, 57, 60]; // F major

const ch = (notes: number[], vel = 0.8): SynthStep => ({ notes, vel });

// ── KICK PATTERNS ────────────────────────────────────────

export const KICK_PATTERNS: DrumPattern[] = [
  {
    name: "FOUR FLOOR",
    energy: "mid",
    kick: [s(1), O, O, O, s(1), O, O, O, s(1), O, O, O, s(1), O, O, O],
    hat: [O, O, s(.6), O, O, O, s(.6), O, O, O, s(.6), O, O, O, s(.6), O],
    clap: [O, O, O, O, s(.9), O, O, O, O, O, O, O, s(.9), O, O, O],
    ride: [O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
  },
  {
    name: "DRIVING",
    energy: "high",
    kick: [s(1), O, O, O, s(1), O, O, s(.7), s(1), O, O, O, s(1), O, O, O],
    hat: [s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5), s(.5)],
    clap: [O, O, O, O, s(1), O, O, O, O, O, O, O, s(1), O, O, s(.5)],
    ride: [O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
  },
  {
    name: "MINIMAL",
    energy: "mid",
    kick: [s(1), O, O, O, O, O, O, O, s(.9), O, O, O, O, O, O, O],
    hat: [O, O, O, O, O, O, s(.4), O, O, O, O, O, O, O, s(.4), O],
    clap: [O, O, O, O, s(.7), O, O, O, O, O, O, O, s(.7), O, O, O],
    ride: [O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
  },
  {
    name: "POUNDING",
    energy: "high",
    kick: [s(1), O, O, s(.6), s(1), O, O, O, s(1), O, O, s(.7), s(1), O, O, O],
    hat: [s(.6), O, s(.6), O, s(.6), O, s(.6), O, s(.6), O, s(.6), O, s(.6), O, s(.6), O],
    clap: [O, O, O, O, s(1), O, O, s(.4), O, O, O, O, s(1), O, O, O],
    ride: [O, O, O, O, O, O, O, O, O, O, O, O, O, O, s(.3), O],
  },
  {
    name: "SYNCOPATED",
    energy: "mid",
    kick: [s(1), O, O, O, s(.8), O, s(.7), O, s(1), O, O, O, s(.8), O, s(.6), O],
    hat: [O, O, s(.5), O, O, O, s(.5), O, O, O, s(.5), O, O, O, s(.5), s(.3)],
    clap: [O, O, O, O, s(.9), O, O, O, O, O, O, s(.5), O, O, s(.8), O],
    ride: [s(.3), O, O, O, O, O, O, O, s(.3), O, O, O, O, O, O, O],
  },
  // ── Low-energy kick patterns ──
  {
    name: "HEARTBEAT",
    energy: "low",
    kick: [s(.7), O, O, O, O, O, O, O, s(.5), O, O, O, O, O, O, O],
    hat: [O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
    clap: [O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
    ride: [O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
  },
  {
    name: "STUMBLE",
    energy: "low",
    kick: [s(.8), O, O, O, O, s(.3), O, O, O, O, O, s(.5), O, O, O, O],
    hat: [O, O, O, O, O, O, O, s(.15), O, O, O, O, O, O, O, O],
    clap: [O, O, O, O, O, O, O, O, O, O, O, O, s(.3), O, O, O],
    ride: [O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O],
  },
];

// ── ACID PATTERNS ────────────────────────────────────────

export const ACID_PATTERNS: AcidPattern[] = [
  {
    name: "CLASSIC",
    energy: "mid",
    steps: [
      n(A1, true), _, n(C2), n(E2, false, true),
      n(A1, true), _, n(D2), _,
      n(A1), n(G2, true, true), n(E2), _,
      n(A1, true), _, n(C2, false, true), n(D2),
    ],
  },
  {
    name: "HYPNOTIC",
    energy: "mid",
    steps: [
      n(A1, true), n(A1), _, n(A1),
      n(A1, true), _, n(C2, false, true), n(A1),
      n(A1, true), n(A1), _, n(A1),
      n(A1, true), _, n(E2, true, true), n(D2, false, true),
    ],
  },
  {
    name: "WANDERER",
    energy: "mid",
    steps: [
      n(A1, true), _, n(E2, false, true), n(G2),
      n(A2, true, true), _, n(D2), _,
      n(C2, true), _, n(G2, false, true), n(A2, true),
      _, n(E2), n(D2, false, true), n(A1, true),
    ],
  },
  {
    name: "STABBY",
    energy: "high",
    steps: [
      n(A2, true), _, _, n(A2, true),
      _, _, n(E2, true), _,
      n(A2, true), _, _, n(C3, true),
      _, n(A2, true), _, _,
    ],
  },
  {
    name: "DEEP",
    energy: "mid",
    steps: [
      n(A1), n(A1, false, true), n(A1), _,
      n(C2, true, true), n(C2), _, n(A1),
      n(A1), n(A1, false, true), _, n(D2, true),
      n(C2, false, true), n(A1), _, _,
    ],
  },
  {
    name: "RELENTLESS",
    energy: "high",
    steps: [
      n(A1, true), n(C2), n(A1), n(E2, true, true),
      n(A1), n(D2, true), n(A1), n(C2, false, true),
      n(A1, true), n(G2, false, true), n(A1), n(E2, true),
      n(D2), n(A1, true), n(C2, false, true), n(A1),
    ],
  },
  // ── Low-energy acid patterns ──
  {
    name: "DRIP",
    energy: "low",
    steps: [
      n(A2, true), _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, n(A1, false, true), _,
    ],
  },
  {
    name: "CRAWL",
    energy: "low",
    steps: [
      n(A1), _, n(A1, false, true), _,
      _, n(C2, false, true), _, _,
      n(D2, false, true), _, _, _,
      _, _, n(A1, false, true), _,
    ],
  },
];

// ── SYNTH PATTERNS ───────────────────────────────────────

export const SYNTH_PATTERNS: SynthPattern[] = [
  {
    name: "OFFBEAT STABS",
    energy: "mid",
    steps: [
      _, _, ch(Am), _,
      _, _, ch(Am, .6), _,
      _, _, ch(Am), _,
      _, _, ch(Am, .6), _,
    ],
  },
  {
    name: "CHORD HITS",
    energy: "mid",
    steps: [
      ch(Am), _, _, _,
      ch(Dm, .7), _, _, _,
      ch(Am), _, _, _,
      ch(Em, .7), _, _, _,
    ],
  },
  {
    name: "ARPEGGIO",
    energy: "mid",
    steps: [
      ch([57]), _, ch([60]), _,
      ch([64]), _, ch([60]), _,
      ch([57]), _, ch([60]), _,
      ch([64], .6), _, ch([67], .5), _,
    ],
  },
  {
    name: "SPARSE PAD",
    energy: "low",
    steps: [
      ch(Am, .5), _, _, _,
      _, _, _, _,
      ch(F, .4), _, _, _,
      _, _, _, _,
    ],
  },
  {
    name: "RHYTHMIC",
    energy: "high",
    steps: [
      ch(Am, .9), _, ch(Am, .4), _,
      _, ch(Am, .6), _, ch(Am, .3),
      ch(Dm, .8), _, ch(Dm, .4), _,
      _, ch(Am, .5), _, _,
    ],
  },
  // ── Low-energy synth patterns ──
  {
    name: "FOG",
    energy: "low",
    steps: [
      ch(Am, .2), _, _, _,
      _, _, _, _,
      _, _, _, _,
      _, _, ch(Em, .15), _,
    ],
  },
  {
    name: "FLICKER",
    energy: "low",
    steps: [
      _, _, _, ch([64], .2),
      _, _, _, _,
      _, ch([60], .15), _, _,
      _, _, _, _,
    ],
  },
];

// ── ATMO PRESETS ─────────────────────────────────────────

export const ATMO_PRESETS: AtmoPreset[] = [
  {
    name: "WASH",
    energy: "mid",
    type: "wash",
    filterFreq: 2000,
    filterQ: 1,
    lfoRate: 0.1,
    gain: 0.15,
  },
  {
    name: "DRONE",
    energy: "mid",
    type: "drone",
    filterFreq: 400,
    filterQ: 3,
    lfoRate: 0.05,
    gain: 0.2,
  },
  {
    name: "SWEEP",
    energy: "high",
    type: "sweep",
    filterFreq: 800,
    filterQ: 5,
    lfoRate: 0.3,
    gain: 0.12,
  },
  {
    name: "RUMBLE",
    energy: "mid",
    type: "rumble",
    filterFreq: 150,
    filterQ: 2,
    lfoRate: 0.08,
    gain: 0.25,
  },
  {
    name: "SHIMMER",
    energy: "mid",
    type: "shimmer",
    filterFreq: 6000,
    filterQ: 2,
    lfoRate: 0.2,
    gain: 0.08,
  },
  // ── Low-energy atmo presets ──
  {
    name: "VOID",
    energy: "low",
    type: "drone",
    filterFreq: 120,
    filterQ: 4,
    lfoRate: 0.03,
    gain: 0.08,
  },
  {
    name: "BREATH",
    energy: "low",
    type: "wash",
    filterFreq: 600,
    filterQ: 1.5,
    lfoRate: 0.18,
    gain: 0.05,
  },
];

// ── DEFAULTS ─────────────────────────────────────────────

export const DEFAULT_BPM = 138;
export const STEPS = 16;
