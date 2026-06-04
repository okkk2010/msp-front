import { createQueryParams, unwrapResponse } from "./apiClient";
import { axiosInstance, publicAxiosInstance } from "./axiosInstance";

/**
 * @param {import("../store/overlayFilterStore").OverlayFilterState} filters
 */
export function fetchOverlayList(filters) {
  return unwrapResponse(
    publicAxiosInstance.get("/api/overlays", {
      params: createQueryParams(filters),
    }),
  );
}

export function fetchOverlayDetail(id) {
  return unwrapResponse(publicAxiosInstance.get(`/api/overlays/${id}`));
}

export function createOverlay(formData) {
  return unwrapResponse(axiosInstance.post("/api/overlays", formData));
}

export function updateOverlay(id, formData) {
  return unwrapResponse(axiosInstance.patch(`/api/overlays/${id}`, formData));
}
