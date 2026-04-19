import { removeToast, showToast, useToastStore } from "../store/toastStore";

export function useToast() {
  const toasts = useToastStore((state) => state.toasts);

  return {
    toasts,
    removeToast,
    showToast,
  };
}
