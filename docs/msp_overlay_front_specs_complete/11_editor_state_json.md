# Editor State and Overlay JSON Specification

## 1. 문서 목적

이 문서는 msp overlay Editor의 내부 상태와 Overlay JSON 변환 구조를 정의한다.

## 2. 핵심 원칙

사용자는 JSON을 직접 작성하지 않는다.

Frontend는 Editor State를 관리하고, 업로드 또는 내보내기 시점에 Overlay JSON을 생성한다.

```text
Editor State
 → buildOverlayJson()
 → overlay.json 구조 생성
```

## 3. Editor State 구조

```js
const editorState = {
  overlayMeta: {
    name: "",
    description: "",
    code: "",
    platform: "windows",
    gameId: null,
    gameName: ""
  },
  canvas: {
    baseWidth: 1920,
    baseHeight: 1080
  },
  overlaySettings: {
    opacity: 0.85
  },
  elements: [],
  selectedElementId: null,
  editorMode: "select",
  zoom: 1
};
```

## 4. Overlay JSON 구조

```js
{
  schemaVersion: "1.0.0",
  overlayId: "ovl_001",
  name: "Minecraft Center Focus",
  platform: "windows",
  game: {
    id: "minecraft",
    name: "Minecraft"
  },
  canvas: {
    baseWidth: 1920,
    baseHeight: 1080
  },
  overlaySettings: {
    opacity: 0.85
  },
  elements: [],
  meta: {
    createdAt: "2026-04-19T11:00:00+09:00",
    updatedAt: "2026-04-19T11:00:00+09:00"
  }
}
```

## 5. buildOverlayJson

## 5.1 함수명

```js
buildOverlayJson(editorState)
```

## 5.2 역할

- Editor State를 Overlay JSON으로 변환
- overlayId 생성 또는 유지
- meta.createdAt / updatedAt 설정
- name, platform, game 동기화
- elements 정렬

## 5.3 처리 규칙

```text
name = editorState.overlayMeta.name
platform = editorState.overlayMeta.platform
game.id = editorState.overlayMeta.gameId 또는 slug
game.name = editorState.overlayMeta.gameName
canvas = editorState.canvas
overlaySettings = editorState.overlaySettings
elements = editorState.elements
```

## 6. validateOverlayJson

## 6.1 함수명

```js
validateOverlayJson(json)
```

## 6.2 검증 항목

필수 필드:

- schemaVersion
- overlayId
- name
- platform
- canvas
- overlaySettings
- elements
- meta

canvas 필수:

- baseWidth
- baseHeight

overlaySettings 필수:

- opacity

meta 필수:

- createdAt
- updatedAt

허용 element type:

- rect
- circle
- line

## 6.3 반환 구조

```js
{
  isValid: true,
  errors: [],
  summary: {
    schemaVersion: "1.0.0",
    overlayId: "ovl_001",
    platform: "windows",
    baseWidth: 1920,
    baseHeight: 1080,
    opacity: 0.85,
    elementCount: 3,
    elementTypes: ["rect", "circle", "line"]
  }
}
```

## 7. Element 기본값

## 7.1 rect

```js
{
  id: "el_001",
  type: "rect",
  x: 860,
  y: 490,
  width: 200,
  height: 100,
  rotation: 0,
  opacity: 0.6,
  zIndex: 1,
  visible: true,
  locked: false,
  fillColor: "#000000",
  strokeColor: "#FFFFFF",
  strokeWidth: 2,
  cornerRadius: 12
}
```

## 7.2 circle

```js
{
  id: "el_002",
  type: "circle",
  x: 910,
  y: 490,
  width: 100,
  height: 100,
  rotation: 0,
  opacity: 0.7,
  zIndex: 2,
  visible: true,
  locked: false,
  fillColor: "#000000",
  strokeColor: "#FFFFFF",
  strokeWidth: 2
}
```

## 7.3 line

```js
{
  id: "el_003",
  type: "line",
  x1: 500,
  y1: 500,
  x2: 700,
  y2: 500,
  opacity: 1.0,
  zIndex: 3,
  visible: true,
  locked: false,
  strokeColor: "#FFFFFF",
  strokeWidth: 3,
  dashStyle: "solid"
}
```

## 8. 완료 기준

- Editor State 구조가 명확하다.
- Editor State를 Overlay JSON으로 변환할 수 있다.
- JSON 가져오기 시 Editor State로 복원할 수 있다.
- JSON 유효성 검증이 가능하다.
