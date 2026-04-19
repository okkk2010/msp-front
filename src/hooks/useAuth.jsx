import { useEffect } from "react";

import {
  clearAuthUser,
  initializeAuthStore,
  setAuthUser,
  useAuthStore,
} from "../store/authStore";

export function AuthProvider({ children }) {
  useEffect(() => {
    initializeAuthStore();
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
    signInWithMockUser() {
      // TODO: GET /api/auth/me 및 OAuth 콜백 연동으로 대체한다.
      setAuthUser({
        id: 1,
        name: "Demo User",
        email: "demo@example.com",
      });
    },
    signOut() {
      clearAuthUser();
    },
  };
}
