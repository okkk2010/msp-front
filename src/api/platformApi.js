import { unwrapResponse } from "./apiClient";
import { axiosInstance } from "./axiosInstance";

export function fetchPlatforms() {
  return unwrapResponse(axiosInstance.get("/api/platforms"));
}
