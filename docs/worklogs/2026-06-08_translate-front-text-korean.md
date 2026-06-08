# Translate Front Text Korean

## Task summary
- Translated user-facing front-end text to Korean.
- Recovered several mojibake Korean strings that were breaking or degrading UI copy.

## Scope
- Front-end pages, layout, overlay listing/detail, library, editor panels, auth states, validation messages, and common loading/error copy.
- Preserved API contract values, route names, enum values, and technical identifiers such as `JSON`, `Windows`, `Android`, and element type values.

## Changed files
- `src/components/auth/*`
- `src/components/common/LoadingSpinner.jsx`
- `src/components/editor/*`
- `src/components/layout/*`
- `src/components/library/*`
- `src/components/overlay/*`
- `src/constants/apiErrorMessages.js`
- `src/pages/*`
- `src/utils/dateFormat.js`
- `src/utils/overlayJsonValidator.js`
- `src/utils/thumbnailGenerator.js`
- `src/utils/uploadValidator.js`

## Verification result
- `npm run lint`: passed with one existing Fast Refresh warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-verify --emptyOutDir true`: passed.
- `npm run build`: blocked by existing `dist` file lock/permission error while deleting/writing `dist` assets.

## Decisions made
- Kept technical labels and data contract strings unchanged where translating them could affect behavior.
- Used an alternate build output directory because the existing `dist` directory had locked files.

## Issues
- Existing `dist` assets could not be unlinked or overwritten due to `EPERM`.
- Lint still reports a pre-existing Fast Refresh warning unrelated to this translation task.

## Next steps
- Unlock or remove the existing `dist` directory before running the default production build.
