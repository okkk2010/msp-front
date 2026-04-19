import { OVERLAY_SCHEMA_VERSION } from "../constants/overlaySchema";

export function buildOverlayJson(editorState) {
  return {
    schemaVersion: OVERLAY_SCHEMA_VERSION,
    overlayId: editorState.overlayMeta.code || "TEMP_OVERLAY_ID",
    name: editorState.overlayMeta.name,
    platform: editorState.overlayMeta.platform,
    game: editorState.overlayMeta.gameId
      ? {
          id: String(editorState.overlayMeta.gameId),
          name: editorState.overlayMeta.gameName || "",
        }
      : null,
    canvas: editorState.canvas,
    overlaySettings: editorState.overlaySettings,
    elements: editorState.elements,
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}
