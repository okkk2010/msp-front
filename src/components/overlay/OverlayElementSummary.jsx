import { Card } from "../common/Card";

export function OverlayElementSummary() {
  return (
    <Card className="space-y-3 p-6">
      <h2 className="text-lg font-semibold">Element Summary</h2>
      <p className="text-sm leading-6 text-[var(--color-text-sub)]">
        현재 서버 상세 응답에는 요소 배열이 포함되지 않습니다. JSON 원본 또는 별도 상세 응답 확장이
        준비되면 rect, circle, line 개수 요약을 여기서 표시합니다.
      </p>
      <dl className="grid gap-3 text-sm text-[var(--color-text-sub)]">
        <SummaryRow label="rect" value="Unavailable" />
        <SummaryRow label="circle" value="Unavailable" />
        <SummaryRow label="line" value="Unavailable" />
      </dl>
    </Card>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
      <span>{label}</span>
      <span className="font-medium text-[var(--color-text-main)]">{value}</span>
    </div>
  );
}
