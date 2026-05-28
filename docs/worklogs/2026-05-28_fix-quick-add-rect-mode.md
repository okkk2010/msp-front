# Task Summary

- Quick Add의 `Add Rect` 클릭 후 기존 즉시 생성과 신규 드래그 생성 모드가 동시에 동작하던 문제를 수정했다.

# Scope

- Quick Add로 요소를 추가한 뒤 에디터 모드를 도형 타입이 아닌 `select`로 유지
- Rect 도구 버튼을 선택했을 때만 캔버스 드래그 생성이 동작하도록 분리

# Changed Files

- `src/pages/OverlayEditorPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_fix-quick-add-rect-mode.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- Quick Add는 즉시 생성 기능이므로 추가 직후 선택/이동 가능한 `select` 모드로 전환한다.
- 도구 모드 진입은 Toolbar의 `Rect`, `Circle`, `Line` 도구 선택 버튼에만 맡긴다.

# Issues

- 브라우저에서 실제 클릭/드래그 수동 검증은 별도로 수행하지 않았다.

# Next Steps

- 필요 시 Quick Add 영역과 도구 선택 영역의 라벨/배치를 더 명확히 분리한다.
