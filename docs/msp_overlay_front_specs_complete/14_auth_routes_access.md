# Auth, Routes, and Access Control Specification

## 1. 문서 목적

이 문서는 msp overlay Frontend의 라우팅과 접근 제어 정책을 정의한다.

## 2. Route 목록

```text
/                       HomePage
/overlays               OverlayListPage
/overlays/:id           OverlayDetailPage
/editor                 OverlayEditorPage
/editor/:id             OverlayCloneEditPage
/library                LibraryPage
/login/callback         LoginCallbackPage
/not-found              NotFoundPage
```

## 3. 접근 권한

| Route | 비로그인 | 로그인 | 설명 |
|---|---:|---:|---|
| `/` | 가능 | 가능 | 메인 |
| `/overlays` | 가능 | 가능 | 오버레이 탐색 |
| `/overlays/:id` | 가능 | 가능 | 상세 조회 |
| `/editor` | 불가 | 가능 | 새 오버레이 제작 |
| `/editor/:id` | 불가 | 가능 | 복제 편집 |
| `/library` | 불가 | 가능 | 내 라이브러리 |
| `/login/callback` | 가능 | 가능 | 로그인 콜백 |
| `/not-found` | 가능 | 가능 | 404 |

## 4. ProtectedRoute

로그인이 필요한 페이지는 ProtectedRoute로 감싼다.

대상:

- `/editor`
- `/editor/:id`
- `/library`

비로그인 접근 시:

```text
로그인이 필요한 기능입니다.
```

이후 로그인 유도 또는 이전 페이지로 복귀.

## 5. 인증 API

```http
GET /api/auth/me
```

역할:

- 현재 로그인 사용자 조회
- Header 사용자 정보 표시
- ProtectedRoute 접근 판단

## 6. Google Login

Header Login 버튼 클릭 시 Backend Google OAuth URL로 이동한다.

환경 변수 예시:

```env
VITE_GOOGLE_LOGIN_URL=http://localhost:8080/oauth2/authorization/google
```

## 7. LoginCallbackPage

역할:

- 로그인 결과 처리
- 사용자 정보 재조회
- 이전 페이지 이동
- 실패 시 안내

## 8. 저장 위치

Backend 인증 구현에 맞춘다.

가능 방식:

- httpOnly Cookie 기반
- JWT Access Token 기반

Frontend는 현재 Backend 방식에 맞춰 구현한다.

## 9. 완료 기준

- Header에서 로그인 상태가 표시된다.
- 로그인 필요 페이지 접근이 제한된다.
- 비로그인 사용자는 안내를 받는다.
- 로그인 후 Editor / Library 사용이 가능하다.
