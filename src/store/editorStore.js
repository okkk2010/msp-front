import { DEFAULT_EDITOR_STATE } from "../constants/editorConfig";
import { createStore } from "./createStore";

const editorStore = createStore(DEFAULT_EDITOR_STATE);

function withDirtyState(nextState) {
  return {
    ...nextState,
    isDirty: true,
  };
}

export function useEditorStore(selector) {
  return editorStore.useStore(selector);
}

export function setOverlayMeta(patch) {
  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      overlayMeta: {
        ...state.overlayMeta,
        ...patch,
      },
    }),
  );
}

export function setCanvas(patch) {
  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      canvas: {
        ...state.canvas,
        ...patch,
      },
    }),
  );
}

export function setOverlaySettings(patch) {
  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      overlaySettings: {
        ...state.overlaySettings,
        ...patch,
      },
    }),
  );
}

export function addElement(element) {
  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: [...state.elements, element],
      selectedElementId: element.id,
    }),
  );
}

export function updateElement(id, patch) {
  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: state.elements.map((element) =>
        element.id === id
          ? {
              ...element,
              ...patch,
            }
          : element,
      ),
    }),
  );
}

export function moveElement(id, delta) {
  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: state.elements.map((element) => {
        if (element.id !== id) {
          return element;
        }

        if (element.type === "line") {
          return {
            ...element,
            x1: element.x1 + delta.dx,
            x2: element.x2 + delta.dx,
            y1: element.y1 + delta.dy,
            y2: element.y2 + delta.dy,
          };
        }

        return {
          ...element,
          x: element.x + delta.dx,
          y: element.y + delta.dy,
        };
      }),
    }),
  );
}

export function removeElement(id) {
  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: state.elements.filter((element) => element.id !== id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    }),
  );
}

export function selectElement(id) {
  editorStore.setState((state) => ({
    ...state,
    selectedElementId: id,
  }));
}

export function setEditorMode(mode) {
  editorStore.setState((state) => ({
    ...state,
    editorMode: mode,
  }));
}

export function moveElementLayer(id, direction) {
  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: state.elements.map((element) =>
        element.id === id
          ? {
              ...element,
              zIndex:
                direction === "front"
                  ? element.zIndex + 1
                  : Math.max(0, element.zIndex - 1),
            }
          : element,
      ),
    }),
  );
}

export function loadFromOverlayJson(json) {
  editorStore.setState((state) => ({
    ...state,
    overlayMeta: {
      ...state.overlayMeta,
      name: json.name,
      description: json.description ?? "",
      code: extractCodeFromOverlayId(json.overlayId),
      platform: json.platform,
      gameId: json.game?.id ?? null,
      gameName: json.game?.name ?? "",
    },
    canvas: json.canvas,
    overlaySettings: {
      ...json.overlaySettings,
      opacity: denormalizeOpacity(json.overlaySettings?.opacity),
    },
    elements: Array.isArray(json.elements)
      ? json.elements.map((element) => ({
          ...element,
          opacity: denormalizeOpacity(element.opacity),
        }))
      : [],
    selectedElementId: null,
    isDirty: false,
  }));
}

export function resetEditor() {
  editorStore.setState(DEFAULT_EDITOR_STATE);
}

function denormalizeOpacity(value) {
  if (typeof value !== "number") {
    return 100;
  }

  return value <= 1 ? Math.round(value * 100) : value;
}

function extractCodeFromOverlayId(overlayId) {
  const value = String(overlayId ?? "");

  if (value.startsWith("ovl_")) {
    return value.slice(4).toUpperCase();
  }

  return value.toUpperCase();
}

export { editorStore };
