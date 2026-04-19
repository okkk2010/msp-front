# Multipart Upload Specification

## 1. 문서 목적

이 문서는 msp overlay Frontend의 서버 업로드 방식을 정의한다.

현재 Backend는 multipart/form-data 방식으로 구현되어 있으므로 Frontend도 이에 맞춘다.

## 2. 확정 방식

```text
Content-Type: multipart/form-data
```

단, 사용자가 JSON 파일을 직접 업로드하는 것이 아니다.

Frontend가 Editor State를 Overlay JSON으로 변환하고, 이를 Blob으로 만들어 FormData에 담아 전송한다.

## 3. 업로드 흐름

```text
Editor State
 → buildOverlayJson()
 → validateOverlayJson()
 → JSON.stringify()
 → Blob 생성
 → FormData 생성
 → 메타데이터 + overlayJson Blob + thumbnail 추가
 → POST /api/overlays
```

## 4. FormData 필드

| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| name | string | Y | 오버레이 이름 |
| description | string | N | 설명 |
| code | string | Y | 6자리 코드 |
| platform | string | Y | windows / android |
| gameId | string/number | N | 게임 ID |
| overlayJson | Blob/File | Y | Frontend가 생성한 overlay.json |
| thumbnail | File/Blob | N | 썸네일 이미지 |

## 5. Frontend 코드 예시

```js
const overlayJson = buildOverlayJson(editorState);
const validation = validateOverlayJson(overlayJson);

if (!validation.isValid) {
  throw new Error(validation.errors.join("\n"));
}

const formData = new FormData();

formData.append("name", editorState.overlayMeta.name);
formData.append("description", editorState.overlayMeta.description ?? "");
formData.append("code", editorState.overlayMeta.code);
formData.append("platform", editorState.overlayMeta.platform);

if (editorState.overlayMeta.gameId) {
  formData.append("gameId", String(editorState.overlayMeta.gameId));
}

const overlayJsonBlob = new Blob(
  [JSON.stringify(overlayJson, null, 2)],
  { type: "application/json" }
);

formData.append("overlayJson", overlayJsonBlob, "overlay.json");

if (thumbnailFile) {
  formData.append("thumbnail", thumbnailFile);
}

await api.post("/api/overlays", formData);
```

## 6. Axios 주의사항

브라우저가 boundary를 자동으로 붙일 수 있도록 Content-Type을 직접 지정하지 않는 것을 권장한다.

```js
await api.post("/api/overlays", formData);
```

비추천:

```js
await api.post("/api/overlays", formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
```

## 7. 썸네일 정책

확정 정책:

```text
1차 MVP: 기본 썸네일 사용 가능
2차: Frontend에서 SVG Canvas를 이미지로 변환해 자동 생성
```

따라서 thumbnail은 MVP에서 optional로 둔다.

## 8. 업로드 전 검증

Frontend 검증:

- name 필수
- code 형식
- platform 필수
- Overlay JSON 생성 가능 여부
- Overlay JSON schema 검증

Backend 검증:

- 로그인 여부
- code 중복 여부
- platform / game 유효성
- Overlay JSON schema 검증
- 저장 처리

## 9. 업로드 성공 처리

성공 시:

```text
Toast: 업로드가 완료되었습니다.
상세 페이지 이동: /overlays/:id
```

## 10. 업로드 실패 처리

| 오류 | 처리 |
|---|---|
| 400 | 입력값 또는 JSON 오류 표시 |
| 401 | 로그인 필요 안내 |
| 409 | 코드 중복 안내 |
| 500 | 서버 오류 안내 |

## 11. 완료 기준

- Editor State에서 Overlay JSON을 생성한다.
- Overlay JSON을 Blob으로 변환한다.
- FormData에 메타데이터와 JSON Blob을 담는다.
- multipart/form-data로 서버에 업로드한다.
- 성공 시 상세 페이지로 이동한다.
