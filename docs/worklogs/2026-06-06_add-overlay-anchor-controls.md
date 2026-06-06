# Add Overlay Anchor Controls

## Task summary
Add anchor metadata for rectangle and circle overlay elements so render clients can keep edge-aligned objects attached to the intended screen or safe-frame edge.

## Scope
- Rectangle and circle elements only.
- Editor defaults, property controls, JSON builder, model docs, and client-side validator.
- Lines were intentionally left unchanged.

## Changed files
- `src/constants/elementDefaults.js`
- `src/components/editor/ElementPropertyPanel.jsx`
- `src/utils/models.js`
- `src/utils/overlayJsonBuilder.js`
- `src/utils/overlayJsonValidator.js`

## Verification result
- `npm run lint`: passed with the existing `react-refresh/only-export-components` warning in `src/hooks/useAuth.jsx`.
- `npm run build`: blocked by an existing `EPERM` unlink issue under `dist/assets`.
- `npx vite build --outDir dist-codex-build`: passed, and the temporary output directory was removed.

## Decisions made
- Default anchor is `top-left`.
- Default anchor space is `safeFrame`.
- Multi-select editing supports common anchor and anchor-space updates for rectangles and circles.

## Issues
- Existing `dist` file permissions still block the normal Vite output cleanup.

## Next steps
- Use the new anchor controls on objects that must stay attached to top, bottom, left, right, or corner positions.
