# 19. Front API Mapping Specification

## 1. 문서 목적

이 문서는 msp overlay Frontend에서 Backend API를 호출할 때 사용하는 요청/응답 매핑을 정의한다.

현재 Backend 업로드 방식은 `multipart/form-data`로 확정한다.

---

## 2. 공통 Axios 설정

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

JWT를 Authorization Header로 사용하는 경우:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

주의:

- multipart/form-data 전송 시 `Content-Type`을 직접 지정하지 않는다.
- 브라우저가 boundary를 자동 생성해야 한다.

---

## 3. Auth API

### 현재 사용자 조회

```http
GET /api/auth/me
```

응답:

```ts
ApiResponse<User>
```

사용 위치:

- 앱 초기화
- Header
- ProtectedRoute
- 로그인 상태 확인

---

## 4. Platform API

### 플랫폼 목록 조회

```http
GET /api/platforms
```

응답:

```ts
ApiResponse<Platform[]>
```

사용 위치:

- Discover Filter
- Editor Meta Panel

---

## 5. Game API

### 플랫폼별 게임 목록 조회

```http
GET /api/games?platform=windows
```

응답:

```ts
ApiResponse<Game[]>
```

처리 규칙:

- platform 변경 시 game 선택값은 초기화한다.
- game 목록은 platform 기준으로 다시 조회한다.

---

## 6. Overlay API

### 오버레이 목록 조회

```http
GET /api/overlays
```

Query Parameters:

| 파라미터 | 타입 | 설명 |
|---|---|---|
| page | number | 페이지 번호 |
| size | number | 페이지 크기 |
| keyword | string | 이름/설명/작성자 검색 |
| code | string | 6자리 코드 검색 |
| platform | string | windows/android |
| game | string | game slug 또는 id |
| sort | string | newest/updated/saved |

응답:

```ts
ApiResponse<PageResponse<OverlaySummary>>
```

---

### 오버레이 상세 조회

```http
GET /api/overlays/{id}
```

응답:

```ts
ApiResponse<OverlayDetail>
```

---

### 오버레이 생성

```http
POST /api/overlays
Content-Type: multipart/form-data
```

FormData 필드:

| key | 타입 | 필수 | 설명 |
|---|---|---:|---|
| name | string | Y | 오버레이 이름 |
| description | string | N | 설명 |
| code | string | Y | 6자리 코드 |
| platform | string | Y | windows/android |
| gameId | string | N | 게임 ID |
| overlayJson | Blob/File | Y | Front에서 생성한 overlay.json |
| thumbnail | Blob/File | N | 썸네일 이미지 |

응답:

```ts
ApiResponse<{
  id: number;
  overlayId: string;
  code: string;
}>
```

---

## 7. Library API

### 내 라이브러리 조회

```http
GET /api/library
```

응답:

```ts
ApiResponse<LibraryItem[]>
```

---

### 라이브러리 저장

```http
POST /api/library
```

요청:

```json
{
  "overlayId": 25
}
```

응답:

```ts
ApiResponse<null>
```

---

## 8. API 파일 구조

```text
src/api
 ┣ axiosInstance.ts
 ┣ authApi.ts
 ┣ platformApi.ts
 ┣ gameApi.ts
 ┣ overlayApi.ts
 ┗ libraryApi.ts
```

## 9. 공통 에러 매핑

| HTTP | 예시 코드 | Front 처리 |
|---:|---|---|
| 400 | INVALID_INPUT | 입력값 오류 표시 |
| 401 | UNAUTHORIZED | 로그인 필요 안내 |
| 403 | FORBIDDEN | 접근 권한 없음 |
| 404 | OVERLAY_NOT_FOUND | Not Found 또는 상세 없음 표시 |
| 409 | OVERLAY_CODE_DUPLICATED | 코드 중복 안내 |
| 409 | LIBRARY_ALREADY_SAVED | 이미 저장됨 처리 |
| 500 | INTERNAL_SERVER_ERROR | 서버 오류 안내 |

---

## 10. API 연동 원칙

1. API 응답은 각 api 파일에서 data만 꺼내 반환한다.
2. UI 컴포넌트에서 Axios를 직접 호출하지 않는다.
3. 페이지 또는 커스텀 훅에서 api 함수를 호출한다.
4. 업로드는 반드시 FormData를 사용한다.
5. multipart/form-data 전송 시 Content-Type 수동 지정 금지.
6. 에러 메시지는 Toast 또는 페이지 상태로 표시한다.
