# msp overlay Frontend UI System Structure

## 1. 문서 목적

이 문서는 msp overlay Web Frontend의 전체 UI 구조를 정의한다.

이번 UI 구조는 콘텐츠 탐색 영역과 오버레이 제작 영역을 명확히 분리한다.

- Discover / Library 영역은 콘텐츠 탐색형 카드 UI를 사용한다.
- Editor 영역은 그림판형 제작 도구 UI를 사용한다.
- 전체 색상은 어두운 배경과 단일 Primary Color를 기준으로 통일한다.

## 2. 전체 UI 방향

msp overlay의 Web Frontend는 다음 두 가지 성격을 함께 가진다.

```text
1. 오버레이 탐색 사이트
2. 오버레이 제작 에디터
```

따라서 모든 페이지를 같은 폼으로 만들지 않는다.

```text
Discover / List / Detail / Library
 → 콘텐츠 탐색형 UI

Editor
 → 제작 도구형 UI
```

## 3. 페이지 그룹 분리

## 3.1 콘텐츠 탐색 그룹

대상 페이지:

- HomePage
- OverlayListPage / DiscoverPage
- OverlayDetailPage
- LibraryPage

특징:

- 카드형 콘텐츠 목록
- 검색 / 필터 / 정렬 중심
- 썸네일과 메타데이터 강조
- 사용자가 빠르게 오버레이를 비교하고 저장할 수 있는 구조

## 3.2 제작 도구 그룹

대상 페이지:

- OverlayEditorPage
- OverlayCloneEditPage
- JsonImport Modal
- Preview Modal

특징:

- 좌측 도구 패널
- 중앙 SVG Canvas
- 우측 속성 패널
- 하단 액션 바
- 도형 기반 오버레이 레이아웃 제작

## 4. 전체 페이지 구조

```text
/
 └ HomePage

/overlays
 └ OverlayListPage / DiscoverPage

/overlays/:id
 └ OverlayDetailPage

/editor
 └ OverlayEditorPage

/editor/:id
 └ OverlayCloneEditPage

/library
 └ LibraryPage

/login/callback
 └ LoginCallbackPage

/not-found
 └ NotFoundPage
```

## 5. 전체 UI 흐름

## 5.1 오버레이 탐색 흐름

```text
HomePage
 → DiscoverPage
 → OverlayDetailPage
 → Save to Library
 → LibraryPage
```

## 5.2 오버레이 제작 흐름

```text
HomePage 또는 Header
 → EditorPage
 → 도형 배치
 → Overlay JSON 내부 생성
 → multipart/form-data 업로드
 → OverlayDetailPage 이동
```

## 5.3 복제 편집 흐름

```text
OverlayDetailPage
 → Use as Template
 → /editor/:id
 → 기존 Overlay JSON을 Editor State로 변환
 → 새 오버레이로 업로드
```

## 6. UI 핵심 원칙

- 사용자는 JSON을 직접 다루지 않는다.
- JSON은 시스템 내부 저장 포맷이다.
- Discover 영역은 카드형 콘텐츠 탐색 경험을 제공한다.
- Editor 영역은 그림판형 제작 경험을 제공한다.
- 색상은 다크 배경과 Primary Color 1개를 중심으로 통일한다.
- 콘텐츠 탐색 UI와 제작 도구 UI를 억지로 동일하게 만들지 않는다.
- 공통 Header, Button, Card, Badge 스타일로 브랜드 일관성을 유지한다.

## 7. 서버 구조와의 연결

Frontend는 현재 Backend의 multipart/form-data 업로드 구조를 따른다.

업로드 시 Frontend는 다음 흐름으로 동작한다.

```text
Editor State
 → Overlay JSON 생성
 → JSON Blob 변환
 → FormData에 메타데이터 + overlayJson + thumbnail 담기
 → POST /api/overlays
```

서버는 다음 역할을 담당한다.

- 사용자 인증
- 플랫폼 / 게임 카테고리 조회
- 오버레이 목록 / 상세 조회
- Overlay JSON 검증
- 오버레이 메타데이터 저장
- 라이브러리 저장 / 조회

## 8. 최종 정리

msp overlay Frontend는 다음 구조를 기준으로 구현한다.

```text
콘텐츠 탐색은 Discover 스타일
오버레이 제작은 Editor 스타일
업로드는 multipart/form-data
JSON은 내부 데이터 포맷
사용자는 그림판 UI로 오버레이 제작
```
