# Add Editor Anchor Visual Help

## Task summary
Make anchor settings visible in the editor canvas and add hover help for property panel field labels.

## Scope
- Front editor only.
- Rectangle and circle anchor visualization.
- Property panel label text and hover descriptions.

## Changed files
- `src/components/editor/OverlayCanvas.jsx`
- `src/components/editor/ElementPropertyPanel.jsx`

## Verification result
- `npm run lint`: passed with the existing `react-refresh/only-export-components` warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-codex-build`: passed.

## Decisions made
- Anchor indicators are shown only for selected rectangle and circle elements.
- The indicator uses a crosshair, dot, and short Korean label showing anchor and anchor space.
- Property panel field labels use native hover titles for concise explanations.

## Issues
- None found in this scope.

## Next steps
- If the native browser tooltip feels too slow, replace it with a custom tooltip component.
