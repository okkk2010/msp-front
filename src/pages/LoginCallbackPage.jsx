import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCurrentUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import { clearAuthUser, setAuthUser } from "../store/authStore";

export function LoginCallbackPage() {
  const navigate = useNavigate();
  const { beginLogin } = useAuth();

  useEffect(() => {
    let active = true;

    fetchCurrentUser()
      .then((user) => {
        if (!active) {
          return;
        }

        setAuthUser(user);
        navigate("/", { replace: true });
      })
      .catch(() => {
        if (!active) {
          return;
        }

        clearAuthUser();
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
      <h1 className="text-3xl font-semibold">Login Callback</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-sub)]">
        로그인 결과를 처리하고 있습니다.
      </p>
      <div className="mt-6">
        <button
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)]"
          onClick={beginLogin}
          type="button"
        >
          로그인 다시 시도
        </button>
      </div>
    </section>
  );
}
