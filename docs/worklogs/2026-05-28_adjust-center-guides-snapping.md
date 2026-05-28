# Task Summary

- 자동 스냅 기준을 전체 그리드에서 캔버스/도형 중앙선 기준으로 조정했다.

# Scope

- 캔버스 중앙 가로/세로 가이드라인을 항상 표시
- 스냅 후보에서 그리드 전체 선과 캔버스 edge 제거
- 자동 스냅 후보를 캔버스 중앙선과 다른 도형의 중앙선으로 제한
- 기존 Grid px 설정은 시각적 그리드 간격 설정으로 유지

# Changed Files

- `src/components/editor/OverlayCanvas.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_adjust-center-guides-snapping.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- 그리드는 위치 확인용 시각 가이드로 남기고 자동 스냅 기준에서는 제외했다.
- 도형 간 정렬도 edge가 아닌 center 기준으로만 동작하게 했다.

# Issues

- 브라우저에서 실제 드래그 스냅 감각은 별도로 수동 검증하지 않았다.

# Next Steps

- 필요 시 edge 스냅을 별도 토글로 다시 추가할 수 있다.
