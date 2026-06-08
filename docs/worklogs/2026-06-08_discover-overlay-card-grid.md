# Discover Overlay Card Grid

## Task summary
- Changed Discover overlay cards from horizontal list cards to compact vertical cards.
- Updated the overlay list to render as a responsive grid.

## Scope
- Discover tab overlay card layout.
- Loading skeleton grid layout.
- Small Discover page pagination copy cleanup.

## Changed files
- `src/components/overlay/OverlayCard.jsx`
- `src/components/overlay/OverlayGrid.jsx`
- `src/pages/OverlayListPage.jsx`

## Verification result
- `npm run lint`: passed with one existing Fast Refresh warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-verify --emptyOutDir true`: passed.

## Decisions made
- Kept card click navigation and save action behavior.
- Simplified card content around preview, platform, code, and a compact title for identification.
- Used a responsive grid: 1 column on narrow screens, then 2/3/4 columns as space allows.

## Issues
- Existing unrelated lint warning remains in `src/hooks/useAuth.jsx`.

## Next steps
- Optionally tune the number of grid columns after checking real content density with production data.
