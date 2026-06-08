# Discover Card Section Layout

## Task summary
- Separated Discover overlay card content into clear preview, metadata, title, and action sections.
- Increased Discover card width by reducing the maximum grid column count.

## Scope
- Discover overlay card layout.
- Discover overlay grid column layout and loading skeletons.

## Changed files
- `src/components/overlay/OverlayCard.jsx`
- `src/components/overlay/OverlayGrid.jsx`

## Verification result
- `npm run lint`: passed with one existing Fast Refresh warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-verify --emptyOutDir true`: passed.

## Decisions made
- Added bordered sections so wrapping in platform/code/title areas cannot visually bleed into adjacent regions.
- Used truncated metadata pills for platform and code.
- Changed grid to 1 column on narrow screens, 2 columns from medium widths, and 3 columns on very wide screens.

## Issues
- Existing unrelated lint warning remains in `src/hooks/useAuth.jsx`.

## Next steps
- Tune card heights after reviewing real thumbnails and long overlay names in the browser.
