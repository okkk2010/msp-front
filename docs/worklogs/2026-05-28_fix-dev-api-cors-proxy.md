# Fix Dev Api Cors Proxy

## Task summary
- Fixed local development API calls failing with CORS/403 for category loading.

## Scope
- Changed development-only API routing to use the Vite dev server proxy.
- Kept production API base URL behavior unchanged.

## Changed files
- `vite.config.js`
- `src/api/axiosInstance.js`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_fix-dev-api-cors-proxy.md`

## Verification result
- `npm run build` passed.

## Decisions made
- In development, axios now uses relative `/api` URLs.
- Vite proxies `/api` requests to `VITE_API_BASE_URL`, with `changeOrigin` enabled.
- Production builds still use `VITE_API_BASE_URL` directly.

## Issues
- Existing dev server instances must be restarted for the proxy change to take effect.

## Next steps
- Restart `npm run dev` and reopen the upload modal to verify category loading.
