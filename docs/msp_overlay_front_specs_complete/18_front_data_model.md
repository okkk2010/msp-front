# 18. Front Data Model Specification

## 1. 문서 목적

이 문서는 msp overlay Frontend에서 사용하는 실제 데이터 모델을 정의한다.

UI 명세가 화면 배치를 설명한다면, 이 문서는 다음을 설명한다.

- API 응답 데이터를 Front에서 어떤 형태로 사용할지
- Editor 상태를 어떤 구조로 관리할지
- Backend DTO와 Front 모델을 어떻게 매핑할지
- Overlay JSON 구조와 Front Editor 모델의 관계

---

## 2. 기본 타입 원칙

Frontend 데이터 모델은 다음 원칙을 따른다.

1. Backend 응답 DTO를 그대로 UI 전역에서 남용하지 않는다.
2. API 응답 모델과 UI 표시 모델을 구분할 수 있게 한다.
3. Editor 내부 상태는 Overlay JSON과 최대한 가까운 구조로 유지한다.
4. 업로드 직전에는 Editor State를 Overlay JSON으로 변환한다.
5. 날짜는 서버 응답 문자열을 그대로 보관하고, 표시 시 포맷팅한다.

---

## 3. User 모델

```ts
export type User = {
  id: number;
  name: string;
  email?: string;
  profileImageUrl?: string;
};
```

사용 위치:

- Header 사용자 프로필
- 로그인 상태 판단
- 업로드 작성자 판단
- 라이브러리 요청 권한 판단

---

## 4. Platform 모델

```ts
export type Platform = {
  id: number;
  name: string;
  slug: "windows" | "android" | string;
};
```

사용 위치:

- Discover 필터
- Editor Meta Panel
- Detail Page
- OverlayCard Badge

---

## 5. Game 모델

```ts
export type Game = {
  id: number;
  slug: string;
  displayName: string;
  platformId: number;
};
```

사용 위치:

- Discover 필터
- Editor Meta Panel
- Detail Page
- OverlayCard Badge

---

## 6. Overlay Summary 모델

목록과 카드에서 사용하는 요약 모델이다.

```ts
export type OverlaySummary = {
  id: number;
  overlayId: string;
  code: string;
  name: string;
  description?: string;
  platform: Platform;
  game?: Game | null;
  thumbnailUrl?: string | null;
  author: {
    id: number;
    name: string;
  };
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
};
```

사용 위치:

- OverlayListPage
- OverlayCard
- LibraryPage

---

## 7. Overlay Detail 모델

상세 페이지와 복제 편집에서 사용하는 모델이다.

```ts
export type OverlayDetail = OverlaySummary & {
  schemaVersion: string;
  canvas: OverlayCanvas;
  overlaySettings: OverlaySettings;
  elements: OverlayElement[];
  meta: OverlayJsonMeta;
};
```

사용 위치:

- OverlayDetailPage
- Use as Template
- Editor 복제 편집
- JSON 요약 표시

---

## 8. Library Item 모델

```ts
export type LibraryItem = {
  libraryId: number;
  savedAt: string;
  overlay: OverlaySummary;
};
```

사용 위치:

- LibraryPage
- LibraryGrid
- LibraryItemCard

---

## 9. Overlay JSON 관련 모델

### OverlayCanvas

```ts
export type OverlayCanvas = {
  baseWidth: number;
  baseHeight: number;
};
```

### OverlaySettings

```ts
export type OverlaySettings = {
  opacity: number;
};
```

### OverlayJsonMeta

```ts
export type OverlayJsonMeta = {
  createdAt: string;
  updatedAt: string;
};
```

### OverlayJson

```ts
export type OverlayJson = {
  schemaVersion: string;
  overlayId: string;
  name: string;
  platform: string;
  game?: {
    id: string;
    name: string;
  } | null;
  canvas: OverlayCanvas;
  overlaySettings: OverlaySettings;
  elements: OverlayElement[];
  meta: OverlayJsonMeta;
};
```

---

## 10. Overlay Element 모델

### 공통 Element 필드

```ts
type BaseElement = {
  id: string;
  type: "rect" | "circle" | "line";
  opacity: number;
  zIndex: number;
  visible: boolean;
  locked: boolean;
};
```

### RectElement

```ts
export type RectElement = BaseElement & {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  cornerRadius: number;
};
```

### CircleElement

```ts
export type CircleElement = BaseElement & {
  type: "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
};
```

### LineElement

```ts
export type LineElement = BaseElement & {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor: string;
  strokeWidth: number;
  dashStyle: "solid" | "dash" | "dot";
};
```

### Union Type

```ts
export type OverlayElement = RectElement | CircleElement | LineElement;
```

---

## 11. Editor State 모델

Editor는 Overlay JSON을 바로 수정하기보다는 UI 조작에 필요한 상태를 추가로 가진다.

```ts
export type EditorState = {
  overlayMeta: {
    name: string;
    description: string;
    code: string;
    platform: string;
    gameId: number | null;
    gameName?: string;
  };
  canvas: OverlayCanvas;
  overlaySettings: OverlaySettings;
  elements: OverlayElement[];
  selectedElementId: string | null;
  editorMode: "select" | "rect" | "circle" | "line" | "pan";
  zoom: number;
  isDirty: boolean;
};
```

Overlay JSON과 차이점:

| EditorState | OverlayJson |
|---|---|
| UI 편집용 상태 포함 | 저장/전송용 원본 데이터 |
| selectedElementId 있음 | 없음 |
| editorMode 있음 | 없음 |
| zoom 있음 | 없음 |
| description, code 있음 | JSON 원본에는 포함하지 않고 API 메타로 전송 |

---

## 12. Overlay Create Form 모델

서버 업로드 직전에 사용하는 모델이다.

```ts
export type OverlayCreateForm = {
  name: string;
  description?: string;
  code: string;
  platform: string;
  gameId?: number | null;
  overlayJson: OverlayJson;
  thumbnail?: File | Blob | null;
};
```

---

## 13. Pagination 모델

```ts
export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
```

---

## 14. 공통 API 응답 모델

```ts
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};
```

에러 응답:

```ts
export type ApiErrorResponse = {
  success: false;
  code: string;
  message: string;
};
```

---

## 15. 모델 사용 위치 요약

| 모델 | 사용 위치 |
|---|---|
| User | AuthStore, Header |
| Platform | Filter, MetaPanel |
| Game | Filter, MetaPanel |
| OverlaySummary | Card, List, Library |
| OverlayDetail | DetailPage, Template Edit |
| LibraryItem | LibraryPage |
| EditorState | OverlayEditor |
| OverlayJson | JSON Export, Upload |
| OverlayElement | Canvas, PropertyPanel |
| OverlayCreateForm | Upload Flow |
