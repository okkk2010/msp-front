import {
  DEFAULT_CIRCLE_ELEMENT,
  DEFAULT_LINE_ELEMENT,
  DEFAULT_RECT_ELEMENT,
} from "../constants/elementDefaults";

export function createElement(type) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${type}-${Date.now()}`;

  const shared = { id };

  if (type === "rect") {
    return {
      ...shared,
      ...DEFAULT_RECT_ELEMENT,
    };
  }

  if (type === "circle") {
    return {
      ...shared,
      ...DEFAULT_CIRCLE_ELEMENT,
    };
  }

  return {
    ...shared,
    ...DEFAULT_LINE_ELEMENT,
  };
}
