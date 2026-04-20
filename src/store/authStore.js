import { createStore } from "./createStore";

const authStore = createStore({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: "",
});

export function initializeAuthStore() {
  authStore.setState((state) => ({
    ...state,
    error: "",
    isLoading: true,
  }));
}

export function setAuthUser(user) {
  authStore.setState({
    user,
    error: "",
    isAuthenticated: Boolean(user),
    isLoading: false,
  });
}

export function clearAuthUser(error = "") {
  authStore.setState({
    user: null,
    error,
    isAuthenticated: false,
    isLoading: false,
  });
}

export function setAuthLoading(isLoading) {
  authStore.setState((state) => ({
    ...state,
    isLoading,
  }));
}

export function useAuthStore(selector) {
  return authStore.useStore(selector);
}

export { authStore };
