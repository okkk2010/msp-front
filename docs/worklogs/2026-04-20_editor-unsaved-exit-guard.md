# Task Summary

- 에디터 진입 시 이전 상태가 남지 않도록 초기화하고, 미저장 상태에서 페이지 이탈 경고 플로우를 추가했다.

# Scope

- `/editor` 진입 시 editor store 초기화
- 미저장 상태에서 내부 라우트 이동 차단 및 선택 모달 추가
- 새로고침/탭 닫기 시 브라우저 기본 경고 연결
- 업로드 성공 시 이탈 가드 해제

# Changed Files

- `src/pages/OverlayEditorPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-20_editor-unsaved-exit-guard.md`

# Verification Result

- 에디터는 전역 store 기반이라 이전 편집 상태가 남을 수 있음을 확인했다.
- 수정 후 `/editor` 최초 진입 시 store를 초기화한다.
- `isDirty` 상태에서 다른 라우트로 이동하려 하면 커스텀 모달에서 이동/유지 선택이 가능하다.
- 새로고침과 탭 닫기는 `beforeunload` 경고가 동작하도록 연결했다.
- 업로드 성공 시에는 가드를 우회하고 상세 페이지로 이동한다.

# Decisions Made

- 브라우저 이탈 경고는 커스텀 UI가 불가능하므로 기본 경고를 사용했다.
- 내부 라우트 이동은 React Router blocker와 모달 조합으로 구현했다.
- 범위를 넘지 않게 `/editor` 페이지에만 가드를 적용했다.

# Issues

- `/editor/:overlayId` 복제 편집 페이지가 실제 구현되면 동일 가드를 재사용하도록 분리할 여지가 있다.

# Next Steps

- 실제 브라우저에서 오버레이 수정 후 목록/라이브러리/홈 이동 시 모달 동작을 확인한다.
- 복제 편집 페이지 구현 시 동일 UX를 붙인다.
