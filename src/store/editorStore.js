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
      platform: json.platform,
      gameId: json.game?.id ? Number(json.game.id) : null,
      gameName: json.game?.name ?? "",
    },
    canvas: json.canvas,
    overlaySettings: json.overlaySettings,
    elements: json.elements,
    selectedElementId: null,
    isDirty: false,
  }));
}

export function resetEditor() {
  editorStore.setState(DEFAULT_EDITOR_STATE);
}

export { editorStore };
