import { Card } from "../common/Card";

export function OverlayElementSummary() {
  return (
    <Card className="space-y-4 p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Element Summary</h2>
        <p className="text-sm leading-6 text-[var(--color-text-sub)]">
          Element counts are not included in the current detail response. This panel is ready for rect, circle, and line totals when the API adds them.
        </p>
      </div>
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
    <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
      <span>{label}</span>
      <span className="font-medium text-[var(--color-text-main)]">{value}</span>
    </div>
  );
}
