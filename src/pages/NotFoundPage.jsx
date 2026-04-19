import { Link } from "react-router-dom";

import { ROUTES } from "../constants/routes";

export function NotFoundPage() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-sub)]">
        404
      </span>
      <h1 className="text-3xl font-semibold">페이지를 찾을 수 없습니다.</h1>
      <p className="max-w-xl text-sm text-[var(--color-text-sub)]">
        요청한 경로가 아직 연결되지 않았거나 존재하지 않습니다.
      </p>
      <Link
        className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)]"
        to={ROUTES.home}
      >
        홈으로 이동
      </Link>
    </section>
  );
}
