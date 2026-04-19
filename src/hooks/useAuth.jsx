import { createContext, useContext, useEffect, useMemo, useState } from "react";

const MOCK_AUTH_STORAGE_KEY = "msp-front.mock-auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY);

    if (storedValue) {
      try {
        setUser(JSON.parse(storedValue));
      } catch {
        window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
      }
    }

    setIsReady(true);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isReady,
      user,
      signInWithMockUser() {
        // TODO: GET /api/auth/me 및 OAuth 콜백 연동으로 대체한다.
        const nextUser = {
          id: 1,
          name: "Demo User",
          email: "demo@example.com",
        };

        window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
      },
      signOut() {
        window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
        setUser(null);
      },
    }),
    [isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
