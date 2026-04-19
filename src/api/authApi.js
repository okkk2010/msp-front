import { unwrapResponse } from "./apiClient";
import { axiosInstance } from "./axiosInstance";

export async function fetchCurrentUser() {
  return unwrapResponse(axiosInstance.get("/api/auth/me"));
}

export async function logoutCurrentUser() {
  return unwrapResponse(axiosInstance.post("/api/auth/logout"));
}
