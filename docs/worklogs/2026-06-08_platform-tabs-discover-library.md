# Platform Tabs Discover Library

## Task summary
- Added Windows / Android platform tabs to Discover and Library.
- Synchronized selected platform with `?platform=` query parameters.

## Scope
- `/overlays` platform-first navigation and platform-scoped filters.
- `/library` platform-first navigation and platform-scoped filters.
- Shared platform tabs component.
- Overlay filter store default platform behavior.

## Changed files
- `src/components/common/PlatformTabs.jsx`
- `src/components/overlay/OverlayFilterBar.jsx`
- `src/pages/OverlayListPage.jsx`
- `src/pages/LibraryPage.jsx`
- `src/store/overlayFilterStore.js`
- `docs/worklogs/_index.md`

## Verification result
- `npm run lint`: passed with one existing Fast Refresh warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-verify --emptyOutDir true`: passed.

## Decisions made
- Default platform is `windows`.
- `/overlays` and `/library` keep their existing routes and use `?platform=windows|android`.
- Platform selection is handled by top tabs; internal filters now focus on game/search/sort.
- Platform changes reset the selected game.

## Issues
- Existing unrelated lint warning remains in `src/hooks/useAuth.jsx`.

## Next steps
- If client apps add platform-specific deep links, reuse the same `platform` query convention for consistency.
