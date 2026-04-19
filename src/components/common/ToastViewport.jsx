import { useEffect } from "react";

import { useToast } from "../../hooks/useToast";
import { Toast } from "./Toast";

export function ToastViewport() {
  const { removeToast, toasts } = useToast();

  useEffect(() => {
    if (!toasts.length) {
      return undefined;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        removeToast(toast.id);
      }, 2800),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [removeToast, toasts]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast message={toast.message} tone={toast.type === "warning" ? "error" : toast.type} />
        </div>
      ))}
    </div>
  );
}
