const ACCESS_TOKEN_KEY = "msp.auth.accessToken";
const REFRESH_TOKEN_KEY = "msp.auth.refreshToken";
const TOKEN_TYPE_KEY = "msp.auth.tokenType";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "msp.auth.refreshTokenExpiresAt";

export function saveAuthTokens({
  accessToken,
  refreshToken,
  tokenType = "Bearer",
  refreshTokenExpiresAt = "",
}) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  window.localStorage.setItem(TOKEN_TYPE_KEY, tokenType);

  if (refreshTokenExpiresAt) {
    window.localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, refreshTokenExpiresAt);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
  }
}

export function clearAuthTokens() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_TYPE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
}

export function getAccessToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function getRefreshToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}

export function getTokenType() {
  if (typeof window === "undefined") {
    return "Bearer";
  }

  return window.localStorage.getItem(TOKEN_TYPE_KEY) || "Bearer";
}
