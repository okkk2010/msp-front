# Fix Korean Text Wrapping

## Task summary
- Fixed Korean UI text wrapping in compact navigation and tab/button areas.

## Scope
- Header brand, desktop navigation links, header action area, and overlay filter tabs.
- Global Korean word-breaking behavior and common button single-line behavior.

## Changed files
- `src/components/layout/Header.jsx`
- `src/components/overlay/OverlayFilterBar.jsx`
- `src/components/common/Button.jsx`
- `src/styles/global.css`
- `docs/worklogs/_index.md`

## Verification result
- `npm run lint`: passed with one existing Fast Refresh warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-verify --emptyOutDir true`: passed.
- Browser verification was attempted, but the in-app browser runtime failed to start in this Windows sandbox.

## Decisions made
- Added `word-break: keep-all` globally to prevent Korean words from breaking between syllables.
- Added nowrap behavior to the common button style and explicit nowrap/min-width behavior to header navigation links.
- Reduced header spacing and hid the search input until wider desktop widths so navigation labels are not squeezed.

## Issues
- Existing unrelated lint warning remains in `src/hooks/useAuth.jsx`.
- Visual browser verification could not be completed due to browser runtime startup failure.

## Next steps
- Manually check the header at tablet/desktop widths if browser tooling becomes available.
