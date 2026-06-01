# Require Category Before Upload

## Task summary
- Added frontend validation so overlays cannot be uploaded without selecting a category.

## Scope
- Required `gameId` in upload field validation.
- Required `game` in overlay JSON validation.
- Marked the upload modal category select as required.

## Changed files
- `src/utils/uploadValidator.js`
- `src/utils/overlayJsonValidator.js`
- `src/components/editor/UploadOverlayModal.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-06-01_require-category-before-upload.md`

## Verification result
- `npm run build` passed.

## Decisions made
- Category is treated as required before upload, matching the backend upload contract.
- `game: null` is invalid for upload JSON validation.

## Issues
- No new issues found.

## Next steps
- Manual check should verify the upload modal blocks submission until a category is selected.
