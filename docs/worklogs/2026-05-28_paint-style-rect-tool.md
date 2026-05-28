# Task Summary

- 웹 에디터를 그림판처럼 사용할 수 있도록 Rect 도구 선택 후 캔버스 클릭-드래그로 사각형을 생성하는 흐름을 추가했다.

# Scope

- 에디터 라우트의 좌우 여백을 제거해 화면 폭을 더 넓게 사용하도록 조정
- Toolbar 문구를 도구 선택 중심으로 정리
- Rect 모드에서 SVG 캔버스 드래그 중 draft 사각형을 표시하고, 드래그 종료 시 요소로 추가
- 기존 quick add 방식은 보조 기능으로 유지

# Changed Files

- `src/components/layout/AppLayout.jsx`
- `src/components/editor/EditorToolbar.jsx`
- `src/components/editor/OverlayCanvas.jsx`
- `src/components/editor/OverlayEditor.jsx`
- `src/pages/OverlayEditorPage.jsx`
- `src/utils/elementFactory.js`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_paint-style-rect-tool.md`

# Verification Result

- `npm run build`: 성공
- `npm run lint`: 실패
  - 저장소 전반에서 JSX 사용 컴포넌트와 import를 미사용으로 오탐하는 기존 lint 오류가 다수 발생했다.
  - 이번 변경 파일 외에도 기존 파일 전체에서 동일 유형 오류가 발생했다.

# Decisions Made

- Rect 도구로 드래그 생성한 뒤에는 요소가 바로 선택/이동 가능하도록 `select` 모드로 되돌렸다.
- 클릭만 하거나 매우 작은 드래그를 한 경우에는 의도치 않은 사각형 생성을 막기 위해 6px 미만 크기는 생성하지 않는다.
- Circle/Line의 드래그 생성은 이번 요청 범위를 넘기므로 기존 quick add 기능을 유지했다.

# Issues

- 브라우저에서 실제 포인터 입력 검증은 아직 수행하지 않았다.
- lint는 기존 설정/코드 상태 때문에 전체 실패한다.

# Next Steps

- 필요 시 Circle/Line도 동일한 클릭-드래그 생성 방식으로 확장한다.
- Select/Rect 등 도구 버튼을 아이콘 중심 UI로 정리한다.
