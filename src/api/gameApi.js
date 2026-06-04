import { unwrapResponse } from "./apiClient";
import { publicAxiosInstance } from "./axiosInstance";

export function fetchGamesByPlatform(platform) {
  return unwrapResponse(
    publicAxiosInstance.get("/api/games", {
      params: {
        platform,
      },
    }),
  );
}
