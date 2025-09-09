# Auth UI: Local Authentication Design & Implementation Plan

Scope: Implement a production-ready local authentication UI that aligns with backend Phase 2 (local email/password). OAuth is explicitly out-of-scope for this iteration.

## Summary of Backend Contracts (Local Only)

- POST `/api/v1/user` — Register (body: `{ email, password, username, firstName, lastName }`) → `{ message, token, user }`
- POST `/api/v1/auth/login` — Login (body: `{ email, password }`) → `{ message, token, user }`
- POST `/api/v1/auth/logout` — Logout (JWT required) → `{ message }`
- GET `/api/v1/user/me` — Get current user (JWT) → `{ user }`
- GET `/api/v1/user/validate/username?username=...` → `{ available, message, suggestions? }`
- GET `/api/v1/user/validate/email?email=...` → `{ available, message }`

Important behaviors:

- JWT expiry: 8 hours. Backend returns 401 with `TOKEN_EXPIRED` message; UI should redirect to login gracefully.
- Login is email-based, not username-based.
- Registration requires: email, password, username, firstName, lastName. Email/username uniqueness enforced; suggestions for username conflicts.
- Error messages are user-safe (do not reveal account existence beyond conflict/validation endpoints).

## Current Frontend Gaps

- Single `Auth` page handles both login and signup with fields: username/password only.
- API endpoints and payloads do not match backend design (e.g., uses `/auth/register` with `username/password`).
- No JWT handling/persistence or Authorization header propagation.
- Minimal error modeling; stores only `username` in `localStorage` instead of token + user.

## Design Principles

- React/Redux best practices: RTK + RTK Query, feature-first slices, co-located endpoints/types.
- SOLID: Separate presentation (form components) from state and side effects (RTK Query/middleware). Keep single-responsibility modules.
- Modularity: Reusable input components, validators, and debounced availability checks.
- Consistency: Reuse styling from `Auth.css`; minimal CSS additions; consistent motion patterns with existing framer-motion usage.

## Proposed UI/State Architecture

1. State Management

- Add `authSlice` (RTK) for token + current user; actions: `setCredentials`, `clearCredentials`.
- Configure `fetchBaseQuery` `prepareHeaders` to attach `Authorization: Bearer <token>` for authenticated requests.
- RTK Query endpoints live in `apiSlice` (keep single API slice) and dispatch `authSlice` updates via `onQueryStarted`.

2. API Endpoints (RTK Query)

- `register`: POST `/api/v1/user` with required fields; on success → store `{ token, user }`.
- `login`: POST `/api/v1/auth/login` with `{ email, password }` → store `{ token, user }`.
- `logout`: POST `/api/v1/auth/logout` (requires JWT) → clear credentials locally regardless of backend response.
- `getCurrentUser`: GET `/api/v1/user/me` (JWT) → refresh user in store.
- `validateUsername`: GET `/api/v1/user/validate/username?username=...` (debounced on UI).
- `validateEmail`: GET `/api/v1/user/validate/email?email=...` (debounced on UI).
- `suggestUsernames`: GET `/api/v1/user/suggest-usernames?username=...` (invoked when conflict occurs or upon user request).

3. Pages/Components

- Split current `Auth` page into two routes for clarity and SRP:
  - `LoginPage.tsx` — email/password login.
  - `RegisterPage.tsx` — complete registration form.
- Reusable components under `src/components/auth/`:
  - `AuthCard` — container with current styling/motion.
  - `TextField` — styled input with label, error, and assistive text.
  - `PasswordField` — masked input with min length and strength indicator (optional, lightweight).
  - `AvailabilityHint` — shows availability state and username suggestions.
- Utility modules under `src/features/auth/utils/`:
  - `validators.ts` — email, password, username, name validators (mirror backend regex where helpful, but defer to backend as source of truth).
  - `debounce.ts` — shared debouncer for availability checks.

4. Navigation/Guards

- Add a simple `RequireAuth` wrapper for private routes (e.g., Landing/app) that checks token presence and optionally pings `/user/me` once.
- On 401/TOKEN_EXPIRED from any endpoint, clear creds and redirect to `/login` with a toast: “Session expired. Please sign in again.”

5. Persistence

- Store `{ token, user }` in Redux and `localStorage` (key: `onemployment:auth`), hydrated on app start. Avoid storing password or sensitive data.
- Provide `selectIsAuthenticated`, `selectCurrentUser` selectors for components.

6. Error Handling UX

- Map backend errors to friendly messages:
  - 401 login: “Invalid email or password.”
  - 409 registration email: “Email already registered. Please sign in instead.”
  - 409 registration username: “Username already taken.” Also display suggestions.
  - 429: Show “Too many requests” and honor `retryAfter` by disabling inputs briefly.
  - 400 validation: Highlight specific fields using details array if returned.

## Implementation Plan (Phased)

Phase A — API + State foundations

- Update `apiSlice` baseQuery with `prepareHeaders` to attach JWT from `authSlice`.
- Add `authSlice` with `{ token: string | null, user: User | null }` and actions `setCredentials`, `clearCredentials`.
- Replace existing `register`/`login` endpoints with backend-compliant endpoints and payloads; add `logout`, `getCurrentUser`, validations, and suggestions.
- Wire `onQueryStarted` to dispatch `setCredentials` on success for `login` and `register`.

Phase B — UI structure & pages

- Create `src/pages/LoginPage.tsx` with email/password fields, error display, and submit button, reusing `AuthCard` and existing motion.
- Create `src/pages/RegisterPage.tsx` with fields: email, password, username, firstName, lastName; terms checkbox remains optional (not enforced by backend).
- Implement debounced `validateEmail` and `validateUsername` calls; on username unavailable, surface `suggestions` with click-to-apply.
- Preserve existing `Auth.css` look-and-feel; reuse classes (`auth-card`, `auth-title`, etc.) via `AuthCard` component to keep styling consistent.

Phase C — Routing, guards, persistence

- Update `main.tsx` routes: `/login` → `LoginPage`, `/signup` → `RegisterPage`.
- Add `RequireAuth` HOC to protect `/app` route; if unauthenticated → redirect to `/login`.
- On app load, hydrate `authSlice` from `localStorage`. Keep a light `getCurrentUser` call optional to refresh.

Phase D — UX polish & edge cases

- Inline field-level errors from 400 details (email/username/password/name) with aria attributes for accessibility.
- Gracefully handle 429 with temporary disable and retry messaging.
- Add minimal password strength indicator (informational) without blocking submission beyond backend rules.
- Add “Sign out” to Landing: call `logout` endpoint and clear local state; redirect to `/login`.

## File/Module Changes

New

- `src/features/auth/authSlice.ts` — token/user state, selectors.
- `src/components/auth/AuthCard.tsx` — wrapper using existing styles and motion.
- `src/components/auth/TextField.tsx` — labeled input with error prop.
- `src/components/auth/PasswordField.tsx` — password with strength hint (optional), minLength=8.
- `src/pages/LoginPage.tsx` — email/password form.
- `src/pages/RegisterPage.tsx` — registration form with validations + suggestions.
- `src/features/auth/utils/validators.ts` — mirrors backend regexes.
- `src/features/auth/utils/debounce.ts` — small debounce util (or use lodash.debounce if already present; otherwise, keep local).

Updated

- `src/store/apiSlice.ts`
  - Correct endpoints and payloads.
  - Add `prepareHeaders` to attach JWT.
  - Add endpoints: `logout`, `getCurrentUser`, `validateEmail`, `validateUsername`, `suggestUsernames`.
- `src/store/index.ts`
  - Register `authSlice` reducer.
  - Add rehydration on init (optional small effect in `main.tsx`).
- `src/main.tsx`
  - Update routes to `LoginPage` and `RegisterPage`.
  - Optionally load persisted auth state before render.
- `src/pages/Landing.tsx`
  - Replace `localStorage` username logic with `authSlice` user and a `Sign out` action that calls `logout`.
- `src/pages/Auth.tsx`
  - Deprecate and remove after migration; or temporarily route legacy paths to new pages.

## Validation & Types (Client-side)

- Email: HTML5 email + basic regex; backend is source of truth.
- Password: minLength 8; optional client-side complexity hint; enforce via backend.
- Username: GitHub-like pattern: `^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$`.
- Name: `^[a-zA-Z\s\-'\.]+$` (align with backend). Trim inputs.

## Security Considerations (Frontend)

- Store JWT in memory + localStorage with minimal footprint; never store password.
- Always send JWT in Authorization header; do not expose token in URLs.
- On 401 (‘Invalid token’ or ‘TOKEN_EXPIRED’), clear state and route to `/login`.
- CSRF is not applicable to pure token auth; still ensure CORS is respected (backend configured).

## Accessibility

- Use `label` for all inputs; `aria-invalid` on error; describe errors near fields.
- Keyboard-accessible controls; proper focus states (existing CSS focus styles used).

## Acceptance Criteria

- Login with valid email/password authenticates and navigates to `/app`; token stored; user shown in header.
- Invalid login shows backend message “Invalid email or password”.
- Registration with required fields succeeds; user is logged in; token stored.
- Username/email availability shown within 500–800ms of pause; conflicts show suggestions.
- Authenticated requests include `Authorization: Bearer` header.
- Token expiry during use signs user out and redirects to `/login` with session-expired notice.

## Task Checklist

1. Add `authSlice` + selectors + persistence hooks.
2. Update `apiSlice` endpoints to backend spec; add validations/suggestions.
3. Implement `LoginPage` and `RegisterPage` with reusable components.
4. Replace legacy `Auth.tsx` routes; wire guards and logout.
5. Hook `Landing.tsx` to auth state and logout mutation.
6. QA flows: registration, login, logout, token expiry handling, validation endpoints.

---

Notes

- Keep code changes focused; do not introduce new global styling systems.
- Reuse `Auth.css` classes for visual consistency via the `AuthCard` wrapper.
- Avoid introducing additional dependencies unless necessary; prefer small local utilities.

## Pure TDD Plan (Unit Tests Only)

- Runner: Vitest (node env). Scope limited to unit tests now.

Phase 0 — Test Infrastructure

- Add `vitest.config.ts` with `environment: 'node'` and `include: ['tests/**/*.test.ts']`.
- Add npm scripts: `test` (run), `test:watch`.
- Keep tests under `frontend/tests/unit/*` (outside `src/`) to avoid build interference.

Phase 1 — Auth State (authSlice)

- Write failing tests for initial state, `setCredentials`, `clearCredentials`, and selectors.
- Implement minimal `src/features/auth/authSlice.ts` to pass tests.

Phase 2 — Header Attachment Utility

- Write failing tests for `attachAuthHeader(headers, token)` behavior.
- Implement `src/features/auth/tokenHeader.ts` and wire later in `apiSlice`.

Phase 3 — Validators (client-side hints)

- Write failing tests for `validators.ts`: email/username/password/name.
- Implement `src/features/auth/utils/validators.ts` minimal logic.

Phase 4 — Persistence Helpers

- Write failing tests for `persistAuth`/`hydrateAuth` around `localStorage` key `onemployment:auth`.
- Implement `src/features/auth/utils/persistence.ts`.

Phase 5 — Response Mappers

- Write failing tests for mapping login/register responses to `{ token, user }`.
- Implement `src/features/auth/utils/mappers.ts`.

Later (not in unit-only phase)

- Component tests and MSW-based integration tests.
