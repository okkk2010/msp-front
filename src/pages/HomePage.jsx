export function HomePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
          Step 1
        </span>
        <h1 className="text-4xl font-bold tracking-tight">msp overlay frontend</h1>
        <p className="max-w-3xl text-base text-[var(--color-text-sub)]">
          문서 기준 초기 프로젝트 세팅을 마친 상태입니다. 다음 단계에서는 공통 UI 컴포넌트와
          레이아웃 세부 구현을 이어서 진행합니다.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          description="React Router 기반 라우트 골격과 기본 레이아웃을 연결했습니다."
          title="Routing"
        />
        <StatusCard
          description="Tailwind v4와 디자인 토큰 진입점을 global.css에 구성했습니다."
          title="Design Tokens"
        />
        <StatusCard
          description="Axios 인스턴스와 환경 변수 구조를 분리해 API 레이어 시작점을 만들었습니다."
          title="API Base"
        />
      </div>
    </section>
  );
}

function StatusCard({ title, description }) {
  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-sub)]">{description}</p>
    </article>
  );
}
