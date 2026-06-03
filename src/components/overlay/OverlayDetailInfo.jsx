import { Badge } from "../common/Badge";
import { Card } from "../common/Card";

export function OverlayDetailInfo({ detail }) {
  return (
    <Card className="space-y-5 p-5">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {detail.platform ? <Badge tone="accent">{detail.platform}</Badge> : null}
          {detail.game ? <Badge>{detail.game}</Badge> : null}
          {detail.code ? <Badge tone="primary">{detail.code}</Badge> : null}
        </div>
        <div className="space-y-2">
          <h1 className="break-words text-3xl font-semibold leading-tight">{detail.name}</h1>
          <div className="flex min-w-0 items-center gap-3 text-sm text-[var(--color-text-sub)]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] font-bold text-[var(--color-accent)]">
              {(detail.author?.name ?? "U").charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              Shared by <strong className="font-semibold text-[var(--color-text-main)]">{detail.author?.name ?? "Unknown"}</strong>
            </span>
          </div>
        </div>
        <p className="max-w-3xl break-words text-sm leading-6 text-[var(--color-text-sub)]">
          {detail.description || "No description has been added for this overlay yet."}
        </p>
      </div>
      <dl className="grid gap-3 text-sm text-[var(--color-text-sub)] sm:grid-cols-2">
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
    <div className="min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--color-text-sub)]">{label}</dt>
      <dd className="mt-1 min-w-0 truncate text-sm font-medium leading-5 text-[var(--color-text-main)]" title={String(value || "-")}>
        {value || "-"}
      </dd>
    </div>
  );
}
