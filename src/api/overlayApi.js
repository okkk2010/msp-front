import { createQueryParams, unwrapResponse } from "./apiClient";
import { axiosInstance } from "./axiosInstance";

/**
 * Uses the authenticated axios instance so the server can resolve the current
 * user (for likedByMe). The token header is only attached when a token exists,
 * so anonymous reads still work.
 *
 * @param {import("../store/overlayFilterStore").OverlayFilterState} filters
 */
export function fetchOverlayList(filters) {
  return unwrapResponse(
    axiosInstance.get("/api/overlays", {
      params: createQueryParams(filters),
    }),
  );
}

export function fetchOverlayDetail(id) {
  return unwrapResponse(axiosInstance.get(`/api/overlays/${id}`));
}

export function createOverlay(formData) {
  return unwrapResponse(axiosInstance.post("/api/overlays", formData));
}

export function updateOverlay(id, formData) {
  return unwrapResponse(axiosInstance.patch(`/api/overlays/${id}`, formData));
}
