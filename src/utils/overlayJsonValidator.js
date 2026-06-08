import { OVERLAY_SCHEMA_VERSION } from "../constants/overlaySchema";

const ALLOWED_ELEMENT_TYPES = ["rect", "circle", "line"];
const ALLOWED_ANCHORS = ["top-left", "top", "top-right", "left", "center", "right", "bottom-left", "bottom", "bottom-right"];
const ALLOWED_ANCHOR_SPACES = ["safeFrame", "screen"];

export function validateOverlayJson(json) {
  const errors = [];

  if (!json || typeof json !== "object") {
    return {
      isValid: false,
      errors: ["오버레이 JSON은 객체여야 합니다."],
      summary: null,
    };
  }

  if (json.schemaVersion !== OVERLAY_SCHEMA_VERSION) {
    errors.push(`schemaVersion은 ${OVERLAY_SCHEMA_VERSION}이어야 합니다.`);
  }

  if (!json.overlayId) {
    errors.push("overlayId는 필수입니다.");
  }

  if (!json.name?.trim()) {
    errors.push("name은 필수입니다.");
  }

  if (!json.platform?.trim()) {
    errors.push("platform은 필수입니다.");
  }

  if (!json.game || typeof json.game !== "object") {
    errors.push("game은 필수입니다.");
  } else {
    if (!json.game.id) {
      errors.push("game.id는 필수입니다.");
    }

    if (!json.game.name?.trim()) {
      errors.push("game.name은 필수입니다.");
    }
  }

  if (!json.canvas || typeof json.canvas !== "object") {
    errors.push("canvas는 필수입니다.");
  } else {
    if (!isPositiveNumber(json.canvas.baseWidth)) {
      errors.push("canvas.baseWidth는 0보다 커야 합니다.");
    }

    if (!isPositiveNumber(json.canvas.baseHeight)) {
      errors.push("canvas.baseHeight는 0보다 커야 합니다.");
    }
  }

  if (!json.overlaySettings || typeof json.overlaySettings !== "object") {
    errors.push("overlaySettings는 필수입니다.");
  } else if (!isOpacityValue(json.overlaySettings.opacity)) {
    errors.push("overlaySettings.opacity는 0에서 1 사이여야 합니다.");
  }

  if (!Array.isArray(json.elements)) {
    errors.push("elements는 배열이어야 합니다.");
  } else {
    json.elements.forEach((element, index) => {
      validateElement(element, index, errors);
    });
  }

  if (!json.meta || typeof json.meta !== "object") {
    errors.push("meta는 필수입니다.");
  } else {
    if (!json.meta.createdAt) {
      errors.push("meta.createdAt은 필수입니다.");
    }

    if (!json.meta.updatedAt) {
      errors.push("meta.updatedAt은 필수입니다.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    summary: buildSummary(json),
  };
}

function validateElement(element, index, errors) {
  if (!element?.id) {
    errors.push(`elements[${index}].id는 필수입니다.`);
  }

  if (!ALLOWED_ELEMENT_TYPES.includes(element?.type)) {
    errors.push(`elements[${index}].type은 ${ALLOWED_ELEMENT_TYPES.join(", ")} 중 하나여야 합니다.`);
    return;
  }

  if (!isOpacityValue(element.opacity)) {
    errors.push(`elements[${index}].opacity는 0에서 1 사이여야 합니다.`);
  }

  if (!Number.isFinite(Number(element.zIndex))) {
    errors.push(`elements[${index}].zIndex는 숫자여야 합니다.`);
  }

  if ((element.type === "rect" || element.type === "circle") && element.anchor && !ALLOWED_ANCHORS.includes(element.anchor)) {
    errors.push(`elements[${index}].anchor는 ${ALLOWED_ANCHORS.join(", ")} 중 하나여야 합니다.`);
  }

  if ((element.type === "rect" || element.type === "circle") && element.anchorSpace && !ALLOWED_ANCHOR_SPACES.includes(element.anchorSpace)) {
    errors.push(`elements[${index}].anchorSpace는 ${ALLOWED_ANCHOR_SPACES.join(", ")} 중 하나여야 합니다.`);
  }
}

function buildSummary(json) {
  if (!json || typeof json !== "object") {
    return null;
  }

  return {
    schemaVersion: json.schemaVersion ?? null,
    overlayId: json.overlayId ?? null,
    platform: json.platform ?? null,
    baseWidth: json.canvas?.baseWidth ?? null,
    baseHeight: json.canvas?.baseHeight ?? null,
    opacity: json.overlaySettings?.opacity ?? null,
    elementCount: Array.isArray(json.elements) ? json.elements.length : 0,
    elementTypes: Array.isArray(json.elements)
      ? [...new Set(json.elements.map((element) => element.type).filter(Boolean))]
      : [],
  };
}

function isPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

function isOpacityValue(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1;
}
