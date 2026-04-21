# MSP Front Local 1st Final

## 1. 문서 목적

이 문서는 `msp-front`의 현재 구현 상태를 기준으로 로컬 1차 완료 범위를 정리한다.
기준 시점은 프론트 저장소에 반영된 React/Vite 구현이며, 서버 및 윈도우 클라이언트 연동 시 참고할 요약 문서로 사용한다.

## 2. 현재 구현 범위

- Vite + React 기반 Frontend 구성
- 공통 레이아웃, Header, Mobile Drawer, 공통 UI 구성
- Overlay 목록 / 상세 페이지 구현
- Library 페이지 구현
- Google 로그인 시작 및 callback 처리
- JWT 토큰 저장 및 API Authorization 헤더 부착
- Overlay Editor 기본 편집 기능 구현
- overlay.json Preview / Export / Import 기능 구현
- Overlay 업로드 multipart 연동
- 미저장 상태 이탈 경고 UX 구현

## 3. 기술 스택

- React 19
- React Router DOM 7
- Vite 7
- Axios
- Tailwind CSS 4

## 4. 로컬 실행 기준

### 4.1 기본 포트

- Frontend: `http://localhost:5173`
- Backend API 기본값: `http://localhost:8080`

### 4.2 주요 설정 파일

- [package.json](/d:/project/msp/msp-front/package.json:1)
- [router.jsx](/d:/project/msp/msp-front/src/app/router.jsx:1)
- [useAuth.jsx](/d:/project/msp/msp-front/src/hooks/useAuth.jsx:1)

### 4.3 주요 환경변수

- `VITE_API_BASE_URL`
- `VITE_GOOGLE_LOGIN_URL`
- `VITE_ENABLE_DEV_AUTH_BYPASS`

## 5. 현재 라우트

- `/`
- `/overlays`
- `/overlays/:overlayId`
- `/editor`
- `/editor/:overlayId`
- `/library`
- `/login/callback`
- `/not-found`

라우터 파일:

- [router.jsx](/d:/project/msp/msp-front/src/app/router.jsx:1)

## 6. 인증 구조

### 6.1 로그인 시작

- `LoginButton` 클릭 시 `beginLogin()` 호출
- 현재 경로는 sessionStorage에 저장
- 브라우저를 Backend Google 로그인 URL로 이동

### 6.2 로그인 callback

- `/login/callback`에서 쿼리 파라미터 읽음
- `accessToken`, `refreshToken`, `tokenType`, `refreshTokenExpiresAt` 저장
- 이후 `/api/auth/me` 호출로 사용자 상태 복구

### 6.3 인증 저장 방식

- access token / refresh token: `localStorage`
- 로그인 후 복귀 경로: `sessionStorage`
- Axios request interceptor에서 `Authorization` 헤더 자동 부착

관련 파일:

- [useAuth.jsx](/d:/project/msp/msp-front/src/hooks/useAuth.jsx:1)
- [LoginCallbackPage.jsx](/d:/project/msp/msp-front/src/pages/LoginCallbackPage.jsx:1)
- [axiosInstance.js](/d:/project/msp/msp-front/src/api/axiosInstance.js:1)
- [authTokens.js](/d:/project/msp/msp-front/src/utils/authTokens.js:1)

## 7. Discover / Detail / Library

### 7.1 Overlay Discover

- 목록 조회
- 검색어 / 코드 / 플랫폼 / 게임 / 정렬 필터
- 카드 클릭 시 상세 이동
- 로그인 시 라이브러리 저장 가능

### 7.2 Overlay Detail

- Overlay 상세 메타와 썸네일 표시
- 목록 복귀 가능

### 7.3 Library

- 로그인 사용자 저장 목록 조회
- 검색 / 플랫폼 / 게임 필터
- 상세 이동
- 템플릿처럼 에디터 진입

관련 파일:

- [OverlayListPage.jsx](/d:/project/msp/msp-front/src/pages/OverlayListPage.jsx:1)
- [OverlayDetailPage.jsx](/d:/project/msp/msp-front/src/pages/OverlayDetailPage.jsx:1)
- [LibraryPage.jsx](/d:/project/msp/msp-front/src/pages/LibraryPage.jsx:1)

## 8. Editor 기능

### 8.1 기본 편집

- rect / circle / line 요소 추가
- 캔버스 크기 변경
- opacity 변경
- 메타(name, description, code, platform, game) 입력
- 요소 선택 / 이동 / 속성 수정 / 삭제 / 레이어 순서 조정

### 8.2 JSON 기능

- Preview
- Export JSON
- Import JSON

### 8.3 업로드

- editor 상태를 `overlay.json`으로 변환
- 별도 썸네일 PNG 생성
- `FormData`로 Backend 업로드

### 8.4 이탈 가드

- `/editor` 진입 시 이전 편집 상태 초기화
- 미저장 상태에서 내부 라우트 이동 시 커스텀 모달 노출
- 새로고침/탭 닫기는 브라우저 기본 경고 사용

관련 파일:

- [OverlayEditorPage.jsx](/d:/project/msp/msp-front/src/pages/OverlayEditorPage.jsx:1)
- [editorStore.js](/d:/project/msp/msp-front/src/store/editorStore.js:1)
- [overlayJsonBuilder.js](/d:/project/msp/msp-front/src/utils/overlayJsonBuilder.js:1)
- [overlayFormData.js](/d:/project/msp/msp-front/src/utils/overlayFormData.js:1)
- [thumbnailGenerator.js](/d:/project/msp/msp-front/src/utils/thumbnailGenerator.js:1)

## 9. overlay.json / 업로드 규칙

- `description`은 `overlay.json` 본문이 아니라 FormData 메타로 전송
- 썸네일은 PNG blob으로 생성
- 업로드 파일명은 `overlay.json`, `thumbnail.png`
- JSON 검증은 프론트에서 1차 수행 후 서버 업로드

## 10. API 연동 상태

현재 연결된 주요 API:

- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/platforms`
- `GET /api/games`
- `GET /api/overlays`
- `GET /api/overlays/{overlayId}`
- `POST /api/overlays`
- `GET /api/library`
- `POST /api/library`

프론트는 Axios wrapper를 통해 `ApiResponse.data`만 꺼내 사용한다.

## 11. 개발 편의 기능

- dev auth bypass 지원
- API 실패 시 공통 에러 메시지 매핑
- toast 알림 사용
- API 실패 시 일부 화면에서 fallback 처리

## 12. 현재 로컬 기준 결론

현재 프론트는 로컬 1차 완료 기준에서 다음을 충족한다.

- 인증 시작 및 callback 처리 가능
- Overlay 탐색 / 상세 / 저장 흐름 가능
- 기본 Editor 편집 / JSON import-export / 업로드 가능
- Library 조회 및 필터 가능
- 서버 스키마와 업로드 포맷 불일치 이슈 정리 완료

## 13. 남은 운영 준비 항목

- 운영 API Base URL 환경변수 확정
- 운영 Google 로그인 URL 반영
- 실제 운영 도메인 기준 callback/CORS 점검
- `/editor/:overlayId` 복제 편집 실제 구현 확장
- 필요 시 refresh token 자동 갱신 UX 추가
