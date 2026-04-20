# Task Summary

- 문서 기준 15단계 공통 API 계약 처리와 에러 UX를 보강했다.

# Scope

- 공통 API 응답 언랩에서 `success === false` 응답을 예외 처리
- 서버 메시지 우선의 공통 에러 메시지 처리 추가
- API 에러 문구를 정상 한글로 정리
- 로딩/404 문구를 읽을 수 있는 상태로 정리

# Changed Files

- `src/api/apiClient.js`
- `src/constants/apiErrorMessages.js`
- `src/utils/apiError.js`
- `src/components/common/LoadingSpinner.jsx`
- `src/pages/NotFoundPage.jsx`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-04-19_step15-api-contract-and-error-handling.md`

# Verification Result

- `15_api_contract_front.md` 기준으로 Axios 공통 응답 처리와 상태 코드별 에러 메시지 처리를 정리했다.
- 서버가 `success: false`를 내려도 프론트가 정상 예외 흐름으로 처리하도록 보강했다.
- `npm run build` 실행 확인: 성공

# Decisions Made

- 상태 코드별 고정 문구보다 서버 `message`가 있으면 우선 사용하도록 처리했다.
- 기존 mojibake 문자열은 계속 누적시키지 않고 touched 파일 기준으로 정상 문구로 교체했다.

# Issues

- 이미 작성된 다른 페이지/컴포넌트에는 일부 깨진 문자열이 더 남아 있을 수 있다.
- 실제 서버 에러 응답 샘플 전부를 수집해 검증한 것은 아니고, 공통 처리 경로만 정리했다.

# Next Steps

- 남은 페이지들의 깨진 문구를 단계적으로 정리한다.
- 실제 400/401/409/500 응답을 수동 호출로 확인해 사용자 메시지를 다듬는다.
