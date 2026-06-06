# Editor Toolbar And Multi Select Actions

## Task summary
Improve editor toolbar controls and expand multi-selection editing behavior.

## Scope
- Front editor toolbar, canvas interaction, property panel, and editor store.
- Removed the line drawing tool from the toolbar.
- Existing line elements remain readable/editable where already present.

## Changed files
- `src/components/editor/EditorToolbar.jsx`
- `src/components/editor/ElementPropertyPanel.jsx`
- `src/components/editor/OverlayCanvas.jsx`
- `src/components/editor/OverlayEditor.jsx`
- `src/pages/OverlayEditorPage.jsx`
- `src/store/editorStore.js`

## Verification result
- `npm run lint`: passed with the existing `react-refresh/only-export-components` warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-codex-build`: passed.

## Decisions made
- Toolbar controls now use icon-only buttons with hover titles and a two-column grid.
- `Ctrl+A` selects all editor elements when focus is not inside an input/select/textarea.
- Multi-selection copy, paste, duplicate, drag, and group resize are supported.
- Multi-selection property panel now exposes shared editable fields such as position, size, opacity, z-index, colors, stroke, corner radius, and anchors.

## Issues
- None found in this scope.

## Next steps
- Run visual QA on group resizing with mixed element sizes.
