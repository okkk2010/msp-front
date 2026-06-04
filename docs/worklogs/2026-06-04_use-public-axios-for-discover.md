# Task Summary

Stopped public Discover data requests from sending stale Authorization headers.

# Scope

Updated frontend API clients for public overlay, platform, and game lookup requests.

# Changed Files

- `src/api/axiosInstance.js`
- `src/api/overlayApi.js`
- `src/api/platformApi.js`
- `src/api/gameApi.js`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-06-04_use-public-axios-for-discover.md`

# Verification Result

- `npm run lint` passed with the existing `src/hooks/useAuth.jsx` Fast Refresh warning.
- `npx vite build --outDir .codex\build-check --emptyOutDir true` succeeded.
- Removed temporary `.codex\build-check` output.

# Decisions Made

- Added `publicAxiosInstance` without the auth request interceptor.
- Moved public Discover-related reads to `publicAxiosInstance`.
- Kept create/update overlay requests on the authenticated `axiosInstance`.

# Issues

- None.

# Next Steps

- None.
