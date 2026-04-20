# Task Summary

- 문서 기준 14단계 인증, 보호 라우트, 로그인 복귀 흐름을 보강했다.

# Scope

- auth store에 인증 오류 상태 추가
- 로그인 시작 시 이전 경로를 저장하고 콜백 후 복귀하도록 구현
- `ProtectedRoute` 안내 UX와 LoginButton 동작 보강
- Header와 Mobile Drawer에 세션 확인 상태와 로그인 실패 안내 반영
- Login Callback 페이지를 실제 성공/실패 분기 화면으로 정리

# Changed Files

- `src/store/authStore.js`
- `src/utils/authRedirect.js`
- `src/hooks/useAuth.jsx`
- `src/components/auth/LoginButton.jsx`
- `src/components/layout/ProtectedRoute.jsx`
- `src/pages/LoginCallbackPage.jsx`
- `src/components/layout/Header.jsx`
- `src/components/layout/MobileDrawer.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-19_step14-auth-routes-and-access.md`

# Verification Result

- `14_auth_routes_access.md` 기준으로 보호 라우트, 로그인 콜백, Header 로그인 상태 표시를 정리했다.
- 비로그인 상태에서 보호 라우트 진입 시 로그인 후 현재 경로로 복귀하도록 세션 스토리지 기반 redirect path를 저장한다.
- `npm run build` 실행 확인: 성공

# Decisions Made

- 개발용 auth bypass는 유지하되, 실제 로그인 흐름은 redirect path 저장과 콜백 복귀로 보강했다.
- 별도 전역 라우트 리다이렉트 대신 `LoginButton`이 필요한 경로를 저장하도록 구현했다.

# Issues

- 실제 OAuth 성공 시 서버가 `/login/callback`으로 복귀하는 전체 흐름은 브라우저에서 수동 검증하지 못했다.
- `/api/auth/me`가 서버에서 500을 반환하는 환경에서는 Header와 ProtectedRoute에 오류 안내만 보인다.

# Next Steps

- 실제 로그인 세션 상태에서 `/editor`, `/library` 접근과 콜백 복귀를 수동 검증한다.
- 필요하면 14단계 후속으로 로그인 실패 전용 안내 페이지를 더 다듬는다.
