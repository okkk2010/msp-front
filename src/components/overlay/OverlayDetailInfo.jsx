import { Badge } from "../common/Badge";
import { Card } from "../common/Card";
import { PlatformIconBadge } from "../common/PlatformIconBadge";

export function OverlayDetailInfo({ detail }) {
  return (
    <Card className="space-y-5 p-5">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {detail.platform ? <PlatformIconBadge platform={detail.platform} size="lg" /> : null}
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
              <strong className="font-semibold text-[var(--color-text-main)]">{detail.author?.name ?? "알 수 없음"}</strong> 님이 공유함
            </span>
          </div>
        </div>
        <p className="max-w-3xl break-words text-sm leading-6 text-[var(--color-text-sub)]">
          {detail.description || "이 오버레이에는 아직 설명이 추가되지 않았습니다."}
        </p>
      </div>
      <dl className="grid gap-3 text-sm text-[var(--color-text-sub)] sm:grid-cols-2">
        <MetaItem label="오버레이 ID" value={detail.overlayId} />
        <MetaItem label="생성일" value={detail.createdAtFormatted} />
        <MetaItem label="수정일" value={detail.updatedAtFormatted} />
        <MetaItem label="스키마" value={detail.schemaVersion || "없음"} />
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
