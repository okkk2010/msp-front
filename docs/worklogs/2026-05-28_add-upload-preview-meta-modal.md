# Add Upload Preview Meta Modal

## Task summary
- Changed editor upload flow to open a modal before uploading.
- Added an overlay preview at the top of the upload modal.
- Added upload metadata fields below the preview.

## Scope
- Moved upload-time editing for name, description, code, platform, and category/game into the modal.
- Kept the existing upload validation and upload API flow.
- Kept existing editor action bar behavior except that `Upload` now opens the modal.

## Changed files
- `src/components/common/Modal.jsx`
- `src/components/editor/UploadOverlayModal.jsx`
- `src/pages/OverlayEditorPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_add-upload-preview-meta-modal.md`

## Verification result
- `npm run build` passed.

## Decisions made
- The modal writes metadata directly to the existing editor store, so `buildOverlayJson`, validation, and form data generation use the entered values without a separate mapping layer.
- Category uses the existing game selection data because the current editor model stores `gameId` and `gameName`.
- The shared `Modal` component now accepts an optional `className` for larger editor dialogs.

## Issues
- No new issues found.

## Next steps
- Manual browser check should confirm platform/category loading and final upload submission.
