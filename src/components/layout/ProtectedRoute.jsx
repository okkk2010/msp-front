import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { LoginButton } from "../auth/LoginButton";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, isAuthenticated, isReady } = useAuth();
  const redirectTo = `${location.pathname}${location.search}${location.hash}`;

  if (!isReady) {
    return (
      <Card className="py-10 text-center">
        <p className="text-sm text-[var(--color-text-sub)]">접근 권한을 확인하는 중입니다.</p>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold">로그인이 필요한 기능입니다.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-sub)]">
          에디터와 라이브러리는 로그인 후 사용할 수 있습니다. 로그인 후 현재 페이지로 다시 돌아옵니다.
        </p>
        {error ? <p className="mt-3 text-sm text-[var(--color-danger)]">{error}</p> : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <LoginButton redirectTo={redirectTo} variant="secondary">
            Google로 계속하기
          </LoginButton>
          <Button onClick={() => navigate(-1)} variant="ghost">
            이전 페이지로
          </Button>
        </div>
      </Card>
    );
  }

  return children;
}
