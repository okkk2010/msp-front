# 21. Editor Data Flow Specification

## 1. 문서 목적

이 문서는 msp overlay Editor에서 발생하는 기능별 데이터 흐름을 정의한다.

Editor는 사용자가 그림판처럼 조작하지만, 내부적으로는 Overlay JSON 구조를 만들기 위한 상태 관리 도구다.

---

## 2. Editor 전체 데이터 흐름

```text
사용자 조작
 → editorStore 변경
 → SVG Canvas 재렌더링
 → Property Panel 동기화
 → 업로드 시 Overlay JSON 생성
 → FormData 구성
 → Backend 전송
```

---

## 3. 새 오버레이 생성 흐름

```text
/editor 진입
 → editorStore 초기화
 → 기본 canvas 설정
 → 기본 overlaySettings 설정
 → 빈 elements 배열 준비
 → code 자동 생성
```

초기값:

```ts
{
  overlayMeta: {
    name: "",
    description: "",
    code: generateCode(),
    platform: "windows",
    gameId: null
  },
  canvas: {
    baseWidth: 1920,
    baseHeight: 1080
  },
  overlaySettings: {
    opacity: 0.85
  },
  elements: [],
  selectedElementId: null,
  editorMode: "select",
  zoom: 1,
  isDirty: false
}
```

---

## 4. 기존 오버레이를 템플릿으로 사용하는 흐름

정책:

- 기존 오버레이 원본은 수정하지 않는다.
- `/editor/:id`는 복제 편집으로 동작한다.

```text
상세 페이지에서 Use as Template 클릭
 → /editor/:id 이동
 → GET /api/overlays/{id}
 → OverlayDetail 수신
 → elements / canvas / settings 복원
 → name은 "Copy of ..." 형태로 설정 가능
 → code는 새 코드 자동 생성
 → overlayId는 업로드 시 새로 생성
```

---

## 5. 요소 추가 흐름

### rect 추가

```text
Toolbar에서 Rect 클릭
 → createRectElement()
 → editorStore.addElement(rect)
 → selectedElementId = rect.id
 → Canvas에 rect 표시
 → Property Panel에 rect 속성 표시
```

### circle 추가

```text
Toolbar에서 Circle 클릭
 → createCircleElement()
 → editorStore.addElement(circle)
 → selectedElementId = circle.id
 → Canvas에 circle 표시
```

### line 추가

```text
Toolbar에서 Line 클릭
 → createLineElement()
 → editorStore.addElement(line)
 → selectedElementId = line.id
 → Canvas에 line 표시
```

---

## 6. 요소 선택 흐름

```text
SVG Canvas에서 요소 클릭
 → event.stopPropagation()
 → editorStore.selectElement(element.id)
 → 선택 표시 렌더링
 → Property Panel 갱신
```

Canvas 빈 영역 클릭:

```text
Canvas background 클릭
 → selectedElementId = null
 → Property Panel은 안내 문구 표시
```

---

## 7. 요소 이동 흐름

### rect / circle 이동

```text
mousedown
 → selectedElementId 설정
 → drag 시작 좌표 저장
mousemove
 → 현재 좌표와 시작 좌표 차이 계산
 → x, y 업데이트
mouseup
 → drag 종료
```

계산 규칙:

```text
newX = originalX + deltaX / zoom
newY = originalY + deltaY / zoom
```

### line 이동

line은 시작점과 끝점을 함께 이동한다.

```text
newX1 = originalX1 + deltaX / zoom
newY1 = originalY1 + deltaY / zoom
newX2 = originalX2 + deltaX / zoom
newY2 = originalY2 + deltaY / zoom
```

---

## 8. 속성 수정 흐름

```text
Property Panel에서 값 변경
 → updateElement(id, patch)
 → elements 배열 업데이트
 → Canvas 재렌더링
 → JSON 변환 대상 상태도 자동 반영
```

---

## 9. 요소 삭제 흐름

```text
삭제 버튼 클릭
 → selectedElementId 확인
 → removeElement(selectedElementId)
 → elements 배열에서 제거
 → selectedElementId null
 → Property Panel 초기 상태
```

키보드 Delete 지원은 MVP 이후 가능하다.

---

## 10. 레이어 변경 흐름

```text
앞으로 버튼 클릭
 → 선택 요소 zIndex + 1
 → elements 정렬
 → Canvas 렌더링 순서 갱신
```

```text
뒤로 버튼 클릭
 → 선택 요소 zIndex - 1
 → elements 정렬
```

렌더링 규칙:

```ts
const renderedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
```

---

## 11. JSON 생성 흐름

```text
업로드 또는 JSON 내보내기 클릭
 → buildOverlayJson(editorState)
 → validateOverlayJson(overlayJson)
 → 성공 시 다음 단계 진행
 → 실패 시 errors 표시
```

생성 시 보정 항목:

- schemaVersion = "1.0.0"
- overlayId = 새 ID 또는 임시 ID
- name = overlayMeta.name
- platform = overlayMeta.platform
- game = gameId 기반 매핑
- canvas = editorState.canvas
- overlaySettings = editorState.overlaySettings
- elements = editorState.elements
- meta.createdAt = 최초 생성 시각
- meta.updatedAt = 현재 시각

---

## 12. JSON 가져오기 흐름

```text
JSON 가져오기 버튼 클릭
 → 파일 선택
 → FileReader.readAsText
 → JSON.parse
 → validateOverlayJson
 → 성공 시 loadFromOverlayJson
 → 실패 시 에러 표시
```

주의:

- 가져온 JSON에 image/text element가 있으면 실패 처리한다.
- schemaVersion이 지원되지 않으면 실패 처리한다.
- 가져오기 후 code는 새로 생성하는 것을 권장한다.

---

## 13. JSON 내보내기 흐름

```text
JSON 내보내기 버튼 클릭
 → buildOverlayJson
 → validateOverlayJson
 → Blob 생성
 → a 태그 download 트리거
 → overlay.json 저장
```

파일명 예시:

```text
msp-overlay-{code}.json
```

---

## 14. 업로드 흐름

```text
업로드 버튼 클릭
 → Editor Meta 검증
 → Overlay JSON 생성
 → Overlay JSON 검증
 → Thumbnail 준비 또는 기본값 처리
 → FormData 생성
 → POST /api/overlays
 → 성공 시 /overlays/{id} 이동
```

---

## 15. Editor 검증 규칙

업로드 전 검증:

| 항목 | 규칙 |
|---|---|
| name | 필수 |
| code | 6자리 대문자/숫자 |
| platform | 필수 |
| baseWidth/baseHeight | 0보다 커야 함 |
| opacity | 0~1 |
| element type | rect/circle/line만 허용 |
| element id | 필수 |

요소가 0개인 오버레이 허용 여부는 정책 결정이 필요하다. MVP에서는 최소 1개 요소를 요구하는 것을 권장한다.
