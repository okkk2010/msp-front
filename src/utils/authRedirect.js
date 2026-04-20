const AUTH_REDIRECT_KEY = "msp.auth.redirect";

export function saveAuthRedirectPath(path) {
  if (!path || typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(AUTH_REDIRECT_KEY, path);
}

export function consumeAuthRedirectPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  const path = window.sessionStorage.getItem(AUTH_REDIRECT_KEY) || "/";
  window.sessionStorage.removeItem(AUTH_REDIRECT_KEY);
  return path;
}
