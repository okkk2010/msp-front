# HomePage UI Specification

## 1. 문서 목적

이 문서는 msp overlay HomePage의 UI 구조를 정의한다.

HomePage는 서비스의 목적을 빠르게 전달하고, 사용자를 Discover 또는 Editor로 이동시키는 진입 페이지다.

## 2. 페이지 목적

HomePage의 핵심 목적은 다음이다.

- msp overlay가 어떤 서비스인지 설명
- 오버레이 제작 기능으로 진입
- 공개 오버레이 탐색으로 진입
- Windows / Android 클라이언트 적용 흐름 안내

## 3. 전체 구조

```text
┌──────────────────────────────────────────────┐
│ Header                                       │
├──────────────────────────────────────────────┤
│ Hero Section                                 │
├──────────────────────────────────────────────┤
│ Feature Cards                                │
├──────────────────────────────────────────────┤
│ Latest / Recommended Overlays                │
├──────────────────────────────────────────────┤
│ How It Works                                 │
└──────────────────────────────────────────────┘
```

## 4. Hero Section

## 4.1 목적

서비스의 핵심 가치를 한 문장으로 전달한다.

## 4.2 문구 예시

```text
Create and share overlays for comfortable 3D gameplay.
```

보조 문구:

```text
3D 게임 플레이 중 발생하는 시각적 피로를 줄이기 위해,
사용자가 직접 오버레이 레이아웃을 만들고 공유할 수 있습니다.
```

## 4.3 CTA 버튼

```text
[Create Overlay]
[Discover Overlays]
```

동작:

| 버튼 | 동작 |
|---|---|
| Create Overlay | 로그인 상태면 `/editor`, 비로그인이면 로그인 안내 |
| Discover Overlays | `/overlays` 이동 |

## 5. Feature Cards

## 5.1 카드 목록

```text
Build
웹 에디터에서 도형 기반 오버레이 제작

Share
제작한 오버레이를 서버에 업로드

Save
다른 사용자의 오버레이를 내 라이브러리에 저장

Apply
Windows / Android 클라이언트에서 적용
```

## 5.2 카드 스타일

- 4개 카드 grid
- 다크 surface 배경
- Primary 아이콘 또는 강조선

## 6. Latest / Recommended Overlays

## 6.1 목적

DiscoverPage로 이동하기 전에 일부 오버레이를 미리 보여준다.

## 6.2 표시 데이터

- 최신 오버레이 4~6개
- 초기 MVP에서는 API 연동 전 정적 더미 데이터 가능

## 6.3 카드 구조

OverlayListPage의 OverlayCard를 축약해서 사용한다.

표시 정보:

- Thumbnail
- Name
- Platform
- Game
- Code

## 7. How It Works

## 7.1 목적

사용 흐름을 간단히 설명한다.

```text
1. 오버레이 제작
2. 서버 업로드
3. 라이브러리 저장
4. 클라이언트에서 적용
```

## 8. 반응형

## Desktop

- Hero 2열 구성 가능
- Feature Card 4열
- Latest Overlay 3~4열

## Mobile

- Hero 세로 배치
- Feature Card 1열
- Latest Overlay 1열

## 9. MVP 포함 범위

포함:

- Hero
- CTA 버튼
- Feature Cards
- Discover 이동
- Editor 이동

선택:

- Latest Overlay API 연동
- How It Works

## 10. 최종 정리

HomePage는 디자인을 과하게 복잡하게 만들 필요가 없다.

핵심은 사용자가 바로 다음 행동을 선택하게 만드는 것이다.

```text
오버레이를 만들 것인가?
오버레이를 찾을 것인가?
```
