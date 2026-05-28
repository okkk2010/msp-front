# Task Summary

- 선택한 도형을 캔버스에서 직접 크기 조절할 수 있는 리사이즈 핸들 UI와 기능을 추가했다.

# Scope

- Select 모드에서 선택된 rect/circle에 8방향 리사이즈 핸들 표시
- Select 모드에서 선택된 line에 양 끝점 조절 핸들 표시
- 핸들 드래그 시 요소 좌표와 크기를 store에 반영
- locked 요소에는 리사이즈 핸들을 표시하지 않음

# Changed Files

- `src/components/editor/OverlayCanvas.jsx`
- `src/components/editor/OverlayEditor.jsx`
- `src/pages/OverlayEditorPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_add-canvas-resize-handles.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- 리사이즈는 도구 충돌을 막기 위해 `select` 모드에서만 동작하도록 했다.
- rect/circle은 최소 8px 크기를 유지해 뒤집힘과 0 크기 생성을 방지했다.
- line은 도형 크기 개념 대신 시작점/끝점 핸들을 직접 이동하는 방식으로 처리했다.

# Issues

- 브라우저에서 실제 포인터 드래그 수동 검증은 별도로 수행하지 않았다.
- 기존 lint는 저장소 전반의 JSX/import 오탐 문제로 실패하는 상태라 이번 작업에서는 build 검증만 수행했다.

# Next Steps

- 필요 시 Shift 드래그 비율 고정, Alt 중심 기준 리사이즈, 회전 핸들을 추가한다.
