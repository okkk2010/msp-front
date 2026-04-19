# LibraryPage UI Specification

## 1. 문서 목적

이 문서는 msp overlay LibraryPage UI 구조를 정의한다.

LibraryPage는 로그인한 사용자가 저장한 오버레이를 확인하고 재사용하는 공간이다.

## 2. 페이지 목적

- 내 라이브러리 목록 조회
- 저장한 오버레이 확인
- 상세 페이지 이동
- 복제 편집 진입
- 플랫폼 / 게임 기준 필터링

## 3. 전체 구조

```text
┌──────────────────────────────────────────────┐
│ Header                                       │
├──────────────────────────────────────────────┤
│ My Library                                   │
│ Saved overlays for later use.                │
├──────────────────────────────────────────────┤
│ Filter Chips / Search                        │
├──────────────────────────────────────────────┤
│ OverlayCard List                             │
└──────────────────────────────────────────────┘
```

## 4. 주요 UI

- Page Title
- 저장한 오버레이 수
- 검색 입력
- 플랫폼 필터
- 게임 필터
- OverlayCard 리스트
- Empty State

## 5. API

```http
GET /api/library
```

## 6. Library Item 표시 정보

OverlayCard를 재사용하되 다음 정보를 추가할 수 있다.

- savedAt
- Use as Template 버튼
- View Detail 버튼

## 7. Empty State

```text
아직 저장한 오버레이가 없습니다.
마음에 드는 오버레이를 찾아 라이브러리에 저장해보세요.
```

버튼:

```text
[Discover Overlays]
```

## 8. Access Control

로그인 필요 페이지다.

비로그인 접근 시:

```text
로그인이 필요한 페이지입니다.
```

이후 로그인 유도.

## 9. MVP 제외 기능

- 라이브러리 삭제
- 폴더 분류
- 즐겨찾기
- 직접 클라이언트 적용 버튼
- 메모 기능

## 10. 완료 기준

- 로그인 사용자만 접근 가능하다.
- 내 라이브러리 API를 호출한다.
- 저장된 오버레이를 카드 형태로 표시한다.
- 카드에서 상세 페이지로 이동 가능하다.
- Use as Template으로 Editor 진입 가능하다.
- Empty State가 존재한다.
