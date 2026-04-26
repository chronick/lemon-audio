/**
 * SVG XY pad controls for DROP #001 — ACID TEKNO
 *
 * Two pads:
 * - Acid XY: cutoff × resonance with filter response curve
 * - Performance: intensity × texture with position trail
 */

import { LEMON_THEME as T } from "../../shared/theme.ts";
import type { AcidEngine } from "./audio.ts";

// ── Types ────────────────────────────────────────────

export interface XYPadConfig {
  width: number;
  height: number;
  label: string;
  color: string;
  cornerLabels?: [string, string, string, string]; // TL, TR, BL, BR
}

export interface XYPad {
  element: HTMLElement;
  setPosition: (x: number, y: number) => void;
  update: (step: number) => void;
  destroy: () => void;
}

// ── Shared helpers ───────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function createSVG(tag: string, attrs: Record<string, string | number>): SVGElement {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el;
}

// ── Acid XY Pad ──────────────────────────────────────

export function createAcidXYPad(engine: AcidEngine): XYPad {
  const W = 160, H = 120;
  let posX = engine.state.acid.cutoff;
  let posY = 1 - engine.state.acid.resonance; // inverted: top = high reso
  let animFrame = 0;
  let destroyed = false;

  const wrapper = document.createElement("div");
  wrapper.style.cssText = `position:relative;width:${W}px;height:${H}px;cursor:crosshair;flex-shrink:0;`;

  const svg = createSVG("svg", {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`,
  }) as SVGSVGElement;
  svg.style.cssText = `display:block;border:1px solid rgba(57,255,20,0.2);background:rgba(57,255,20,0.02);`;
  wrapper.appendChild(svg);

  // Filter response curve path
  const curvePath = createSVG("path", {
    fill: "none",
    stroke: T.neonGreen,
    "stroke-width": "1",
    opacity: "0.4",
  });
  svg.appendChild(curvePath);

  // Grid lines
  for (let i = 1; i < 4; i++) {
    svg.appendChild(createSVG("line", {
      x1: (W / 4) * i, y1: 0, x2: (W / 4) * i, y2: H,
      stroke: "rgba(255,255,255,0.04)", "stroke-width": "1",
    }));
    svg.appendChild(createSVG("line", {
      x1: 0, y1: (H / 4) * i, x2: W, y2: (H / 4) * i,
      stroke: "rgba(255,255,255,0.04)", "stroke-width": "1",
    }));
  }

  // Dot
  const dot = createSVG("circle", {
    r: 5, fill: T.neonGreen, opacity: "0.9",
  });
  svg.appendChild(dot);

  // Glow dot
  const glow = createSVG("circle", {
    r: 12, fill: "none", stroke: T.neonGreen, "stroke-width": "1", opacity: "0.3",
  });
  svg.appendChild(glow);

  // Labels
  const labelStyle = `position:absolute;font-size:0.45rem;color:${T.textDim};font-family:${T.fontMono};pointer-events:none;`;
  const lblTop = document.createElement("span");
  lblTop.style.cssText = labelStyle + "top:2px;left:50%;transform:translateX(-50%);";
  lblTop.textContent = "CUTOFF × RESO";
  wrapper.appendChild(lblTop);

  function updateCurve() {
    const cutoff = posX;
    const reso = 1 - posY;
    // Simplified biquad magnitude response
    const points: string[] = [];
    const fc = 60 * Math.pow(200, cutoff); // cutoff freq in Hz
    const Q = reso * 25;
    for (let i = 0; i < 64; i++) {
      const x = (i / 63) * W;
      const f = 20 * Math.pow(1000, i / 63); // 20Hz–20kHz
      const ratio = f / fc;
      // Approximate LP biquad magnitude
      const denom = Math.sqrt(Math.pow(1 - ratio * ratio, 2) + Math.pow(ratio / Math.max(Q, 0.5), 2));
      let mag = 1 / denom;
      // Add resonance peak
      if (Q > 1 && ratio > 0.7 && ratio < 1.4) {
        mag *= 1 + (Q - 1) * 0.1 * Math.exp(-Math.pow((ratio - 1) * 5, 2));
      }
      const db = 20 * Math.log10(Math.max(mag, 0.001));
      const y = H * 0.5 - db * (H / 60); // scale dB to pixels
      points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${clamp(y, 2, H - 2).toFixed(1)}`);
    }
    curvePath.setAttribute("d", points.join(" "));
  }

  function updateDot() {
    const cx = posX * W;
    const cy = posY * H;
    dot.setAttribute("cx", String(cx));
    dot.setAttribute("cy", String(cy));
    glow.setAttribute("cx", String(cx));
    glow.setAttribute("cy", String(cy));
  }

  function applyToEngine() {
    engine.setAcidCutoff(posX);
    engine.setAcidResonance(1 - posY);
  }

  // Pointer handling
  let dragging = false;

  function handlePointer(e: PointerEvent) {
    const rect = svg.getBoundingClientRect();
    posX = clamp((e.clientX - rect.left) / W, 0, 1);
    posY = clamp((e.clientY - rect.top) / H, 0, 1);
    applyToEngine();
    updateDot();
    updateCurve();
  }

  svg.addEventListener("pointerdown", (e) => {
    dragging = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    handlePointer(e);
  });
  svg.addEventListener("pointermove", (e) => {
    if (dragging) handlePointer(e);
  });
  svg.addEventListener("pointerup", () => { dragging = false; });

  // Animation loop for beat-synced glow
  let pulsePhase = 0;
  function animate() {
    if (destroyed) return;
    pulsePhase += 0.05;
    const pulse = 0.3 + Math.sin(pulsePhase) * 0.15;
    glow.setAttribute("opacity", String(pulse));
    animFrame = requestAnimationFrame(animate);
  }
  animate();

  updateDot();
  updateCurve();

  return {
    element: wrapper,
    setPosition(x: number, y: number) {
      posX = x;
      posY = y;
      updateDot();
      updateCurve();
    },
    update(step: number) {
      if (step % 4 === 0) {
        // Beat pulse
        glow.setAttribute("r", "16");
        setTimeout(() => glow.setAttribute("r", "12"), 100);
      }
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(animFrame);
    },
  };
}

// ── Performance XY Pad ───────────────────────────────

export function createPerformanceXYPad(engine: AcidEngine): XYPad {
  const W = 280, H = 180;
  let posX = 0.3; // intensity: low→high
  let posY = 0.5; // texture: dark→bright (inverted: top = bright)
  let animFrame = 0;
  let destroyed = false;

  // Trail buffer (circular)
  const TRAIL_SIZE = 20;
  const trail: { x: number; y: number }[] = [];

  const wrapper = document.createElement("div");
  wrapper.style.cssText = `position:relative;width:${W}px;height:${H}px;cursor:crosshair;flex-shrink:0;`;

  const svg = createSVG("svg", {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`,
  }) as SVGSVGElement;
  svg.style.cssText = `display:block;border:1px solid rgba(255,16,240,0.2);background:rgba(255,16,240,0.02);`;
  wrapper.appendChild(svg);

  // Gradient grid background
  const defs = createSVG("defs", {});
  const grad = createSVG("linearGradient", { id: "perf-grad", x1: "0", y1: "1", x2: "1", y2: "0" });
  const stop1 = createSVG("stop", { offset: "0%", "stop-color": "#1a0a2e", "stop-opacity": "0.6" });
  const stop2 = createSVG("stop", { offset: "50%", "stop-color": "#0a1a1a", "stop-opacity": "0.3" });
  const stop3 = createSVG("stop", { offset: "100%", "stop-color": "#2a1a0a", "stop-opacity": "0.6" });
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  grad.appendChild(stop3);
  defs.appendChild(grad);
  svg.appendChild(defs);

  svg.appendChild(createSVG("rect", {
    x: 0, y: 0, width: W, height: H, fill: "url(#perf-grad)",
  }));

  // Grid
  for (let i = 1; i < 6; i++) {
    svg.appendChild(createSVG("line", {
      x1: (W / 6) * i, y1: 0, x2: (W / 6) * i, y2: H,
      stroke: "rgba(255,255,255,0.03)", "stroke-width": "1",
    }));
  }
  for (let i = 1; i < 4; i++) {
    svg.appendChild(createSVG("line", {
      x1: 0, y1: (H / 4) * i, x2: W, y2: (H / 4) * i,
      stroke: "rgba(255,255,255,0.03)", "stroke-width": "1",
    }));
  }

  // Trail circles container
  const trailGroup = createSVG("g", {});
  svg.appendChild(trailGroup);

  // Dot
  const dot = createSVG("circle", {
    r: 6, fill: T.neonPink, opacity: "0.9",
  });
  svg.appendChild(dot);

  // Glow
  const glow = createSVG("circle", {
    r: 14, fill: "none", stroke: T.neonPink, "stroke-width": "1.5", opacity: "0.3",
  });
  svg.appendChild(glow);

  // Corner labels
  const corners = [
    { x: 4, y: 12, text: "bright", anchor: "start" },         // TL
    { x: W - 4, y: 12, text: "ACID SCREAMER", anchor: "end" }, // TR
    { x: 4, y: H - 4, text: "ambient/deep", anchor: "start" }, // BL
    { x: W - 4, y: H - 4, text: "dark", anchor: "end" },       // BR
  ];
  for (const c of corners) {
    const txt = createSVG("text", {
      x: c.x, y: c.y, fill: T.textDim,
      "font-size": "7", "font-family": T.fontMono,
      "text-anchor": c.anchor, opacity: "0.5",
    });
    txt.textContent = c.text;
    svg.appendChild(txt);
  }

  // Title label
  const titleLabel = document.createElement("span");
  titleLabel.style.cssText = `position:absolute;top:-14px;left:0;font-size:0.45rem;color:${T.textDim};font-family:${T.fontMono};pointer-events:none;`;
  titleLabel.textContent = "PERFORMANCE";
  wrapper.appendChild(titleLabel);

  function applyToEngine() {
    const intensity = posX;
    const texture = 1 - posY; // invert: top of pad = bright = high

    engine.applyParameterMap({
      kickLevel: 0.3 + intensity * 0.7,
      acidLevel: 0.3 + intensity * 0.7,
      kickDrive: intensity * 0.8,
      acidResonance: 0.2 + intensity * 0.6,
      acidCutoff: 0.2 + texture * 0.7,
      synthCutoff: 0.2 + texture * 0.7,
      synthLevel: 0.2 + texture * 0.5,
      atmoLevel: 0.6 - intensity * 0.4, // inverse
    });
  }

  function updateDot() {
    const cx = posX * W;
    const cy = posY * H;
    dot.setAttribute("cx", String(cx));
    dot.setAttribute("cy", String(cy));
    glow.setAttribute("cx", String(cx));
    glow.setAttribute("cy", String(cy));
  }

  function updateTrail() {
    // Clear old trail SVG
    while (trailGroup.firstChild) trailGroup.removeChild(trailGroup.firstChild);
    for (let i = 0; i < trail.length; i++) {
      const age = i / trail.length; // 0=oldest, 1=newest
      const c = createSVG("circle", {
        cx: trail[i].x * W,
        cy: trail[i].y * H,
        r: 2 + age * 2,
        fill: T.neonPink,
        opacity: String(age * 0.3),
      });
      trailGroup.appendChild(c);
    }
  }

  // Pointer handling
  let dragging = false;

  function handlePointer(e: PointerEvent) {
    const rect = svg.getBoundingClientRect();
    posX = clamp((e.clientX - rect.left) / W, 0, 1);
    posY = clamp((e.clientY - rect.top) / H, 0, 1);

    // Add to trail
    trail.push({ x: posX, y: posY });
    if (trail.length > TRAIL_SIZE) trail.shift();

    applyToEngine();
    updateDot();
    updateTrail();
  }

  svg.addEventListener("pointerdown", (e) => {
    dragging = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    handlePointer(e);
  });
  svg.addEventListener("pointermove", (e) => {
    if (dragging) handlePointer(e);
  });
  svg.addEventListener("pointerup", () => { dragging = false; });

  // Animation
  let pulsePhase = 0;
  let frameCount = 0;
  function animate() {
    if (destroyed) return;
    frameCount++;
    // Throttle to ~30fps
    if (frameCount % 2 === 0) {
      pulsePhase += 0.08;
      const pulse = 0.3 + Math.sin(pulsePhase) * 0.15;
      glow.setAttribute("opacity", String(pulse));
    }
    animFrame = requestAnimationFrame(animate);
  }
  animate();

  updateDot();

  return {
    element: wrapper,
    setPosition(x: number, y: number) {
      posX = x;
      posY = y;
      trail.push({ x: posX, y: posY });
      if (trail.length > TRAIL_SIZE) trail.shift();
      updateDot();
      updateTrail();
    },
    update(step: number) {
      if (step % 4 === 0) {
        glow.setAttribute("r", "18");
        setTimeout(() => glow.setAttribute("r", "14"), 100);
      }
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(animFrame);
    },
  };
}
