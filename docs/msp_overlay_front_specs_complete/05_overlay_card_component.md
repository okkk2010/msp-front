# OverlayCard Component Specification

## 1. 문서 목적

이 문서는 msp overlay의 OverlayCard 컴포넌트 구조를 정의한다.

OverlayCard는 DiscoverPage와 LibraryPage에서 공통으로 사용한다.

## 2. 카드 목적

사용자가 오버레이를 빠르게 비교할 수 있도록 다음 정보를 제공한다.

- 썸네일
- 이름
- 작성자
- 설명
- 플랫폼
- 게임
- 요소 타입
- 6자리 코드
- 저장 수 또는 저장 상태
- 업데이트 날짜

## 3. 기본 형태

```text
┌─────────────────────────────────────────────────────────┐
│ [Thumbnail]  Overlay Name                               │
│              by CreatorName                             │
│              짧은 설명 1~2줄                             │
│                                                         │
│              [Windows] [Minecraft] [Circle + Line]      │
│                                                         │
│              Code A1B2C3 · Saved 24 · Updated 3 days ago│
│                                      [Save]             │
└─────────────────────────────────────────────────────────┘
```

## 4. Props

```js
{
  id: number,
  overlayId: string,
  name: string,
  description: string,
  code: string,
  thumbnailUrl: string,
  platform: {
    id: number,
    name: string,
    slug: string
  },
  game: {
    id: number,
    displayName: string,
    slug: string
  },
  author: {
    id: number,
    name: string
  },
  elementTypes: string[],
  savedCount: number,
  isSaved: boolean,
  updatedAt: string
}
```

## 5. 표시 필드

| 필드 | 표시 여부 | 설명 |
|---|---:|---|
| thumbnailUrl | Y | 오버레이 미리보기 |
| name | Y | 카드 제목 |
| author.name | Y | 작성자 |
| description | Y | 1~2줄 제한 |
| platform.name | Y | Badge |
| game.displayName | Y | Badge |
| elementTypes | 선택 | Badge |
| code | Y | 6자리 코드 |
| savedCount | 선택 | 저장 수 |
| updatedAt | Y | 최근 수정일 |
| isSaved | Y | 저장 상태 표시 |

## 6. 카드 클릭 동작

```text
카드 본문 클릭 → /overlays/:id 이동
```

Save 버튼 클릭은 이벤트 전파를 막는다.

```text
Save 클릭 → POST /api/library
```

## 7. 스타일

```text
background: surface
border: border
hover border: primary
radius: rounded-2xl
padding: 16px
gap: 14px
transition: 150ms
```

## 8. Thumbnail

권장 비율:

```text
16:9 또는 4:3
```

MVP에서 썸네일이 없을 경우 기본 이미지 사용.

기본 이미지 내용:

```text
MSP Overlay
No Preview
```

## 9. Badge

예시:

```text
[Windows]
[Minecraft]
[Circle]
[Line]
```

## 10. Description 처리

- 최대 2줄 표시
- 넘치면 ellipsis

## 11. Code 표시

코드는 눈에 띄게 표시한다.

```text
Code A1B2C3
```

또는 badge 형태:

```text
[A1B2C3]
```

## 12. LibraryPage에서의 차이

LibraryPage에서는 다음 정보를 추가로 표시할 수 있다.

- 저장일
- Use as Template 버튼
- 상세 보기 버튼

## 13. 완료 기준

- DiscoverPage에서 재사용 가능하다.
- LibraryPage에서 재사용 가능하다.
- 저장 상태를 표시할 수 있다.
- 카드 클릭과 Save 버튼 클릭이 구분된다.
- 썸네일 없을 때 기본 상태를 표시한다.
