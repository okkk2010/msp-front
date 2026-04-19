# Task Summary

- Editor 테스트를 막는 인증 의존성을 줄이기 위해 개발 환경 전용 auth bypass를 추가했다.

# Scope

- `AuthProvider` 초기화 시 개발 환경에서만 인증 우회 계정 주입
- `useAuth`가 bypass 활성화 시 `ProtectedRoute`를 통과하도록 조정
- `.env.example`에 개발용 인증 우회 토글 추가

# Changed Files

- `src/hooks/useAuth.jsx`
- `.env.example`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-19_add-dev-auth-bypass-for-editor-testing.md`

# Verification Result

- `npm run build` 실행 확인: 성공
- `VITE_ENABLE_DEV_AUTH_BYPASS=true`일 때 `fetchCurrentUser()` 호출 없이 인증 상태가 준비되도록 코드 경로를 확인했다.
- 프로덕션 빌드에서는 `import.meta.env.DEV` 조건 때문에 bypass가 동작하지 않는다.

# Decisions Made

- Editor 테스트 목적이므로 실제 OAuth 흐름을 바꾸지 않고 로컬 개발 환경 전용 토글로 제한했다.
- bypass 사용자 정보는 최소 필드만 가진 더미 계정으로 유지했다.

# Issues

- 이 변경은 실제 로그인 콜백 문제를 해결하는 것이 아니라 Editor 테스트를 위한 우회 수단이다.
- 실제 OAuth 콜백 연동 문제는 14단계 인증 마감 작업에서 별도로 정리해야 한다.

# Next Steps

- 로컬 `.env`에 `VITE_ENABLE_DEV_AUTH_BYPASS=true`를 넣고 Editor, Library 보호 라우트 접근을 수동 검증한다.
- 14단계에서 실제 로그인 시작, 콜백, `/api/auth/me` 세션 확인 흐름을 서버 기준으로 정리한다.
