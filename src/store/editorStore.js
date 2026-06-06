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
      selectedElementIds: [element.id],
    }),
  );
}

export function addElements(elements) {
  if (!elements.length) {
    return;
  }

  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: [...state.elements, ...elements],
      selectedElementId: elements.length === 1 ? elements[0].id : null,
      selectedElementIds: elements.map((element) => element.id),
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

export function moveElements(ids, delta) {
  const idSet = new Set(ids);

  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: state.elements.map((element) => {
        if (!idSet.has(element.id)) {
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
      selectedElementIds: (state.selectedElementIds ?? []).filter((elementId) => elementId !== id),
    }),
  );
}

export function removeElements(ids) {
  const idSet = new Set(ids);

  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: state.elements.filter((element) => !idSet.has(element.id)),
      selectedElementId: idSet.has(state.selectedElementId) ? null : state.selectedElementId,
      selectedElementIds: (state.selectedElementIds ?? []).filter((elementId) => !idSet.has(elementId)),
    }),
  );
}

export function selectElement(id) {
  editorStore.setState((state) => ({
    ...state,
    selectedElementId: id,
    selectedElementIds: id ? [id] : [],
  }));
}

export function selectElements(ids) {
  const selectedElementIds = Array.from(new Set(ids.filter(Boolean)));

  editorStore.setState((state) => ({
    ...state,
    selectedElementId: selectedElementIds.length === 1 ? selectedElementIds[0] : null,
    selectedElementIds,
  }));
}

export function toggleElementSelection(id) {
  if (!id) {
    return;
  }

  editorStore.setState((state) => {
    const currentIds = state.selectedElementIds ?? [];
    const selectedElementIds = currentIds.includes(id)
      ? currentIds.filter((elementId) => elementId !== id)
      : [...currentIds, id];

    return {
      ...state,
      selectedElementId: selectedElementIds.length === 1 ? selectedElementIds[0] : null,
      selectedElementIds,
    };
  });
}

export function updateElements(ids, patch) {
  const idSet = new Set(ids);

  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: state.elements.map((element) =>
        idSet.has(element.id)
          ? {
              ...element,
              ...patch,
            }
          : element,
      ),
    }),
  );
}

export function updateElementsById(patchById) {
  const patchMap = patchById instanceof Map ? patchById : new Map(Object.entries(patchById));

  editorStore.setState((state) =>
    withDirtyState({
      ...state,
      elements: state.elements.map((element) =>
        patchMap.has(element.id)
          ? {
              ...element,
              ...patchMap.get(element.id),
            }
          : element,
      ),
    }),
  );
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

export function moveElementLayerTo(id, position) {
  editorStore.setState((state) => {
    const target = state.elements.find((element) => element.id === id);

    if (!target) {
      return state;
    }

    const others = state.elements
      .filter((element) => element.id !== id)
      .slice()
      .sort((left, right) => left.zIndex - right.zIndex);

    if (position === "back") {
      const zIndexById = new Map(others.map((element, index) => [element.id, index + 1]));

      return withDirtyState({
        ...state,
        elements: state.elements.map((element) =>
          element.id === id
            ? {
                ...element,
                zIndex: 0,
              }
            : {
                ...element,
                zIndex: zIndexById.get(element.id) ?? element.zIndex,
              },
        ),
      });
    }

    const maxZIndex = Math.max(0, ...others.map((element) => element.zIndex ?? 0));

    return withDirtyState({
      ...state,
      elements: state.elements.map((element) =>
        element.id === id
          ? {
              ...element,
              zIndex: maxZIndex + 1,
            }
          : element,
      ),
    });
  });
}

export function loadFromOverlayJson(json, metaPatch = {}) {
  editorStore.setState((state) => ({
    ...state,
    overlayMeta: {
      ...state.overlayMeta,
      overlayId: json.overlayId ?? "",
      name: json.name,
      description: json.description ?? "",
      code: extractCodeFromOverlayId(json.overlayId),
      platform: json.platform,
      gameId: json.game?.id ?? null,
      gameName: json.game?.name ?? "",
      ...metaPatch,
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
    selectedElementIds: [],
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
