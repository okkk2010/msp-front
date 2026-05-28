# Task Summary

- 에디터 우측 패널에서 비워둔 Meta Panel 영역과 Layer Panel을 제거하고 Property Panel만 채우도록 조정했다.

# Scope

- `OverlayEditor`에서 `LayerPanel` import와 렌더링 제거
- 우측 패널의 빈 placeholder row 제거
- 우측 패널을 `Property Panel + Action Bar` 구조로 단순화
- 더 이상 사용하지 않는 `onSelectElement` prop 전달 제거

# Changed Files

- `src/components/editor/OverlayEditor.jsx`
- `src/pages/OverlayEditorPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_fill-right-panel-with-properties.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- Action Bar는 우측 패널 하단에 유지했다.
- Property Panel 영역은 남은 우측 공간을 채우고 내부 스크롤이 가능하도록 유지했다.

# Issues

- 브라우저에서 실제 높이 배치 수동 검증은 별도로 수행하지 않았다.

# Next Steps

- 필요 시 Property Panel의 필드 그룹/간격을 우측 전체 패널 레이아웃에 맞게 재정리한다.
