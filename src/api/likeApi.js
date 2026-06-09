import { unwrapResponse } from "./apiClient";
import { axiosInstance } from "./axiosInstance";

export function likeOverlay(overlayId) {
  return unwrapResponse(
    axiosInstance.post("/api/likes", {
      overlayId,
    }),
  );
}

export function unlikeOverlay(overlayId) {
  return unwrapResponse(axiosInstance.delete(`/api/likes/${overlayId}`));
}
