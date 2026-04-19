import { useEffect } from "react";

import { fetchCurrentUser, logoutCurrentUser } from "../api/authApi";
import {
  clearAuthUser,
  initializeAuthStore,
  setAuthUser,
  setAuthLoading,
  useAuthStore,
} from "../store/authStore";

export function AuthProvider({ children }) {
  useEffect(() => {
    initializeAuthStore();

    let active = true;

    fetchCurrentUser()
      .then((user) => {
        if (!active) {
          return;
        }

        setAuthUser(user);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        clearAuthUser();
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

  return {
    user,
    isAuthenticated,
    isReady: !isLoading,
    beginLogin() {
      window.location.href =
        import.meta.env.VITE_GOOGLE_LOGIN_URL ?? "http://localhost:8080/api/auth/google";
    },
    async signOut() {
      try {
        await logoutCurrentUser();
      } catch {
        // 서버 로그아웃 실패여도 클라이언트 상태는 정리한다.
      }

      clearAuthUser();
    },
  };
}
