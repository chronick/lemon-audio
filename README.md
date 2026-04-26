# LEMON AUDIO

Monorepo for the LEMON AUDIO platform.

## Apps

| App | Path | Deploys to | Source |
|-----|------|------------|--------|
| **website** | `apps/website` | https://lemon.audio | Static HTML, no build |
| **drops** | `apps/drops` | https://drops.lemon.audio (planned) | Vite + TypeScript, Web Audio |
| **flasher** | `apps/flasher` | https://lemon.audio/flasher | Vite + TypeScript, WebUSB |

Until the drops subdomain pipeline lands, drops is also published at
`https://lemon.audio/drops/` from `apps/website/public/drops/` (built
artifact copied in manually).

## Develop

Each app is independent. From its directory:

```bash
cd apps/drops && npm install && npm run dev    # http://localhost:5173
cd apps/flasher && npm install && npm run dev
```

Website is plain HTML — open `apps/website/public/index.html` in a browser.

## Deploy

Pushes to `main` build and publish `apps/website/public/` to GitHub
Pages → `lemon.audio`. See `.github/workflows/deploy.yml`.

Drops/flasher built artifacts are currently checked in under
`apps/website/public/{drops,flasher}/`. Long-term: replace with a CI
build step. See `vault-22e` for the pipeline plan and follow-up tasks.
