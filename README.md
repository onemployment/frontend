# onemployment Frontend

React + TypeScript application for the onemployment platform.

## Tech Stack

- React 19, Vite 7, TypeScript 5
- Redux Toolkit, React Router
- Vitest for unit tests
- ESLint (typescript-eslint) + Prettier

## Requirements

- Node.js 20

## Setup

- Install dependencies: `npm ci`
- Environment variables:
  - `VITE_API_URL` — Backend API base URL (not the Vite dev server). In development, if omitted, the app falls back to `http://localhost:3000` per `src/config.ts`.

Example `.env.development` (API on port 3000):

```
VITE_API_URL=http://localhost:3000
```

Example `.env.production`:

```
VITE_API_URL=https://api.onemployment.org
```

Note: The frontend dev server runs on `http://localhost:5173` (see `vite.config.ts`). Do not set `VITE_API_URL` to the Vite URL; it must point to the backend API.

## Scripts

- `npm run dev` — Start dev server (HMR) on `http://localhost:5173`
- `npm run build` — Type-check and build to `dist/`
- `npm run preview` — Preview the production build
- `npm run test` — Run unit tests (Vitest)
- `npm run test:watch` — Watch mode for tests
- `npm run lint` — Lint source files
- `npm run format:check` / `npm run format` — Prettier check/fix

## CI/CD

- GitHub Actions on push to `main`
- CI: install → lint → format check → build → unit tests
- CD: build → deploy to AWS S3 (`www.onemployment.org`) → CloudFront invalidation of `/index.html`
- Auth via GitHub OIDC (no long‑lived AWS keys)

## Production

- App: https://www.onemployment.org
- API: https://api.onemployment.org
