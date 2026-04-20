import { isValidOverlayCode } from "./codeValidator";

export function validateUploadFields(editorState) {
  const errors = [];
  const { overlayMeta, canvas } = editorState;

  if (!overlayMeta.name?.trim()) {
    errors.push("Overlay name is required.");
  }

  if (!isValidOverlayCode(overlayMeta.code)) {
    errors.push("Overlay code must match 6 uppercase letters or numbers.");
  }

  if (!overlayMeta.platform?.trim()) {
    errors.push("Platform is required.");
  }

  if (!Number.isFinite(Number(canvas.baseWidth)) || Number(canvas.baseWidth) <= 0) {
    errors.push("Canvas width must be greater than 0.");
  }

  if (!Number.isFinite(Number(canvas.baseHeight)) || Number(canvas.baseHeight) <= 0) {
    errors.push("Canvas height must be greater than 0.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
