# Platform Tabs Icons

## Task summary
- Replaced visible Windows / Android tab text with platform icons.

## Scope
- Shared platform tabs component used by Discover and Library.

## Changed files
- `src/components/common/PlatformTabs.jsx`
- `docs/worklogs/_index.md`

## Verification result
- `npm run lint`: passed with one existing Fast Refresh warning in `src/hooks/useAuth.jsx`.
- `npx vite build --outDir dist-verify --emptyOutDir true`: passed.

## Decisions made
- Kept `aria-label` and `title` text for accessibility and hover identification.
- Used inline SVG icons to avoid adding a new dependency.

## Issues
- Existing unrelated lint warning remains in `src/hooks/useAuth.jsx`.

## Next steps
- If an icon library is added later, replace inline SVGs with the project-standard icon components.
