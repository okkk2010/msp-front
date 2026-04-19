import { unwrapResponse } from "./apiClient";
import { axiosInstance } from "./axiosInstance";

export function fetchGamesByPlatform(platform) {
  return unwrapResponse(
    axiosInstance.get("/api/games", {
      params: {
        platform,
      },
    }),
  );
}
