# Platform Icon Badges

## Task summary
- Replaced platform text badges in overlay cards and overlay detail with icon badges.

## Scope
- Discover overlay card platform display.
- Overlay detail platform display.
- Library card platform display for consistency.
- Shared platform icon badge component.

## Changed files
- `src/components/common/PlatformIconBadge.jsx`
- `src/components/common/PlatformTabs.jsx`
- `src/components/overlay/OverlayCard.jsx`
- `src/components/overlay/OverlayDetailInfo.jsx`
- `src/components/library/LibraryItemCard.jsx`
- `docs/worklogs/_index.md`

## Verification result
- `npm run lint`: passed with one existing Fast Refresh warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-verify --emptyOutDir true`: passed.

## Decisions made
- Reused the same Windows and Android inline SVG icons from platform tabs.
- Kept `aria-label` and `title` text for accessibility and hover identification.
- Applied the icon badge to Library cards as well so saved overlays match Discover/detail presentation.

## Issues
- Existing unrelated lint warning remains in `src/hooks/useAuth.jsx`.

## Next steps
- If the UI later adopts an icon library, replace inline SVGs with shared icon components.
