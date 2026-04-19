# 20. Front State Management Specification

## 1. 문서 목적

이 문서는 msp overlay Frontend의 상태 관리 구조를 정의한다.

상태 관리는 다음 네 영역으로 나눈다.

1. 인증 상태
2. 오버레이 검색/필터 상태
3. Editor 상태
4. Toast / UI 상태

---

## 2. 상태 관리 도구

MVP에서는 Zustand 사용을 권장한다.

이유:

- Context API보다 구조가 단순하다.
- Editor 상태처럼 업데이트가 잦은 데이터에 대응하기 쉽다.
- Store 분리가 명확하다.
- React 외부 유틸에서도 접근하기 쉽다.

---

## 3. Store 구성

```text
src/store
 ┣ authStore.ts
 ┣ overlayFilterStore.ts
 ┣ editorStore.ts
 ┣ libraryStore.ts
 ┗ toastStore.ts
```

---

## 4. authStore

역할:

- 로그인 사용자 정보 보관
- 로그인 여부 판단
- 인증 로딩 상태 관리
- 로그아웃 처리

상태 구조:

```ts
type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};
```

사용 위치:

- Header
- ProtectedRoute
- Upload / Editor 접근 제어
- Library 접근 제어

---

## 5. overlayFilterStore

역할:

Discover Page의 검색 조건을 관리한다.

상태 구조:

```ts
type OverlayFilterStore = {
  keyword: string;
  code: string;
  platform: string;
  game: string;
  sort: "newest" | "updated" | "saved";
  page: number;
  size: number;
  setKeyword: (value: string) => void;
  setCode: (value: string) => void;
  setPlatform: (value: string) => void;
  setGame: (value: string) => void;
  setSort: (value: string) => void;
  setPage: (value: number) => void;
  resetFilters: () => void;
};
```

사용 위치:

- OverlayListPage
- OverlayFilterBar
- OverlaySearchBar
- OverlayCodeSearch

---

## 6. editorStore

역할:

Overlay Editor의 핵심 상태를 관리한다.

상태 구조:

```ts
type EditorStore = {
  overlayMeta: {
    name: string;
    description: string;
    code: string;
    platform: string;
    gameId: number | null;
    gameName?: string;
  };
  canvas: {
    baseWidth: number;
    baseHeight: number;
  };
  overlaySettings: {
    opacity: number;
  };
  elements: OverlayElement[];
  selectedElementId: string | null;
  editorMode: "select" | "rect" | "circle" | "line" | "pan";
  zoom: number;
  isDirty: boolean;

  setOverlayMeta: (patch: Partial<EditorStore["overlayMeta"]>) => void;
  setCanvas: (patch: Partial<EditorStore["canvas"]>) => void;
  setOverlaySettings: (patch: Partial<EditorStore["overlaySettings"]>) => void;
  addElement: (element: OverlayElement) => void;
  updateElement: (id: string, patch: Partial<OverlayElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setEditorMode: (mode: EditorStore["editorMode"]) => void;
  moveElementLayer: (id: string, direction: "front" | "back") => void;
  resetEditor: () => void;
  loadFromOverlayJson: (json: OverlayJson) => void;
};
```

---

## 7. editorStore 주요 액션 규칙

### addElement

```text
요소 추가
 → elements 배열에 추가
 → selectedElementId를 새 요소 id로 변경
 → isDirty true
```

### updateElement

```text
선택 요소 속성 수정
 → elements에서 id 기준으로 요소 찾기
 → patch 적용
 → isDirty true
```

### removeElement

```text
요소 삭제
 → elements에서 제거
 → selectedElementId null
 → isDirty true
```

### moveElementLayer

```text
front: zIndex + 1
back: zIndex - 1
정렬 기준은 zIndex
```

### loadFromOverlayJson

```text
OverlayJson 가져오기
 → overlayMeta 일부 복원
 → canvas 복원
 → overlaySettings 복원
 → elements 복원
 → selectedElementId null
 → isDirty false
```

---

## 8. libraryStore

역할:

- 현재 사용자의 라이브러리 목록 캐싱
- 저장 여부 빠른 판단

상태 구조:

```ts
type LibraryStore = {
  items: LibraryItem[];
  savedOverlayIds: Set<number>;
  setItems: (items: LibraryItem[]) => void;
  markSaved: (overlayId: number) => void;
  isSaved: (overlayId: number) => boolean;
};
```

---

## 9. toastStore

역할:

- 성공/실패/안내 메시지 표시

상태 구조:

```ts
type Toast = {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
};

type ToastStore = {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};
```

---

## 10. 상태 관리 원칙

1. API 응답 원본을 그대로 Editor State에 넣지 않는다.
2. Editor State는 Overlay JSON과 호환 가능한 구조를 유지한다.
3. selectedElementId, zoom, editorMode는 JSON에 저장하지 않는다.
4. Discover 필터 상태는 URL Query와 동기화할 수 있게 설계한다.
5. 로그인 상태는 앱 시작 시 `/api/auth/me`로 확인한다.
6. Toast는 페이지와 무관하게 전역에서 표시한다.
