# 22. Upload FormData Mapping Specification

## 1. 문서 목적

이 문서는 msp overlay Frontend에서 Editor State를 서버 업로드용 FormData로 변환하는 규칙을 정의한다.

현재 Backend는 `multipart/form-data` 방식으로 구현되어 있으므로 Frontend도 이 방식에 맞춘다.

---

## 2. 업로드 원칙

1. 사용자는 JSON 파일을 직접 업로드하지 않는다.
2. 사용자는 웹 에디터에서 레이아웃을 만든다.
3. Frontend가 내부적으로 Overlay JSON을 생성한다.
4. Overlay JSON은 Blob으로 변환한다.
5. Blob을 `overlayJson` 파트로 FormData에 담는다.
6. 메타데이터도 FormData에 함께 담는다.
7. 썸네일은 MVP에서는 생략 가능하며, 이후 `thumbnail` 파트로 추가한다.

---

## 3. FormData 필드

| key | 값 | 타입 | 필수 | 설명 |
|---|---|---|---:|---|
| name | overlayMeta.name | string | Y | 오버레이 이름 |
| description | overlayMeta.description | string | N | 설명 |
| code | overlayMeta.code | string | Y | 6자리 코드 |
| platform | overlayMeta.platform | string | Y | windows/android |
| gameId | overlayMeta.gameId | string | N | 게임 ID |
| overlayJson | JSON Blob | Blob/File | Y | Front가 생성한 overlay.json |
| thumbnail | thumbnail file | File/Blob | N | 썸네일 이미지 |

---

## 4. 변환 흐름

```text
editorState
 → buildOverlayJson(editorState)
 → validateOverlayJson(overlayJson)
 → JSON.stringify(overlayJson)
 → Blob 생성
 → FormData 생성
 → formData.append(...)
 → POST /api/overlays
```

---

## 5. 코드 예시

```ts
export const buildOverlayFormData = ({
  editorState,
  overlayJson,
  thumbnail,
}: {
  editorState: EditorState;
  overlayJson: OverlayJson;
  thumbnail?: Blob | File | null;
}) => {
  const formData = new FormData();

  formData.append("name", editorState.overlayMeta.name);
  formData.append("description", editorState.overlayMeta.description ?? "");
  formData.append("code", editorState.overlayMeta.code);
  formData.append("platform", editorState.overlayMeta.platform);

  if (editorState.overlayMeta.gameId != null) {
    formData.append("gameId", String(editorState.overlayMeta.gameId));
  }

  const overlayJsonBlob = new Blob(
    [JSON.stringify(overlayJson, null, 2)],
    { type: "application/json" }
  );

  formData.append("overlayJson", overlayJsonBlob, "overlay.json");

  if (thumbnail) {
    formData.append("thumbnail", thumbnail, "thumbnail.png");
  }

  return formData;
};
```

---

## 6. Axios 전송 규칙

```ts
await api.post("/api/overlays", formData);
```

주의:

```ts
// 비추천
await api.post("/api/overlays", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

이유:

- 브라우저가 boundary를 자동으로 붙여야 한다.
- Content-Type을 수동 지정하면 boundary가 누락되어 서버에서 파싱 실패할 수 있다.

---

## 7. Thumbnail 처리 정책

### MVP 1차

```text
thumbnail 전송 생략
 → 서버 또는 Front에서 기본 썸네일 사용
```

### MVP 2차

```text
SVG Canvas를 이미지로 변환
 → Blob/File 생성
 → thumbnail 파트로 전송
```

### 수동 썸네일 업로드는 비추천

이유:

- 사용자가 직접 이미지를 준비해야 해서 UX가 떨어진다.
- Editor 결과와 썸네일이 불일치할 수 있다.

---

## 8. Upload Validation

FormData 생성 전 검증:

| 항목 | 검증 |
|---|---|
| name | 비어 있으면 안 됨 |
| code | `^[A-Z0-9]{6}$` |
| platform | windows/android 중 하나 |
| overlayJson | 유효한 Overlay JSON이어야 함 |
| opacity | 0~1 |
| elements | rect/circle/line만 허용 |

---

## 9. 성공 처리

업로드 성공 응답 예시:

```json
{
  "success": true,
  "data": {
    "id": 25,
    "overlayId": "ovl_025",
    "code": "A1B2C3"
  },
  "message": "overlay created"
}
```

Frontend 처리:

```text
성공 Toast 표시
 → editorStore 초기화 여부 확인
 → /overlays/{id} 이동
```

---

## 10. 실패 처리

| 상황 | 처리 |
|---|---|
| 코드 중복 | 코드 재생성 또는 수정 안내 |
| JSON 검증 실패 | Editor 내부 데이터 오류 안내 |
| 로그인 만료 | 로그인 필요 안내 |
| 파일 크기 초과 | 썸네일 크기 축소 안내 |
| 서버 오류 | 서버 오류 Toast 표시 |

---

## 11. 최종 업로드 정책 문장

msp overlay Frontend는 사용자가 직접 overlay.json 파일을 업로드하는 구조가 아니라, 웹 기반 SVG Editor에서 생성된 상태를 Overlay JSON으로 변환하고, 이를 Blob 형태로 FormData에 담아 multipart/form-data 방식으로 Backend에 전송한다.
