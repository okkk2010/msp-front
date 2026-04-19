# OverlayEditorPage Structure Specification

## 1. 문서 목적

이 문서는 msp overlay의 OverlayEditorPage 전체 구조를 정의한다.

EditorPage는 Discover UI와 다르게 콘텐츠 탐색 화면이 아니라 제작 도구 화면이다.

## 2. 핵심 방향

EditorPage의 목적은 사용자가 JSON을 직접 작성하지 않고, 그림판처럼 도형을 배치하여 오버레이를 제작하게 하는 것이다.

```text
사용자 조작
 → Editor State 변경
 → Overlay JSON 내부 생성
 → multipart/form-data 업로드
```

## 3. 전체 레이아웃

```text
┌──────────────────────────────────────────────┐
│ Header                                       │
├──────────────┬─────────────────┬─────────────┤
│ Toolbar      │ Canvas Area      │ Property    │
│              │                 │ Panel       │
├──────────────┴─────────────────┴─────────────┤
│ Bottom Action Bar                            │
└──────────────────────────────────────────────┘
```

## 4. 영역별 역할

| 영역 | 역할 |
|---|---|
| Toolbar | 도형 추가, 선택, 삭제, 레이어 조작 |
| Canvas Area | 실제 오버레이 배치 공간 |
| Property Panel | 선택 요소 속성 수정 |
| Meta Panel | 오버레이 이름, 설명, 플랫폼, 게임, 코드 입력 |
| Layer Panel | 요소 목록과 zIndex 관리 |
| Bottom Action Bar | 업로드, 미리보기, JSON 가져오기/내보내기 |

## 5. Editor 기술 방식

확정 방식:

```text
SVG 기반 직접 구현
```

선택 이유:

- 현재 지원 요소가 rect, circle, line으로 단순함
- SVG 요소와 Overlay JSON 요소 매핑이 쉬움
- 클릭 / 선택 / 드래그 구현이 Canvas보다 직관적
- MVP 구현 난이도가 적절함

## 6. 기본 캔버스 기준

```text
baseWidth: 1920
baseHeight: 1080
```

Editor 화면에서는 실제 픽셀 크기 그대로 보여주기보다, 화면 크기에 맞춰 scale을 적용한다.

## 7. 지원 요소

MVP 지원:

- rect
- circle
- line

MVP 제외:

- image
- text
- group
- polygon
- free draw

## 8. Editor 주요 기능

MVP 포함:

- rect 추가
- circle 추가
- line 추가
- 요소 선택
- 요소 이동
- 요소 삭제
- 속성 패널 편집
- zIndex 앞/뒤 이동
- 전체 opacity 수정
- Overlay JSON 생성
- JSON 가져오기
- JSON 내보내기
- 서버 업로드

MVP 제외:

- 리사이즈 핸들
- 회전 핸들
- 멀티 선택
- 스냅
- 정렬 가이드
- Undo / Redo 고도화

## 9. Desktop 우선 정책

Editor는 PC 사용을 우선한다.

모바일에서는 다음 안내를 표시할 수 있다.

```text
모바일에서는 오버레이 제작 기능이 제한될 수 있습니다.
PC 환경에서 제작하는 것을 권장합니다.
```

## 10. 완료 기준

- Editor 화면이 3단 구조로 표시된다.
- Toolbar에서 도형을 추가할 수 있다.
- Canvas에서 요소를 선택할 수 있다.
- 선택 요소를 이동할 수 있다.
- Property Panel에서 속성을 수정할 수 있다.
- Editor State를 Overlay JSON으로 변환할 수 있다.
- multipart/form-data 업로드와 연결된다.
