# Task Summary

- 에디터에 Delete 삭제 단축키와 Shift/Alt 수정자 키 조작을 추가했다.

# Scope

- 선택 요소가 있을 때 `Delete` 키로 삭제 실행
- input/textarea/select/contenteditable 포커스 중에는 Delete 단축키 무시
- 도형 이동 중 `Shift`를 누르면 더 크게 움직인 축으로 수평/수직 이동 고정
- 리사이즈 중 `Alt`를 누르면 도형 중심 기준으로 크기 조절
- line 리사이즈도 `Alt` 사용 시 중심점을 기준으로 양 끝점이 대칭 이동

# Changed Files

- `src/components/editor/OverlayEditor.jsx`
- `src/components/editor/OverlayCanvas.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_add-editor-shortcuts-and-modifiers.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- Delete 단축키는 기존 `onDelete` 흐름을 그대로 호출해 locked 요소 처리와 toast 정책을 재사용했다.
- Shift 축 고정은 이동 동작에 적용했다.
- Alt 중심 기준 리사이즈는 현재 시작 도형의 중심을 기준으로 계산한다.

# Issues

- 브라우저에서 실제 키/드래그 조합 수동 검증은 별도로 수행하지 않았다.

# Next Steps

- 필요 시 Shift 리사이즈 비율 고정, Shift 드로잉 정사각형 생성도 추가한다.
