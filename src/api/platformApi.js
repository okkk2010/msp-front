import { unwrapResponse } from "./apiClient";
import { publicAxiosInstance } from "./axiosInstance";

export function fetchPlatforms() {
  return unwrapResponse(publicAxiosInstance.get("/api/platforms"));
}
