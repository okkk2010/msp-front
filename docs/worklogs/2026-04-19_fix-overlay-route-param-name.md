# Task Summary

- 상세/복제 편집 라우트의 파라미터 이름 불일치로 `/api/overlays/undefined`가 호출되던 문제를 수정했다.

# Scope

- `src/constants/routes.js` 라우트 파라미터 이름 정정

# Changed Files

- `src/constants/routes.js`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-19_fix-overlay-route-param-name.md`

# Verification Result

- 상세 페이지 URL이 `localhost:5173/overlays/ovl_front_dashboard_001` 형태일 때 라우터가 `overlayId` 파라미터를 전달하도록 수정했다.
- `npm run build` 실행 확인: 성공

# Decisions Made

- `:id` 대신 실제 페이지 구현과 서버 의미에 맞는 `:overlayId`를 사용하도록 통일했다.

# Issues

- 브라우저 콘솔의 `/api/auth/me` 500 응답은 라우트 파라미터 문제와 별개로 서버 인증 처리 이슈일 가능성이 있다.

# Next Steps

- 브라우저에서 상세 페이지를 새로고침해 `/api/overlays/ovl_front_dashboard_001`로 실제 요청되는지 확인한다.
