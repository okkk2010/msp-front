import { createStore } from "./createStore";

const toastStore = createStore({
  toasts: [],
});

export function useToastStore(selector) {
  return toastStore.useStore(selector);
}

export function showToast(toast) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `toast-${Date.now()}`;

  toastStore.setState((state) => ({
    ...state,
    toasts: [...state.toasts, { ...toast, id }],
  }));

  return id;
}

export function removeToast(id) {
  toastStore.setState((state) => ({
    ...state,
    toasts: state.toasts.filter((toast) => toast.id !== id),
  }));
}

export { toastStore };
