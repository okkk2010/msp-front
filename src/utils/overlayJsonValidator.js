import { OVERLAY_SCHEMA_VERSION } from "../constants/overlaySchema";

const ALLOWED_ELEMENT_TYPES = ["rect", "circle", "line"];

export function validateOverlayJson(json) {
  const errors = [];

  if (!json || typeof json !== "object") {
    return {
      isValid: false,
      errors: ["Overlay JSON must be an object."],
      summary: null,
    };
  }

  if (json.schemaVersion !== OVERLAY_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${OVERLAY_SCHEMA_VERSION}.`);
  }

  if (!json.overlayId) {
    errors.push("overlayId is required.");
  }

  if (!json.name?.trim()) {
    errors.push("name is required.");
  }

  if (!json.platform?.trim()) {
    errors.push("platform is required.");
  }

  if (!json.canvas || typeof json.canvas !== "object") {
    errors.push("canvas is required.");
  } else {
    if (!isPositiveNumber(json.canvas.baseWidth)) {
      errors.push("canvas.baseWidth must be greater than 0.");
    }

    if (!isPositiveNumber(json.canvas.baseHeight)) {
      errors.push("canvas.baseHeight must be greater than 0.");
    }
  }

  if (!json.overlaySettings || typeof json.overlaySettings !== "object") {
    errors.push("overlaySettings is required.");
  } else if (!isOpacityValue(json.overlaySettings.opacity)) {
    errors.push("overlaySettings.opacity must be between 0 and 1.");
  }

  if (!Array.isArray(json.elements)) {
    errors.push("elements must be an array.");
  } else {
    json.elements.forEach((element, index) => {
      validateElement(element, index, errors);
    });
  }

  if (!json.meta || typeof json.meta !== "object") {
    errors.push("meta is required.");
  } else {
    if (!json.meta.createdAt) {
      errors.push("meta.createdAt is required.");
    }

    if (!json.meta.updatedAt) {
      errors.push("meta.updatedAt is required.");
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
    errors.push(`elements[${index}].id is required.`);
  }

  if (!ALLOWED_ELEMENT_TYPES.includes(element?.type)) {
    errors.push(`elements[${index}].type must be one of ${ALLOWED_ELEMENT_TYPES.join(", ")}.`);
    return;
  }

  if (!isOpacityValue(element.opacity)) {
    errors.push(`elements[${index}].opacity must be between 0 and 1.`);
  }

  if (!Number.isFinite(Number(element.zIndex))) {
    errors.push(`elements[${index}].zIndex must be a number.`);
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
