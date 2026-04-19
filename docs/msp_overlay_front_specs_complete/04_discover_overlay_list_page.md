# Discover / OverlayListPage UI Specification

## 1. 문서 목적

이 문서는 msp overlay의 DiscoverPage 또는 OverlayListPage UI 구조를 정의한다.

이 페이지는 콘텐츠 탐색형 카드 UI를 사용한다.

## 2. 페이지 목적

사용자가 공개 오버레이를 검색, 필터링, 비교하고 상세 페이지로 이동할 수 있게 한다.

핵심 기능:

- 오버레이 목록 조회
- 검색
- 6자리 코드 검색
- 플랫폼 필터
- 게임 필터
- 정렬
- 카드형 콘텐츠 표시
- 저장 상태 표시

## 3. 전체 레이아웃

## Desktop

```text
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
├─────────────────────────────────────────────────────────┤
│ Discover Overlays                                       │
│ Find layouts that reduce motion sickness in 3D games.   │
│ [Search overlays, games, or code...] [Create Overlay]   │
│ [All] [Windows] [Android] [Popular] [Recent]            │
├───────────────┬─────────────────────────────────────────┤
│ Filter Sidebar│ Sort by: Newest                         │
│               │ Overlay Card                            │
│               │ Overlay Card                            │
│               │ Overlay Card                            │
└───────────────┴─────────────────────────────────────────┘
```

## Mobile

```text
Header
Page Title
Search
Filter Button
Category Chips
Card List 1 column
```

## 4. Page Header

제목:

```text
Discover Overlays
```

설명:

```text
Find overlay layouts for comfortable 3D gameplay.
```

CTA:

```text
[Create Overlay]
```

## 5. Category Tabs

MVP 탭:

```text
All
Windows
Android
Popular
Recent
```

탭 동작:

- All: 전체
- Windows: platform=windows
- Android: platform=android
- Popular: savedCount 기준 정렬, 백엔드 미구현 시 비활성 가능
- Recent: createdAt 기준 정렬

## 6. Search Area

## 6.1 Main Search

Placeholder:

```text
Search overlays, games, or creators...
```

검색 대상:

- overlay name
- description
- game name
- author

API query:

```http
GET /api/overlays?keyword={keyword}
```

## 6.2 Code Search

msp overlay만의 핵심 기능이므로 별도 강조 가능.

Placeholder:

```text
Enter 6-digit code
```

예시:

```text
A1B2C3
```

API query:

```http
GET /api/overlays?code=A1B2C3
```

## 7. Filter Sidebar

## 7.1 Platform Filter

```text
□ Windows
□ Android
```

## 7.2 Game Filter

초기 표시 예시:

```text
Minecraft
Valorant
Overwatch
Other
```

실제 데이터는 API에서 가져온다.

```http
GET /api/games?platform=windows
```

## 7.3 Overlay Type Filter

MVP에서는 DB 구조가 확정되지 않았다면 UI 제외 또는 비활성 처리한다.

향후 후보:

```text
Center Focus
Border Mask
Line Focus
Dark Mask
Minimal
```

## 8. Sort

MVP 정렬:

```text
Newest
Recently Updated
```

향후 정렬:

```text
Most Saved
Most Used
Relevance
```

## 9. Overlay Card List

카드는 세로 리스트형을 기본으로 한다.

장점:

- 설명과 메타데이터를 충분히 보여줄 수 있음
- 콘텐츠 탐색 사이트 느낌이 강함
- 썸네일, 제목, 설명, 태그, 코드, 업데이트 정보를 한 번에 표현 가능

## 10. Loading State

```text
OverlayCard Skeleton 표시
```

## 11. Empty State

```text
조건에 맞는 오버레이가 없습니다.
검색어 또는 필터를 변경해보세요.
```

## 12. Error State

```text
오버레이 목록을 불러오지 못했습니다.
잠시 후 다시 시도해주세요.
```

## 13. API

```http
GET /api/overlays?page=0&size=20&keyword=&code=&platform=&game=&sort=
```

## 14. 완료 기준

- 목록 API를 호출한다.
- 카드 리스트를 표시한다.
- 검색이 가능하다.
- 6자리 코드 검색이 가능하다.
- 플랫폼 필터가 동작한다.
- 게임 필터가 동작한다.
- 정렬 UI가 존재한다.
- 로딩 / 빈 상태 / 에러 상태가 존재한다.
