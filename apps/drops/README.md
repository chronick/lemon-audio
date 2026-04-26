# LEMON DROPS

Interactive music creation mini-apps. Each drop is a self-contained genre-focused music toy.

**Live**: https://drops.lemon.audio

## Dev

```bash
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```

## Structure

```
src/
├── shared/           # Shared across all drops
│   ├── audio.ts      # Web Audio context + utilities
│   ├── theme.ts      # Lemon color tokens
│   └── types.ts      # Drop interface + metadata types
├── drops/
│   ├── registry.ts   # Lazy-loaded drop registry
│   └── 001-acid-techno/
│       └── index.ts  # Drop #1: Acid Techno
├── main.ts           # Hash router + index page
└── style.css         # Global styles (lemon.audio theme)
```

## Adding a Drop

1. Create `src/drops/NNN-slug/index.ts` exporting a `Drop`
2. Register it in `src/drops/registry.ts`
3. Each drop gets its own genre-aware color scheme and controls

## Tech

- Vite + TypeScript (vanilla — no framework)
- Web Audio API for synthesis and playback
- SVG / Canvas / Three.js for controls and visuals (per-drop choice)
- WASM + Rust optional for high-performance DSP
