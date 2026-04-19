import { Card } from "../common/Card";

export function OverlayJsonSummary({ detail }) {
  return (
    <Card className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">JSON Summary</h2>
      <dl className="grid gap-4 text-sm text-[var(--color-text-sub)] md:grid-cols-2">
        <SummaryItem label="schemaVersion" value={detail.schemaVersion || "Unavailable"} />
        <SummaryItem label="canvas.baseWidth" value={String(detail.canvasBaseWidth ?? "-")} />
        <SummaryItem label="canvas.baseHeight" value={String(detail.canvasBaseHeight ?? "-")} />
        <SummaryItem label="overlaySettings.opacity" value={String(detail.opacity ?? "-")} />
        <SummaryItem label="elements.length" value="Unavailable" />
        <SummaryItem label="meta.createdAt" value="Unavailable" />
        <SummaryItem label="meta.updatedAt" value="Unavailable" />
      </dl>
    </Card>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
      <dt className="text-xs uppercase tracking-[0.15em]">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-[var(--color-text-main)]">{value}</dd>
    </div>
  );
}
