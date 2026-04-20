export function buildOverlayFormData({
  editorState,
  overlayJson,
  thumbnail,
}) {
  const formData = new FormData();

  formData.append("name", editorState.overlayMeta.name.trim());
  formData.append("description", editorState.overlayMeta.description?.trim() ?? "");
  formData.append("code", editorState.overlayMeta.code.trim().toUpperCase());
  formData.append("platform", editorState.overlayMeta.platform);

  if (editorState.overlayMeta.gameId !== null && editorState.overlayMeta.gameId !== undefined && editorState.overlayMeta.gameId !== "") {
    formData.append("gameId", String(editorState.overlayMeta.gameId));
  }

  const overlayJsonBlob = new Blob([JSON.stringify(overlayJson, null, 2)], {
    type: "application/json",
  });

  formData.append("overlayJson", overlayJsonBlob, "overlay.json");

  if (thumbnail?.blob) {
    formData.append("thumbnail", thumbnail.blob, thumbnail.filename ?? "thumbnail.png");
  }

  return formData;
}
