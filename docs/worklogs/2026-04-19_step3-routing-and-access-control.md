# Task Summary

- 문서 기준 3단계 라우팅, 레이아웃 접근 제어, 보호 라우트 흐름을 구현했다.

# Scope

- 앱 전역 인증 컨텍스트 추가
- 보호 라우트 접근 안내 화면 구현
- Header 로그인 상태 표시와 로그아웃 액션 추가
- `/editor/:id` 복제 편집 페이지 분리
- 로그인 콜백 페이지 기본 흐름 추가

# Changed Files

- `src/api/authApi.js`
- `src/hooks/useAuth.js`
- `src/app/App.jsx`
- `src/app/router.jsx`
- `src/components/auth/LoginButton.jsx`
- `src/components/layout/Header.jsx`
- `src/components/layout/MobileDrawer.jsx`
- `src/components/layout/ProtectedRoute.jsx`
- `src/pages/LoginCallbackPage.jsx`
- `src/pages/OverlayCloneEditPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-19_step3-routing-and-access-control.md`

# Verification Result

- `14_auth_routes_access.md`와 현재 라우터 구성이 일치하는지 수동 검토했다.
- 보호 대상 라우트(`/editor`, `/editor/:id`, `/library`)가 모두 `ProtectedRoute`로 감싸져 있는지 확인했다.
- 의존성 미설치 상태라 `npm run dev`, `npm run lint`는 실행하지 못했다.

# Decisions Made

- 실제 OAuth/API 연동 전이므로 로그인 상태는 임시 localStorage 기반 컨텍스트로 관리했다.
- 비로그인 사용자는 보호 라우트 진입 시 즉시 로그인 안내 카드와 이전 페이지 이동 버튼을 보게 했다.
- `/editor/:id`는 원본 수정이 아닌 복제 편집 정책을 드러내는 별도 페이지로 분리했다.

# Issues

- `GET /api/auth/me` 실연동과 httpOnly Cookie/JWT 판단은 아직 미구현이다.
- 현재 Login 버튼과 LoginCallbackPage는 실제 백엔드 OAuth 대신 임시 인증 흐름을 사용한다.

# Next Steps

- 4단계 문서 기준으로 API 클라이언트, 데이터 모델, 상태 관리 골격을 정리한다.
- 인증 연동 단계에서 임시 localStorage 기반 인증 로직을 실제 `/api/auth/me` 흐름으로 교체한다.
