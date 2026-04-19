import { createStore } from "./createStore";

const authStore = createStore({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export function initializeAuthStore() {
  authStore.setState((state) => ({
    ...state,
    isLoading: true,
  }));
}

export function setAuthUser(user) {
  authStore.setState({
    user,
    isAuthenticated: Boolean(user),
    isLoading: false,
  });
}

export function clearAuthUser() {
  authStore.setState({
    user: null,
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
