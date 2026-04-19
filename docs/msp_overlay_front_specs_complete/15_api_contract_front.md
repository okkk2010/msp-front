# Frontend API Contract Specification

## 1. 문서 목적

이 문서는 msp overlay Frontend가 Backend와 통신할 때 사용하는 API 계약을 정리한다.

## 2. Axios Instance

공통 API 인스턴스를 사용한다.

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});
```

## 3. Auth API

## 3.1 내 정보 조회

```http
GET /api/auth/me
```

응답 예시:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Kim Jongmin",
    "email": "user@example.com",
    "profileImageUrl": "..."
  },
  "message": "ok"
}
```

## 4. Platform API

```http
GET /api/platforms
```

용도:

- Discover 필터
- Editor Meta Panel 플랫폼 선택

## 5. Game API

```http
GET /api/games?platform=windows
```

용도:

- Discover 필터
- Editor Meta Panel 게임 선택

## 6. Overlay 목록 조회

```http
GET /api/overlays
```

Query Parameters:

```text
page
size
keyword
code
platform
game
sort
```

사용 페이지:

- OverlayListPage
- HomePage 최신 오버레이 영역

## 7. Overlay 상세 조회

```http
GET /api/overlays/{id}
```

사용 페이지:

- OverlayDetailPage
- OverlayCloneEditPage

## 8. Overlay 생성

확정 방식:

```http
POST /api/overlays
Content-Type: multipart/form-data
```

FormData:

```text
name
description
code
platform
gameId
overlayJson
thumbnail
```

주의:

- overlayJson은 Frontend가 생성한 JSON Blob이다.
- 사용자가 JSON 파일을 직접 업로드하는 것이 아니다.
- thumbnail은 MVP에서 optional이다.

## 9. Library 저장

```http
POST /api/library
```

요청:

```json
{
  "overlayId": 25
}
```

## 10. Library 조회

```http
GET /api/library
```

사용 페이지:

- LibraryPage

## 11. 공통 에러 처리

| 상태 코드 | 처리 |
|---|---|
| 400 | 입력값 오류 표시 |
| 401 | 로그인 필요 안내 |
| 403 | 접근 권한 없음 |
| 404 | Not Found 페이지 또는 메시지 |
| 409 | 중복 코드 / 중복 저장 안내 |
| 500 | 서버 오류 안내 |

## 12. 완료 기준

- API 파일이 도메인별로 분리된다.
- Axios Instance를 공통 사용한다.
- multipart/form-data 업로드가 정상 동작한다.
- 에러 응답을 공통 처리한다.
