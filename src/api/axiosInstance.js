import axios from "axios";
import { getAccessToken, getTokenType } from "../utils/authTokens";

const apiBaseUrl = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080").trim();

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export const publicAxiosInstance = axios.create({
  baseURL: apiBaseUrl,
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
