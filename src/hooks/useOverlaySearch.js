import {
  resetFilters,
  setCode,
  setGame,
  setKeyword,
  setPage,
  setPlatform,
  setSort,
  useOverlayFilterStore,
} from "../store/overlayFilterStore";

export function useOverlaySearch() {
  const filters = useOverlayFilterStore((state) => state);

  return {
    filters,
    resetFilters,
    setCode,
    setGame,
    setKeyword,
    setPage,
    setPlatform,
    setSort,
  };
}
