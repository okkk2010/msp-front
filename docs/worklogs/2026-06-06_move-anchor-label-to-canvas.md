# Move Anchor Label To Canvas

## Task summary
Move the anchor label away from the selected object and place it on the canvas anchor reference point.

## Scope
- Front editor canvas only.
- Selected rectangle and circle anchor visualization.

## Changed files
- `src/components/editor/OverlayCanvas.jsx`

## Verification result
- `npm run lint`: passed with the existing `react-refresh/only-export-components` warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-codex-build`: passed.

## Decisions made
- Anchor labels now use the canvas reference point instead of the element anchor point.
- Labels are offset inward from the canvas edge so they stay visible on corners and edges.
- The object anchor marker remains on the shape, but text is no longer placed inside the shape.

## Issues
- None found in this scope.

## Next steps
- Review visually in the editor for very small canvas sizes.
