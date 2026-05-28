# Add Canvas Paste Menu And Copy Shortcuts

## Task summary
- Added a paste-only context menu when right-clicking an empty canvas area.
- Added editor keyboard shortcuts for copy and paste with `Ctrl+C` / `Ctrl+V` and `Cmd+C` / `Cmd+V`.

## Scope
- Reused the existing editor copy/paste behavior for both context menus and shortcuts.
- Kept the existing element context menu actions unchanged.

## Changed files
- `src/components/editor/OverlayCanvas.jsx`
- `src/components/editor/OverlayEditor.jsx`
- `src/pages/OverlayEditorPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_add-canvas-paste-menu-and-copy-shortcuts.md`

## Verification result
- `npm run build` passed.

## Decisions made
- Empty canvas right-click opens only `Paste`, and it is disabled when there is no copied element.
- Copy and paste shortcuts are ignored while typing in editable controls.
- Paste logic is centralized in `OverlayEditorPage` so the element menu, canvas menu, and keyboard shortcut use the same behavior.

## Issues
- No new issues found.

## Next steps
- Manual browser check can confirm the menu position and shortcut behavior in the editor UI.
