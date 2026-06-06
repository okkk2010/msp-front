# Enhance Editor Anchor Visualization

## Task summary
Improve editor anchor display so users can see the canvas reference point and guide line, not only a text label.

## Scope
- Front editor canvas only.
- Selected rectangle and circle elements only.

## Changed files
- `src/components/editor/OverlayCanvas.jsx`

## Verification result
- `npm run lint`: passed with the existing `react-refresh/only-export-components` warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-codex-build`: passed.

## Decisions made
- Selected anchored elements now show the canvas reference frame.
- The selected anchor point is connected to the canvas anchor reference point with a dashed line.
- The canvas reference point is marked with an orange pin and guide lines.

## Issues
- The file still contains an unused previous anchor indicator block with mojibake text. It is not rendered, and lint is explicitly suppressed for that legacy block.

## Next steps
- Clean the legacy block after normalizing file encoding in a focused cleanup.
