# Editor Toolbar and Panels Specification

## 1. 문서 목적

이 문서는 msp overlay Editor의 Toolbar, Property Panel, Meta Panel, Layer Panel 구조를 정의한다.

## 2. Toolbar

## 2.1 목적

Toolbar는 사용자가 요소를 추가하고 기본 조작을 수행하는 영역이다.

## 2.2 위치

Desktop 기준 좌측 고정 패널.

```text
Left Sidebar
width: 72px ~ 220px
```

아이콘형 또는 텍스트+아이콘형 모두 가능하다.

## 2.3 MVP 버튼

| 버튼 | 기능 |
|---|---|
| 선택 | select mode |
| 사각형 | rect 추가 |
| 원 | circle 추가 |
| 선 | line 추가 |
| 삭제 | 선택 요소 삭제 |
| 앞으로 | zIndex 증가 |
| 뒤로 | zIndex 감소 |

## 2.4 이후 추가 버튼

- 복제
- 잠금
- 숨김
- 정렬
- 가운데 배치
- Undo
- Redo

## 3. Property Panel

## 3.1 목적

선택한 요소의 속성을 수정한다.

## 3.2 표시 조건

선택 요소 없음:

```text
요소를 선택하면 속성을 수정할 수 있습니다.
```

선택 요소 있음:

- 타입별 속성 폼 표시

## 3.3 rect 속성

```text
x
y
width
height
rotation
opacity
zIndex
visible
locked
fillColor
strokeColor
strokeWidth
cornerRadius
```

## 3.4 circle 속성

```text
x
y
width
height
rotation
opacity
zIndex
visible
locked
fillColor
strokeColor
strokeWidth
```

## 3.5 line 속성

```text
x1
y1
x2
y2
opacity
zIndex
visible
locked
strokeColor
strokeWidth
dashStyle
```

## 4. Meta Panel

## 4.1 목적

오버레이 업로드에 필요한 기본 정보를 입력한다.

## 4.2 필드

| 필드 | 타입 | 필수 | 설명 |
|---|---|---:|---|
| name | text | Y | 오버레이 이름 |
| description | textarea | N | 설명 |
| code | text | Y | 6자리 코드 |
| platform | select | Y | windows / android |
| game | select | N | 게임 |
| baseWidth | number | Y | 기준 너비 |
| baseHeight | number | Y | 기준 높이 |
| opacity | slider | Y | 전체 투명도 |

## 4.3 기본값

```text
platform: windows
baseWidth: 1920
baseHeight: 1080
opacity: 0.85
```

## 4.4 코드 생성

확정 정책:

```text
자동 생성 + 직접 수정 가능
```

버튼:

```text
[Generate Code]
```

코드 규칙:

```text
^[A-Z0-9]{6}$
```

## 5. Layer Panel

## 5.1 목적

현재 elements 목록을 표시하고 선택 / 순서 변경을 지원한다.

## 5.2 표시 정보

- element type
- element id
- visible
- locked
- zIndex

## 5.3 기능

MVP:

- 요소 목록 표시
- 클릭 시 요소 선택
- 앞으로 / 뒤로 버튼과 연동

이후:

- 드래그 정렬
- 숨김 토글
- 잠금 토글
- 이름 변경

## 6. Bottom Action Bar

## 6.1 버튼

| 버튼 | 역할 |
|---|---|
| Upload | 서버 업로드 |
| Preview | 미리보기 모달 |
| Export JSON | JSON 내보내기 |
| Import JSON | JSON 가져오기 |
| Reset | 초기화 |

## 7. 완료 기준

- Toolbar에서 요소를 추가할 수 있다.
- Property Panel에서 선택 요소 속성을 수정할 수 있다.
- Meta Panel에서 업로드 정보를 입력할 수 있다.
- Layer Panel에서 요소 목록을 볼 수 있다.
- Bottom Action Bar에서 업로드와 JSON 가져오기/내보내기를 실행할 수 있다.
