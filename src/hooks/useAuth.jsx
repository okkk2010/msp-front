import { useEffect } from "react";

import { fetchCurrentUser, logoutCurrentUser } from "../api/authApi";
import {
  clearAuthUser,
  initializeAuthStore,
  setAuthLoading,
  setAuthUser,
  useAuthStore,
} from "../store/authStore";
import { getApiErrorMessage } from "../utils/apiError";
import { saveAuthRedirectPath } from "../utils/authRedirect";
import { clearAuthTokens, getAccessToken } from "../utils/authTokens";

const DEV_BYPASS_USER = {
  id: "dev-user",
  name: "Local Dev User",
  email: "dev@msp.local",
};

function isDevAuthBypassEnabled() {
  return import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_AUTH_BYPASS === "true";
}

export function AuthProvider({ children }) {
  useEffect(() => {
    initializeAuthStore();

    if (isDevAuthBypassEnabled()) {
      setAuthUser(DEV_BYPASS_USER);
      return;
    }

    if (!getAccessToken()) {
      clearAuthUser();
      setAuthLoading(false);
      return;
    }

    let active = true;

    fetchCurrentUser()
      .then((user) => {
        if (!active) {
          return;
        }

        setAuthUser(user);
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        const status = error?.response?.status;
        clearAuthUser(status && status !== 401 ? getApiErrorMessage(error) : "");
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return children;
}

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const isDevBypass = isDevAuthBypassEnabled();

  return {
    user,
    error,
    isAuthenticated: isDevBypass ? true : isAuthenticated,
    isReady: isDevBypass ? true : !isLoading,
    beginLogin(redirectTo = window.location.pathname + window.location.search + window.location.hash) {
      saveAuthRedirectPath(redirectTo);
      window.location.href =
        import.meta.env.VITE_GOOGLE_LOGIN_URL ?? "http://localhost:8080/api/auth/google";
    },
    async signOut() {
      try {
        await logoutCurrentUser();
      } catch {
        // 클라이언트 상태는 즉시 정리한다.
      }

      clearAuthTokens();
      clearAuthUser();
    },
  };
}
