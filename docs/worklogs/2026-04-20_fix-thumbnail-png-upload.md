# Task Summary

- 업로드 시 썸네일이 `.svg`로 전송되던 문제를 수정해 `.png`로 업로드되도록 변경했다.

# Scope

- 백엔드 thumbnail 확장자 검증 확인
- 프론트 썸네일 생성 포맷을 SVG에서 PNG로 전환
- 업로드 multipart 기본 파일명 정리
- 프론트 빌드 검증

# Changed Files

- `src/utils/thumbnailGenerator.js`
- `src/utils/overlayFormData.js`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-20_fix-thumbnail-png-upload.md`

# Verification Result

- 백엔드는 `thumbnail은 .png 파일만 업로드할 수 있습니다.` 규칙으로 원본 파일명을 검사하고 있음을 확인했다.
- 프론트는 기존에 `thumbnail.svg` 파일명과 `image/svg+xml` blob을 보내고 있었다.
- 수정 후 프론트는 SVG 미리보기 렌더 결과를 PNG blob으로 변환하고 `thumbnail.png` 이름으로 전송한다.
- `npm run build`로 프론트 빌드 검증 예정이다.

# Decisions Made

- 백엔드 제약을 유지하고 프론트 업로드 포맷을 맞췄다.
- 썸네일 렌더 소스는 기존 SVG 생성 로직을 재사용하고 최종 전송 포맷만 PNG로 변환했다.

# Issues

- 브라우저 canvas 기반 변환이므로 극단적으로 큰 썸네일 크기에서는 성능 영향을 볼 수 있다.

# Next Steps

- 실제 업로드 재시도로 `.png` 확장자 오류가 사라지는지 확인한다.
- 필요하면 썸네일 배경/해상도 품질을 별도로 조정한다.
