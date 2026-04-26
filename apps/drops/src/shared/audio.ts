/** Shared AudioContext — lazily initialized on first user gesture */
let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

export function resumeAudio(): Promise<void> {
  const ac = getAudioContext();
  if (ac.state === "suspended") {
    return ac.resume();
  }
  return Promise.resolve();
}

export function getMasterGain(): GainNode {
  const ac = getAudioContext();
  const master = ac.createGain();
  master.connect(ac.destination);
  return master;
}
