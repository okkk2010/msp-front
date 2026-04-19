# Task Summary

- `useAuth.jsx`의 잔여 코드로 인해 발생한 Vite/Babel 문법 오류를 수정했다.

# Scope

- `src/hooks/useAuth.jsx` 파서 오류 제거

# Changed Files

- `src/hooks/useAuth.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-19_fix-useauth-syntax-error.md`

# Verification Result

- 에러 스크린샷 기준 문제 위치인 `src/hooks/useAuth.jsx:41` 부근의 불필요한 `return context;` 잔여 코드를 제거했다.
- 현재 대화에서는 `npm run dev` 재실행까지는 하지 못했다.

# Decisions Made

- 기존 Context 기반 구현의 잔여 조각만 제거하고, 현재 authStore 기반 구조는 유지했다.

# Issues

- 런타임에서 추가 오류가 있는지는 아직 재실행 확인이 필요하다.

# Next Steps

- `npm run dev`를 다시 실행해 다음 오류가 있는지 확인한다.
