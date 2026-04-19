import { createStore } from "./createStore";

const AUTH_STORAGE_KEY = "msp-front.mock-auth";

const authStore = createStore({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export function initializeAuthStore() {
  const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedValue) {
    authStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    return;
  }

  try {
    const user = JSON.parse(storedValue);
    authStore.setState({
      user,
      isAuthenticated: Boolean(user),
      isLoading: false,
    });
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    authStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }
}

export function setAuthUser(user) {
  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  authStore.setState({
    user,
    isAuthenticated: Boolean(user),
    isLoading: false,
  });
}

export function clearAuthUser() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  authStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
}

export function useAuthStore(selector) {
  return authStore.useStore(selector);
}

export { authStore };
