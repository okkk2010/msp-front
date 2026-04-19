# Task Summary

- Swagger API 문서를 기준으로 현재 프론트 구조를 서버 스펙에 맞게 조정하고 빌드 및 API 응답을 확인했다.

# Scope

- 로그인 진입 URL과 인증 확인 흐름을 서버 API 기준으로 수정
- Discover 응답 매핑을 실제 `OverlaySummaryResponse` 구조에 맞게 수정
- 상대 썸네일 경로 처리와 날짜 포맷 보완
- 서버 API 응답 및 프론트 빌드 검증

# Changed Files

- `.env.example`
- `src/api/authApi.js`
- `src/store/authStore.js`
- `src/hooks/useAuth.jsx`
- `src/components/auth/LoginButton.jsx`
- `src/pages/LoginCallbackPage.jsx`
- `src/pages/OverlayListPage.jsx`
- `src/utils/dateFormat.js`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-19_align-with-swagger-and-verify.md`

# Verification Result

- `http://localhost:8080/v3/api-docs`에서 OpenAPI 문서를 직접 확인했다.
- `GET /api/platforms` 응답 확인: 200, 데이터 정상
- `GET /api/games?platform=windows` 응답 확인: 200, 데이터 정상
- `GET /api/overlays?page=0&size=5` 응답 확인: 200, 빈 목록 정상
- `GET /api/auth/me` 응답 확인: 401, 비로그인 상태 정상
- `npm run build` 실행 확인: 성공

# Decisions Made

- 로그인 버튼은 임시 mock 로그인 대신 실제 `/api/auth/google` 진입 URL을 사용하도록 변경했다.
- 앱 시작 시 `/api/auth/me`를 호출해 세션을 확인하고, 실패 시 비로그인 상태로 정리하도록 했다.
- Discover 카드 데이터는 Swagger의 `platform`, `game`, `authorName`, `thumbnailPath` 필드 기준으로 정규화한다.

# Issues

- Swagger 기준 `POST /api/overlays`의 `thumbnail`은 현재 required로 표시된다. 기존 프론트 문서의 “thumbnail optional”과 충돌하므로 업로드 단계 구현 전에 기준 정리가 필요하다.
- `OverlaySummaryResponse`에는 `savedCount`, `isSaved`, `elementTypes`가 없다. 카드 UI는 현재 fallback 값에 의존한다.
- 로그인 콜백의 실제 리다이렉트 파라미터 규칙은 Swagger만으로는 확정되지 않는다.

# Next Steps

- 6단계 Detail 구현 전에 `GET /api/overlays/{overlayId}` 실제 응답 샘플을 확인해 상세 매핑을 맞춘다.
- 13단계 업로드 구현 전 썸네일 필수 여부를 서버 기준으로 확정한다.
