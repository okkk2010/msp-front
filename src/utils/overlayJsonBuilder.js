import { OVERLAY_SCHEMA_VERSION } from "../constants/overlaySchema";

export function buildOverlayJson(editorState) {
  const timestamp = new Date().toISOString();
  const overlayId = editorState.overlayMeta.overlayId || buildOverlayId(editorState.overlayMeta.code);

  return {
    schemaVersion: OVERLAY_SCHEMA_VERSION,
    overlayId,
    name: editorState.overlayMeta.name.trim(),
    platform: editorState.overlayMeta.platform,
    game: editorState.overlayMeta.gameId
      ? {
          id: String(editorState.overlayMeta.gameId),
          name: editorState.overlayMeta.gameName || "",
        }
      : null,
    canvas: {
      baseWidth: Number(editorState.canvas.baseWidth),
      baseHeight: Number(editorState.canvas.baseHeight),
    },
    overlaySettings: {
      opacity: normalizeOpacity(editorState.overlaySettings.opacity),
    },
    elements: editorState.elements
      .slice()
      .sort((left, right) => left.zIndex - right.zIndex)
      .map((element) => normalizeElement(element)),
    meta: {
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };
}

function buildOverlayId(code) {
  const normalizedCode = String(code ?? "")
    .trim()
    .toLowerCase();

  return normalizedCode ? `ovl_${normalizedCode}` : `ovl_temp_${Date.now()}`;
}

function normalizeElement(element) {
  const normalized = {
    ...element,
    opacity: normalizeOpacity(element.opacity),
  };

  if (element.type === "line") {
    return {
      ...normalized,
      x1: Number(element.x1),
      y1: Number(element.y1),
      x2: Number(element.x2),
      y2: Number(element.y2),
      strokeWidth: Number(element.strokeWidth),
      zIndex: Number(element.zIndex),
    };
  }

  return {
    ...normalized,
    x: Number(element.x),
    y: Number(element.y),
    width: Number(element.width),
    height: Number(element.height),
    anchor: normalizeAnchor(element.anchor),
    anchorSpace: normalizeAnchorSpace(element.anchorSpace),
    rotation: Number(element.rotation ?? 0),
    strokeWidth: Number(element.strokeWidth),
    zIndex: Number(element.zIndex),
    ...(element.type === "rect" ? { cornerRadius: Number(element.cornerRadius ?? 0) } : {}),
  };
}

function normalizeAnchor(value) {
  const allowed = new Set([
    "top-left",
    "top",
    "top-right",
    "left",
    "center",
    "right",
    "bottom-left",
    "bottom",
    "bottom-right",
  ]);
  return allowed.has(value) ? value : "top-left";
}

function normalizeAnchorSpace(value) {
  return value === "screen" ? "screen" : "safeFrame";
}

function normalizeOpacity(value) {
  if (typeof value !== "number") {
    return 1;
  }

  if (value > 1) {
    return Number((value / 100).toFixed(4));
  }

  return Number(value.toFixed(4));
}
