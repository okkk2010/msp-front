import { createStore } from "./createStore";

const libraryStore = createStore({
  items: [],
  savedOverlayIds: new Set(),
});

export function useLibraryStore(selector) {
  return libraryStore.useStore(selector);
}

export function setLibraryItems(items) {
  libraryStore.setState({
    items,
    savedOverlayIds: new Set(items.map((item) => item.overlay.id)),
  });
}

export function markOverlaySaved(overlayId) {
  libraryStore.setState((state) => ({
    ...state,
    savedOverlayIds: new Set([...state.savedOverlayIds, overlayId]),
  }));
}

export function isOverlaySaved(overlayId) {
  return libraryStore.getState().savedOverlayIds.has(overlayId);
}

export { libraryStore };
