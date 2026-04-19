import { Badge } from "../common/Badge";
import { Card } from "../common/Card";

export function OverlayDetailInfo({ detail }) {
  return (
    <Card className="space-y-5 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{detail.name}</h1>
        <p className="text-sm text-[var(--color-text-sub)]">
          by {detail.author?.name ?? "Unknown"}
        </p>
        <p className="max-w-3xl text-sm leading-6 text-[var(--color-text-sub)]">
          {detail.description || "설명이 아직 등록되지 않았습니다."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {detail.platform ? <Badge>{detail.platform}</Badge> : null}
        {detail.game ? <Badge>{detail.game}</Badge> : null}
        {detail.code ? <Badge tone="primary">{detail.code}</Badge> : null}
      </div>
      <dl className="grid gap-4 text-sm text-[var(--color-text-sub)] md:grid-cols-2">
        <MetaItem label="Overlay ID" value={detail.overlayId} />
        <MetaItem label="Created" value={detail.createdAtFormatted} />
        <MetaItem label="Updated" value={detail.updatedAtFormatted} />
        <MetaItem label="Schema" value={detail.schemaVersion || "Unavailable"} />
      </dl>
    </Card>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
      <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-sub)]">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-[var(--color-text-main)]">{value || "-"}</dd>
    </div>
  );
}
