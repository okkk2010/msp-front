# Header and Navigation Specification

## 1. 문서 목적

이 문서는 msp overlay Web Frontend의 Header와 Navigation 구조를 정의한다.

Header는 Discover 영역과 Editor 영역 모두에서 공통으로 사용한다.

## 2. Header 기본 구조

```text
┌─────────────────────────────────────────────────────────┐
│ MSP Overlay   Discover   Editor   Library   Docs        │
│                                      Search  Create Login│
└─────────────────────────────────────────────────────────┘
```

## 3. Header 구성 요소

| 영역 | 설명 |
|---|---|
| Logo | 메인 페이지 이동 |
| Discover | 오버레이 탐색 페이지 이동 |
| Editor | 오버레이 제작 페이지 이동 |
| Library | 내 라이브러리 이동 |
| Docs | 사용법 / 문서 이동 |
| Search | 간단 검색 또는 Discover 이동 |
| Create Overlay | `/editor` 이동 |
| Login / Profile | 로그인 또는 사용자 메뉴 |

## 4. 메뉴 정의

## 4.1 Logo

표시 텍스트:

```text
MSP Overlay
```

동작:

```text
클릭 → /
```

## 4.2 Discover

동작:

```text
클릭 → /overlays
```

## 4.3 Editor

동작:

```text
로그인 상태 → /editor
비로그인 상태 → 로그인 안내
```

## 4.4 Library

동작:

```text
로그인 상태 → /library
비로그인 상태 → 로그인 안내
```

## 4.5 Docs

MVP에서는 선택 기능이다.

동작:

```text
클릭 → /docs 또는 외부 문서
```

## 5. 로그인 상태별 UI

## 5.1 비로그인 상태

표시:

```text
[Login]
[Create Overlay]
```

Create Overlay 클릭 시:

```text
로그인이 필요한 기능입니다.
```

## 5.2 로그인 상태

표시:

```text
[Create Overlay]
[Profile Avatar / User Name]
```

Profile 클릭 시 드롭다운:

```text
My Library
Settings
Logout
```

Settings는 MVP 제외 가능하다.

## 6. Mobile Header

모바일에서는 메뉴를 축약한다.

```text
┌──────────────────────────────┐
│ MSP Overlay            Menu  │
└──────────────────────────────┘
```

Menu 클릭 시 Drawer 표시:

```text
Discover
Editor
Library
Docs
Login / Profile
```

## 7. Header 스타일

```text
height: 64px
background: surface
border-bottom: border
position: sticky 또는 fixed 선택 가능
z-index: 50
```

권장:

```text
Discover/List/Detail: sticky
Editor: fixed 또는 sticky
```

Editor에서는 캔버스 작업 영역을 침범하지 않도록 Header 높이를 명확히 계산한다.

## 8. 최종 정리

Header는 모든 영역에서 공통 브랜드와 주요 이동 경로를 제공한다.

다만 Editor에서는 작업 효율이 중요하므로 메뉴를 과하게 강조하지 않고, Create / Save / Upload 같은 Editor 내부 액션은 EditorActionBar에서 처리한다.
