import axios from "axios";
import { getAccessToken, getTokenType } from "../utils/authTokens";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `${getTokenType()} ${accessToken}`;
  }

  return config;
});
