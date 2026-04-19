# Frontend Project File Structure Specification

## 1. 문서 목적

이 문서는 msp overlay Frontend의 권장 폴더 구조를 정의한다.

## 2. 기본 구조

```text
src
 ┣ app
 ┃ ┣ App.jsx
 ┃ ┗ router.jsx
 ┣ pages
 ┃ ┣ HomePage.jsx
 ┃ ┣ OverlayListPage.jsx
 ┃ ┣ OverlayDetailPage.jsx
 ┃ ┣ OverlayEditorPage.jsx
 ┃ ┣ LibraryPage.jsx
 ┃ ┣ LoginCallbackPage.jsx
 ┃ ┗ NotFoundPage.jsx
 ┣ components
 ┃ ┣ common
 ┃ ┣ layout
 ┃ ┣ overlay
 ┃ ┣ editor
 ┃ ┣ library
 ┃ ┗ auth
 ┣ api
 ┃ ┣ axiosInstance.js
 ┃ ┣ authApi.js
 ┃ ┣ overlayApi.js
 ┃ ┣ platformApi.js
 ┃ ┣ gameApi.js
 ┃ ┗ libraryApi.js
 ┣ store
 ┃ ┣ authStore.js
 ┃ ┣ editorStore.js
 ┃ ┗ overlayFilterStore.js
 ┣ hooks
 ┃ ┣ useAuth.js
 ┃ ┣ useEditorCanvas.js
 ┃ ┣ useOverlaySearch.js
 ┃ ┗ useToast.js
 ┣ utils
 ┃ ┣ overlayJsonBuilder.js
 ┃ ┣ overlayJsonValidator.js
 ┃ ┣ thumbnailGenerator.js
 ┃ ┣ elementFactory.js
 ┃ ┣ dateFormat.js
 ┃ ┗ codeValidator.js
 ┣ constants
 ┃ ┣ routes.js
 ┃ ┣ overlaySchema.js
 ┃ ┣ elementDefaults.js
 ┃ ┗ editorConfig.js
 ┣ styles
 ┃ ┗ global.css
 ┗ main.jsx
```

## 3. components/common

공통 UI 컴포넌트.

```text
Button
Input
Select
Textarea
Modal
Toast
LoadingSpinner
EmptyState
ErrorMessage
Slider
ColorPicker
Badge
Card
```

## 4. components/layout

```text
AppLayout
Header
Footer
ProtectedRoute
MobileDrawer
```

## 5. components/overlay

```text
OverlayCard
OverlayGrid
OverlayFilterBar
OverlaySearchBar
OverlayCodeSearch
OverlayDetailInfo
OverlayJsonSummary
OverlayElementSummary
```

## 6. components/editor

```text
OverlayEditor
OverlayCanvas
EditorToolbar
ElementRenderer
SelectedElementBox
ElementPropertyPanel
OverlayMetaPanel
LayerPanel
EditorActionBar
EditorPreviewModal
JsonImportModal
ExportJsonButton
ImportJsonButton
UploadOverlayButton
```

## 7. components/library

```text
LibraryGrid
LibraryItemCard
```

## 8. components/auth

```text
LoginButton
UserProfileButton
AuthGuard
```

## 9. api

도메인별 API 함수를 분리한다.

```text
authApi.js
platformApi.js
gameApi.js
overlayApi.js
libraryApi.js
```

## 10. store

상태 관리는 Zustand 또는 Context API를 사용한다.

권장:

```text
authStore: 로그인 사용자 정보
editorStore: Editor 상태
overlayFilterStore: Discover 필터 상태
```

## 11. utils

핵심 유틸:

```text
overlayJsonBuilder
Overlay JSON 생성

overlayJsonValidator
Overlay JSON 검증

elementFactory
기본 요소 생성

thumbnailGenerator
썸네일 생성

codeValidator
6자리 코드 검증
```

## 12. 완료 기준

- 페이지 / 컴포넌트 / API / Store / Utils가 분리된다.
- Editor 관련 코드는 components/editor와 store/editorStore 중심으로 관리한다.
- Discover 관련 코드는 components/overlay 중심으로 관리한다.
