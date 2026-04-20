import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCurrentUser } from "../api/authApi";
import { LoginButton } from "../components/auth/LoginButton";
import { Button } from "../components/common/Button";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { clearAuthUser, setAuthUser } from "../store/authStore";
import { consumeAuthRedirectPath } from "../utils/authRedirect";
import { getApiErrorMessage } from "../utils/apiError";
import { clearAuthTokens, saveAuthTokens } from "../utils/authTokens";

export function LoginCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const searchParams = new URLSearchParams(window.location.search);
    const isSuccess = searchParams.get("success") === "true";
    const accessToken = searchParams.get("accessToken") || "";
    const refreshToken = searchParams.get("refreshToken") || "";
    const tokenType = searchParams.get("tokenType") || "Bearer";
    const refreshTokenExpiresAt = searchParams.get("refreshTokenExpiresAt") || "";
    const errorMessage =
      searchParams.get("message") || searchParams.get("error") || "로그인 처리에 실패했습니다.";

    if (!isSuccess) {
      clearAuthTokens();
      clearAuthUser(errorMessage);
      setError(errorMessage);
      return () => {
        active = false;
      };
    }

    if (!accessToken || !refreshToken) {
      const message = "로그인 토큰이 콜백에 포함되지 않았습니다.";
      clearAuthTokens();
      clearAuthUser(message);
      setError(message);
      return () => {
        active = false;
      };
    }

    saveAuthTokens({
      accessToken,
      refreshToken,
      tokenType,
      refreshTokenExpiresAt,
    });

    fetchCurrentUser()
      .then((user) => {
        if (!active) {
          return;
        }

        setAuthUser(user);
        navigate(consumeAuthRedirectPath(), { replace: true });
      })
      .catch((requestError) => {
        if (!active) {
          return;
        }

        const message = getApiErrorMessage(requestError);
        clearAuthTokens();
        clearAuthUser(message);
        setError(message);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
      <h1 className="text-3xl font-semibold">Login Callback</h1>
      {!error ? (
        <div className="mt-4">
          <LoadingSpinner label="로그인 결과를 처리하고 있습니다." />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <ErrorMessage>{error}</ErrorMessage>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <LoginButton variant="secondary">로그인 다시 시도</LoginButton>
            <Button onClick={() => navigate("/")} variant="ghost">
              홈으로 이동
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
