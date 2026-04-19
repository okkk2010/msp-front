import { createStore } from "./createStore";

const INITIAL_FILTER_STATE = {
  keyword: "",
  code: "",
  platform: "",
  game: "",
  sort: "newest",
  page: 0,
  size: 12,
};

const overlayFilterStore = createStore(INITIAL_FILTER_STATE);

export function useOverlayFilterStore(selector) {
  return overlayFilterStore.useStore(selector);
}

export function setKeyword(keyword) {
  overlayFilterStore.setState((state) => ({
    ...state,
    keyword,
    page: 0,
  }));
}

export function setCode(code) {
  overlayFilterStore.setState((state) => ({
    ...state,
    code,
    page: 0,
  }));
}

export function setPlatform(platform) {
  overlayFilterStore.setState((state) => ({
    ...state,
    platform,
    game: "",
    page: 0,
  }));
}

export function setGame(game) {
  overlayFilterStore.setState((state) => ({
    ...state,
    game,
    page: 0,
  }));
}

export function setSort(sort) {
  overlayFilterStore.setState((state) => ({
    ...state,
    sort,
    page: 0,
  }));
}

export function setPage(page) {
  overlayFilterStore.setState((state) => ({
    ...state,
    page,
  }));
}

export function resetFilters() {
  overlayFilterStore.setState(INITIAL_FILTER_STATE);
}

export { overlayFilterStore };

/**
 * @typedef {Object} OverlayFilterState
 * @property {string} keyword
 * @property {string} code
 * @property {string} platform
 * @property {string} game
 * @property {"newest" | "updated" | "saved"} sort
 * @property {number} page
 * @property {number} size
 */
