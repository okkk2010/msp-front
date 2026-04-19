# Editor SVG Canvas Specification

## 1. 문서 목적

이 문서는 msp overlay Editor의 SVG Canvas 구현 방식을 정의한다.

## 2. Canvas 역할

SVG Canvas는 사용자가 오버레이 요소를 배치하는 중심 작업 공간이다.

역할:

- rect / circle / line 렌더링
- 요소 선택
- 요소 이동
- 선택 요소 강조
- zoom 적용
- baseWidth / baseHeight 기준 좌표 관리

## 3. 기본 좌표계

기본 좌표계는 Overlay JSON의 canvas 기준을 따른다.

```text
baseWidth: 1920
baseHeight: 1080
```

SVG viewBox:

```html
<svg viewBox="0 0 1920 1080">
```

## 4. 화면 표시 방식

SVG는 부모 영역 크기에 맞춰 표시한다.

```text
width: 100%
height: auto
aspect-ratio: 16 / 9
```

좌표 계산은 viewBox 기준으로 유지한다.

## 5. Element 렌더링

## 5.1 rect

JSON:

```js
{
  type: "rect",
  x,
  y,
  width,
  height,
  rotation,
  opacity,
  fillColor,
  strokeColor,
  strokeWidth,
  cornerRadius
}
```

SVG:

```html
<rect x="..." y="..." width="..." height="..." rx="..." />
```

## 5.2 circle

JSON에서는 width / height를 가진 ellipse 형태로 관리한다.

SVG:

```html
<ellipse cx="..." cy="..." rx="..." ry="..." />
```

계산:

```text
cx = x + width / 2
cy = y + height / 2
rx = width / 2
ry = height / 2
```

## 5.3 line

SVG:

```html
<line x1="..." y1="..." x2="..." y2="..." />
```

## 6. zIndex 처리

SVG는 뒤에 렌더링된 요소가 위에 보인다.

따라서 렌더링 전 elements를 zIndex 기준으로 정렬한다.

```js
elements.sort((a, b) => a.zIndex - b.zIndex)
```

## 7. 요소 선택

요소 클릭 시:

```text
selectedElementId = element.id
```

선택된 요소는 별도 stroke 또는 bounding box를 표시한다.

권장 표시:

```text
primary color stroke
점선 bounding box
```

## 8. 요소 이동

이동 흐름:

```text
mousedown
 → 현재 mouse position 저장
mousemove
 → delta 계산
 → element 좌표 업데이트
mouseup
 → drag 종료
```

line 이동 시:

```text
x1 += dx
x2 += dx
y1 += dy
y2 += dy
```

rect / circle 이동 시:

```text
x += dx
y += dy
```

## 9. 좌표 변환

마우스 좌표는 화면 좌표이므로 SVG viewBox 좌표로 변환해야 한다.

필요 함수:

```js
getSvgPoint(event)
```

역할:

- clientX / clientY를 SVG 내부 좌표로 변환
- viewBox scale 반영

## 10. locked 처리

locked가 true인 요소는 다음 동작을 막는다.

- 드래그 이동
- 속성 변경
- 삭제

단, 선택은 가능하게 둘 수 있다.

## 11. visible 처리

visible이 false인 요소는 Canvas에 표시하지 않는다.

LayerPanel에서는 표시하되, 숨김 아이콘을 보여준다.

## 12. MVP 제외

- 리사이즈 핸들
- 회전 핸들
- 멀티 선택
- 그룹 선택
- 스냅 라인
- 그리드 정렬

## 13. 완료 기준

- SVG viewBox 기반 캔버스가 표시된다.
- rect / circle / line이 렌더링된다.
- zIndex 순서가 적용된다.
- 요소 클릭 선택이 가능하다.
- 선택 요소 이동이 가능하다.
- locked / visible 정책이 반영된다.
