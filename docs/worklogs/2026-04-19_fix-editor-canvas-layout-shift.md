# Task Summary

- Editor에서 캔버스 크기와 위치가 선택 상태에 따라 흔들리던 문제를 수정했다.

# Scope

- Editor 3열 레이아웃이 우측 패널 높이 변화에 따라 캔버스를 재배치하지 않도록 조정
- Canvas 비율을 `baseWidth / baseHeight` 기준으로 고정
- Property Panel 높이를 일정 수준으로 유지해 선택 전후 레이아웃 점프를 줄임

# Changed Files

- `src/components/editor/OverlayEditor.jsx`
- `src/components/editor/OverlayCanvas.jsx`
- `src/components/editor/ElementPropertyPanel.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-19_fix-editor-canvas-layout-shift.md`

# Verification Result

- `npm run build` 실행 확인: 성공
- Canvas 래퍼가 `aspectRatio`로 실제 캔버스 비율을 따르도록 변경했다.
- Editor grid에 `items-start`를 적용하고 Canvas를 sticky/self-start로 바꿔 우측 패널 확장 시 캔버스가 같이 늘어나지 않도록 했다.

# Decisions Made

- 캔버스 자체 좌표계는 그대로 유지하고, 화면상 표시 레이아웃만 안정화하는 방향으로 수정했다.
- Property Panel은 선택 전후 높이 차이를 줄이기 위해 최소 높이를 부여했다.

# Issues

- 브라우저에서 실제 마우스 입력으로 선택 전후 위치 변화를 아직 수동 검증하지는 못했다.
- 현재 Canvas는 viewport 안에 스케일되어 표시되므로 CSS 픽셀 기준으로 1920x1080 크기로 직접 보이진 않는다.

# Next Steps

- 브라우저에서 Editor 선택/드래그 시 캔버스 위치가 고정되는지 수동 확인한다.
- 필요하면 다음 단계에서 zoom 표시와 캔버스 프레임 정보를 더 명확하게 노출한다.
