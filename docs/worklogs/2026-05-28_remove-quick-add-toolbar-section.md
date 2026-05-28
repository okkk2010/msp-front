# Remove Quick Add Toolbar Section

## Task summary
- Removed the `Quick Add` section from the editor toolbar.

## Scope
- Removed only the immediate add buttons from the toolbar.
- Kept the draw tool selection buttons intact.

## Changed files
- `src/components/editor/EditorToolbar.jsx`
- `src/components/editor/OverlayEditor.jsx`
- `src/pages/OverlayEditorPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_remove-quick-add-toolbar-section.md`

## Verification result
- `npm run build` passed.

## Decisions made
- Removed unused add props from the toolbar and editor prop chain after deleting the UI section.

## Issues
- No new issues found.

## Next steps
- Manual editor check can confirm the toolbar now only exposes tool selection and action controls.
