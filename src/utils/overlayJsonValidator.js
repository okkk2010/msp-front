export function validateOverlayJson(json) {
  if (!json || typeof json !== "object") {
    return {
      valid: false,
      message: "Overlay JSON 형식이 올바르지 않습니다.",
    };
  }

  if (!json.schemaVersion || !json.canvas || !Array.isArray(json.elements)) {
    return {
      valid: false,
      message: "Overlay JSON 필수 필드가 누락되었습니다.",
    };
  }

  return {
    valid: true,
    message: "ok",
  };
}
