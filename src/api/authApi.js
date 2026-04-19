import { axiosInstance } from "./axiosInstance";

export async function fetchCurrentUser() {
  const response = await axiosInstance.get("/api/auth/me");
  return response.data;
}
