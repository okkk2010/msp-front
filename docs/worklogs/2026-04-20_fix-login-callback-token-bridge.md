# Task Summary

- Google 로그인 후 프론트 `callback` 페이지에서 인증 토큰을 복구하지 못하던 흐름을 수정했다.

# Scope

- 백엔드 OAuth 성공 리다이렉트 쿼리 파라미터와 프론트 콜백 처리 흐름 비교
- 프론트 토큰 저장 유틸 추가
- axios Authorization 헤더 자동 부착
- 로그아웃 및 초기 인증 로딩 흐름 정리

# Changed Files

- `src/api/axiosInstance.js`
- `src/hooks/useAuth.jsx`
- `src/pages/LoginCallbackPage.jsx`
- `src/utils/authTokens.js`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-20_fix-login-callback-token-bridge.md`

# Verification Result

- 코드 기준으로 백엔드는 `success`, `accessToken`, `refreshToken`, `tokenType`, `refreshTokenExpiresAt`를 `/login/callback`에 붙여 리다이렉트하고 있음을 확인했다.
- 프론트는 기존에 해당 값을 읽지 않고 바로 `/api/auth/me`를 호출해 인증 복구가 실패할 수 있음을 확인했다.
- 수정 후에는 콜백 페이지가 토큰을 저장한 다음 `/api/auth/me`를 호출하고, axios가 저장된 access token을 Authorization 헤더로 전달한다.
- `npm run build` 실행으로 프론트 빌드 검증 예정이다.

# Decisions Made

- 백엔드 리다이렉트 포맷은 유지하고, 프론트가 현재 백엔드 계약에 맞춰 토큰 브리지를 수행하도록 한정 수정했다.
- 인증 저장 방식은 현재 API 계약서의 JWT Bearer Token 방식에 맞춰 `localStorage` 기반으로 맞췄다.

# Issues

- refresh token 자동 갱신 로직은 아직 프론트에 없다.
- 실제 Google OAuth 브라우저 왕복까지는 수동 검증이 추가로 필요하다.

# Next Steps

- 프론트에서 실제 Google 로그인 후 `/login/callback` URL에 쿼리가 들어오는지 확인한다.
- access token 만료 시 `/api/auth/refresh` 연동이 필요하면 별도 작업으로 추가한다.
