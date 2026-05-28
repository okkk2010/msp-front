# Task Summary

- Rect/Circle 생성 드래그 중 Shift를 누르면 정사각형/정원으로 그려지도록 추가했다.

# Scope

- 도형 생성 중 pointer move에서 Shift 키 상태 확인
- Shift가 눌린 경우 시작점 기준으로 width/height가 같은 bounds 생성
- Rect는 정사각형, Circle은 정원 draft 및 요소 크기로 반영

# Changed Files

- `src/components/editor/OverlayCanvas.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-28_add-shift-square-circle-drawing.md`

# Verification Result

- `npm run build`: 성공

# Decisions Made

- Shift 생성은 드래그 시작점 기준으로 동작하게 했다.
- 정사각형 크기는 현재 드래그한 x/y 거리 중 더 작은 값을 사용해 커서가 지나치게 벗어나도 도형이 캔버스 안에서 예측 가능하게 변하도록 했다.

# Issues

- 브라우저에서 실제 Shift+드래그 수동 검증은 별도로 수행하지 않았다.

# Next Steps

- 필요 시 Alt+드래그 생성으로 중심 기준 도형 생성을 추가한다.
