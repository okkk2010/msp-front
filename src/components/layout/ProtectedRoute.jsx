import { useNavigate } from "react-router-dom";

import { LoginButton } from "../auth/LoginButton";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <Card className="py-10 text-center">
        <p className="text-sm text-[var(--color-text-sub)]">접근 권한을 확인하고 있습니다.</p>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold">로그인이 필요한 기능입니다.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-sub)]">
          Editor와 Library는 로그인 후 사용할 수 있습니다. OAuth 연동 전까지는 임시 로그인
          버튼으로 보호 라우트 흐름을 확인할 수 있습니다.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <LoginButton />
          <Button onClick={() => navigate(-1)} variant="secondary">
            이전 페이지로
          </Button>
        </div>
      </Card>
    );
  }

  return children;
}
