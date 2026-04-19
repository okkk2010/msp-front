# msp overlay Design System

## 1. 문서 목적

이 문서는 msp overlay Web Frontend의 공통 디자인 시스템을 정의한다.

색상은 특정 레퍼런스 사이트의 색감을 그대로 가져오지 않고, 어두운 배경과 단일 Primary Color를 중심으로 구성한다.

## 2. 디자인 톤

msp overlay는 게임 보조 도구이면서 접근성 보조 도구의 성격도 가진다.

따라서 UI는 다음 방향을 따른다.

- 다크 톤
- 기술적이고 차분한 분위기
- 과하게 화려하지 않은 게임 도구 느낌
- 콘텐츠 탐색이 쉬운 카드 구조
- 에디터에서는 작업 영역이 명확한 도구형 구조
- 버튼, 배지, 입력창은 일관된 형태 유지

## 3. Color Token

```css
:root {
  --color-bg: #0B0F19;
  --color-surface: #111827;
  --color-surface-soft: #1F2937;
  --color-border: #2D3748;
  --color-primary: #38BDF8;
  --color-primary-soft: rgba(56, 189, 248, 0.12);
  --color-text-main: #F9FAFB;
  --color-text-sub: #9CA3AF;
  --color-danger: #F87171;
  --color-success: #34D399;
  --color-warning: #FBBF24;
}
```

## 4. 색상 사용 기준

## 4.1 Background

전체 배경에 사용한다.

```text
#0B0F19
```

사용 위치:

- body
- 전체 페이지 배경
- Editor 외부 배경

## 4.2 Surface

카드, 패널, Header에 사용한다.

```text
#111827
```

사용 위치:

- OverlayCard
- Header
- Editor Panel
- Modal

## 4.3 Surface Soft

입력창, Hover, Secondary Button에 사용한다.

```text
#1F2937
```

## 4.4 Primary

하나의 포인트 컬러로 사용한다.

```text
#38BDF8
```

사용 위치:

- Primary Button
- 선택된 탭
- 선택된 도형 테두리
- 활성 상태
- Hover Border

## 5. Radius

```text
Card: rounded-2xl
Button: rounded-xl
Input: rounded-xl
Badge: rounded-full
Modal: rounded-2xl
Panel: rounded-2xl
```

## 6. Button Style

## 6.1 Primary Button

용도:

- Create Overlay
- Upload
- Save to Library

스타일:

```text
background: primary
text: dark background
radius: rounded-xl
hover: brightness up
```

## 6.2 Secondary Button

용도:

- View Detail
- Use as Template
- JSON Export

스타일:

```text
background: surface-soft
text: text-main
border: border
```

## 6.3 Ghost Button

용도:

- Header 메뉴
- 작은 액션
- 취소 버튼

스타일:

```text
background: transparent
text: text-sub
hover: surface-soft
```

## 7. Card Style

기본 카드:

```text
background: surface
border: border
radius: rounded-2xl
padding: 16px
transition: 150ms
```

Hover:

```text
border-color: primary
background: surface + slight highlight
```

## 8. Badge Style

용도:

- Platform
- Game
- Overlay Type
- Code
- Status

스타일:

```text
background: surface-soft
text: text-sub
border: border
radius: rounded-full
padding: 4px 10px
```

Primary Badge:

```text
background: primary-soft
text: primary
border: primary-soft
```

## 9. Input Style

공통 입력창:

```text
background: surface-soft
border: border
text: text-main
placeholder: text-sub
radius: rounded-xl
focus border: primary
```

## 10. Layout Spacing

권장 spacing:

```text
Page horizontal padding: 24px ~ 40px
Section gap: 32px ~ 48px
Card gap: 16px
Panel padding: 16px
Header height: 64px
```

## 11. Typography

## 11.1 Page Title

```text
font-size: 32px ~ 40px
font-weight: 700
```

## 11.2 Section Title

```text
font-size: 20px ~ 24px
font-weight: 600
```

## 11.3 Card Title

```text
font-size: 18px
font-weight: 600
```

## 11.4 Body Text

```text
font-size: 14px ~ 16px
color: text-sub
```

## 12. 최종 정리

msp overlay의 디자인 시스템은 다음 키워드로 정리한다.

```text
Dark
Clean
Technical
Card-based Discover
Tool-based Editor
Single Primary Color
```
