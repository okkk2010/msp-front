# Task Summary

- 도형 우클릭 컨텍스트 메뉴를 추가하고 삭제, layer 이동, 복사/붙여넣기/복제 동작을 연결했다.

# Scope

- 도형 우클릭 시 해당 도형 선택 및 컨텍스트 메뉴 표시
- 메뉴 항목 추가: Delete, Bring Forward, Send Backward, Bring to Front, Send to Back, Copy, Paste, Duplicate
- Copy/Paste/Duplicate은 새 id를 부여하고 24px offset을 적용해 새 요소 생성
- Paste는 복사된 도형이 있을 때만 활성화
- Send to Back이 실제 맨뒤로 가도록 absolute layer 이동 store 함수 추가

# Changed Files

- `src/components/editor/OverlayCanvas.jsx`
- `src/components/editor/OverlayEditor.jsx`
- `src/pages/OverlayEditorPage.jsx`
- `src/store/editorStore.js`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_add-editor-context-menu.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- Delete는 기존 삭제 흐름을 호출해 locked 요소 검사를 재사용했다.
- 클립보드는 브라우저 시스템 클립보드가 아니라 에디터 내부 상태로 유지한다.
- 복사/붙여넣기/복제는 같은 도형 모델을 유지하고 zIndex는 현재 최상단보다 크게 설정한다.

# Issues

- 브라우저에서 실제 우클릭 메뉴 조작은 수동 검증하지 않았다.

# Next Steps

- 필요 시 키보드 `Ctrl+C`, `Ctrl+V`, `Ctrl+D` 단축키를 같은 동작에 연결한다.
