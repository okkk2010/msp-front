export const DEFAULT_EDITOR_STATE = {
  overlayMeta: {
    name: "",
    description: "",
    code: "",
    platform: "windows",
    gameId: null,
    gameName: "",
  },
  canvas: {
    baseWidth: 1920,
    baseHeight: 1080,
  },
  overlaySettings: {
    opacity: 100,
  },
  elements: [],
  selectedElementId: null,
  editorMode: "select",
  zoom: 1,
  isDirty: false,
};
