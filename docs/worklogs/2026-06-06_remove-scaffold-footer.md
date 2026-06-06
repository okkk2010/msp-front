# Remove Scaffold Footer

## Task summary
Remove the leftover `Frontend step 1 scaffold` footer area from the front page.

## Scope
- Front layout footer only.

## Changed files
- `src/components/layout/Footer.jsx`

## Verification result
- `npm run lint`: passed with the existing `react-refresh/only-export-components` warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-codex-build`: passed.

## Decisions made
- Returned `null` from the footer component so the placeholder area itself is removed, not only the text.

## Issues
- None found in this scope.

## Next steps
- Add a real footer later only if product navigation or legal links are needed.
