import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export function LoginCallbackPage() {
  const navigate = useNavigate();
  const { signInWithMockUser } = useAuth();

  useEffect(() => {
    // TODO: OAuth 콜백 파라미터 처리 및 /api/auth/me 재조회로 대체한다.
    signInWithMockUser();
    navigate("/", { replace: true });
  }, [navigate, signInWithMockUser]);

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
      <h1 className="text-3xl font-semibold">Login Callback</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-sub)]">
        로그인 결과를 처리하고 있습니다.
      </p>
    </section>
  );
}
