# Task Summary

- 도형 자동 스냅을 중앙선뿐 아니라 edge 선에도 맞춰지도록 복원했다.

# Scope

- 이동 중인 도형의 left/center/right, top/center/bottom을 스냅 후보로 사용
- 캔버스 left/center/right, top/center/bottom을 가이드 후보로 사용
- 다른 도형의 left/center/right, top/center/bottom을 가이드 후보로 사용
- 그리드 전체 선 스냅은 제외 상태 유지

# Changed Files

- `src/components/editor/OverlayCanvas.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_restore-edge-snapping.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- 그리드는 시각적 위치 확인용으로만 유지하고, 자동 스냅은 캔버스/도형의 주요 선 기준으로 제한했다.

# Issues

- 브라우저에서 실제 드래그 감각은 별도로 수동 검증하지 않았다.

# Next Steps

- 필요 시 edge 스냅과 center 스냅을 각각 토글로 분리한다.
