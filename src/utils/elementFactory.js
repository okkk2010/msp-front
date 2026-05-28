import {
  DEFAULT_CIRCLE_ELEMENT,
  DEFAULT_LINE_ELEMENT,
  DEFAULT_RECT_ELEMENT,
} from "../constants/elementDefaults";

export function createElement(type, overrides = {}) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${type}-${Date.now()}`;

  const shared = { id };

  if (type === "rect") {
    return {
      ...shared,
      ...DEFAULT_RECT_ELEMENT,
      ...overrides,
    };
  }

  if (type === "circle") {
    return {
      ...shared,
      ...DEFAULT_CIRCLE_ELEMENT,
      ...overrides,
    };
  }

  return {
    ...shared,
    ...DEFAULT_LINE_ELEMENT,
    ...overrides,
  };
}
