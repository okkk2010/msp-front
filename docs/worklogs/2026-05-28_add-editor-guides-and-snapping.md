# Task Summary

- 에디터 캔버스에 픽셀 그리드, 마우스 위치 가이드라인, 자동 정렬 스냅 기능을 추가했다.

# Scope

- 캔버스 헤더에 `Grid px` 숫자 입력 추가
- 캔버스 헤더에 `Snap` 토글 추가
- 설정한 픽셀 단위로 SVG 그리드 렌더링
- 마우스 포인터 위치 기준 가로/세로 가이드라인 표시
- 도형 이동 시 그리드, 캔버스 중심/경계, 다른 도형의 edge/center 근처에 자동 정렬
- Rect 드로잉과 리사이즈 핸들 드래그에도 포인트 스냅 적용
- 스냅이 걸린 축은 초록색 가이드라인으로 표시

# Changed Files

- `src/components/editor/OverlayCanvas.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_add-editor-guides-and-snapping.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- 가이드/스냅 설정은 편집 보조 기능이므로 overlay JSON에는 저장하지 않고 캔버스 로컬 상태로만 유지한다.
- 스냅 기준은 그리드, 캔버스 좌/중앙/우 및 상/중앙/하, 다른 요소의 좌/중앙/우 및 상/중앙/하로 잡았다.
- 스냅 감지 거리는 8px로 고정했다.

# Issues

- 브라우저에서 실제 마우스 조작 수동 검증은 별도로 수행하지 않았다.
- 스냅 감지 거리와 설정 저장 여부는 추후 사용자 선호에 따라 조정할 수 있다.

# Next Steps

- 필요 시 스냅 감지 거리 입력, 가이드 표시 토글, 설정 저장 기능을 추가한다.
