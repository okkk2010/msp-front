# Task Summary

- 에디터에서 Canvas와 Meta Panel 영역을 분리하고, 저장/업로드 액션이 한 화면 안에 보이도록 레이아웃을 조정했다.

# Scope

- `OverlayEditor`에서 `OverlayMetaPanel` 렌더링 제거
- Meta Panel이 있던 우측 상단 자리는 빈 dashed 영역으로 대체
- Action Bar를 화면 하단 별도 줄에서 우측 패널 하단으로 이동
- 에디터 섹션을 viewport 높이 기반 고정 레이아웃으로 변경
- Canvas가 부모 영역 안에서 늘어나도록 높이 스타일 조정
- Meta Panel 관련 props/import 연결 제거

# Changed Files

- `src/components/editor/OverlayEditor.jsx`
- `src/components/editor/OverlayCanvas.jsx`
- `src/components/editor/EditorActionBar.jsx`
- `src/pages/OverlayEditorPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_separate-editor-meta-panel.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- Meta Panel 기능은 삭제하지 않고 화면 렌더링에서만 분리했다.
- 빠진 Meta Panel 위치는 기능 없는 빈 영역으로 두었다.
- 우측 패널 내부는 필요 시 내부 스크롤이 가능하게 하고, 페이지 전체 스크롤 없이 Action Bar가 보이도록 구성했다.

# Issues

- 실제 브라우저 viewport별 화면 맞춤 검증은 별도로 수행하지 않았다.
- Meta Panel을 어느 별도 화면/모달/탭으로 이동할지는 아직 정하지 않았다.

# Next Steps

- Meta Panel을 별도 설정 화면, drawer, modal 중 하나로 다시 연결한다.
- 작은 높이의 노트북 화면에서 Action Bar와 캔버스 표시 밀도를 수동 확인한다.
