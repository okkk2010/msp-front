import { unwrapResponse } from "./apiClient";
import { axiosInstance } from "./axiosInstance";

export function fetchLibraryItems() {
  return unwrapResponse(axiosInstance.get("/api/library"));
}

export function saveOverlayToLibrary(overlayId) {
  return unwrapResponse(
    axiosInstance.post("/api/library", {
      overlayId,
    }),
  );
}
