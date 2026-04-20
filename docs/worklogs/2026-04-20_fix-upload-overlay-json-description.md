# Task Summary

- 업로드 시 `overlay.json` 본문에 포함되던 `description` 필드를 제거해 백엔드 JSON Schema와 맞췄다.

# Scope

- 백엔드 `overlay-schema.json`과 프론트 `overlayJsonBuilder` 대조
- `description`의 전송 위치를 `FormData` 메타로만 유지
- 프론트 빌드 검증

# Changed Files

- `src/utils/overlayJsonBuilder.js`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-20_fix-upload-overlay-json-description.md`

# Verification Result

- 백엔드 스키마는 루트 객체에 `additionalProperties: false`가 설정되어 있고 `description`을 허용하지 않음을 확인했다.
- 프론트는 기존에 `description`을 `overlay.json` 본문과 `FormData` 양쪽에 중복 포함하고 있었다.
- 수정 후 `description`은 `FormData`로만 전송되고 `overlay.json` 본문에서는 제외된다.
- `npm run build`로 프론트 빌드 검증 예정이다.

# Decisions Made

- 서버 스키마는 유지하고 프론트 생성 로직을 계약에 맞췄다.
- 사용자 입력 설명은 업로드 메타데이터로만 저장되도록 유지했다.

# Issues

- 기존에 Export JSON으로 내려받은 파일 중 `description`이 들어간 옛 포맷은 서버 업로드 시 계속 거절될 수 있다.

# Next Steps

- 필요하면 Import/Export 포맷도 서버 스키마와 완전히 일치하는지 추가 점검한다.
- 업로드 재시도로 실제 오류가 사라지는지 확인한다.
