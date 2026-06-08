import { isValidOverlayCode } from "./codeValidator";

export function validateUploadFields(editorState) {
  const errors = [];
  const { overlayMeta, canvas } = editorState;

  if (!overlayMeta.name?.trim()) {
    errors.push("오버레이 이름을 입력해 주세요.");
  }

  if (!isValidOverlayCode(overlayMeta.code)) {
    errors.push("오버레이 코드는 대문자 영문 또는 숫자 6자리여야 합니다.");
  }

  if (!overlayMeta.platform?.trim()) {
    errors.push("플랫폼을 선택해 주세요.");
  }

  if (!overlayMeta.gameId) {
    errors.push("카테고리를 선택해 주세요.");
  }

  if (!Number.isFinite(Number(canvas.baseWidth)) || Number(canvas.baseWidth) <= 0) {
    errors.push("캔버스 너비는 0보다 커야 합니다.");
  }

  if (!Number.isFinite(Number(canvas.baseHeight)) || Number(canvas.baseHeight) <= 0) {
    errors.push("캔버스 높이는 0보다 커야 합니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
