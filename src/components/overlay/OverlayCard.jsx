import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { PlatformIconBadge } from "../common/PlatformIconBadge";

export function OverlayCard({
  code,
  isSaved,
  name,
  onClick,
  onSave,
  platform,
  thumbnailUrl,
}) {
  return (
    <Card
      className="group flex h-full min-h-[390px] cursor-pointer flex-col overflow-hidden p-0 hover:border-[var(--color-primary)] hover:shadow-md"
      onClick={onClick}
    >
      <section className="border-b border-[var(--color-border)] p-4">
        <Thumbnail name={name} thumbnailUrl={thumbnailUrl} />
      </section>
      <section className="grid min-h-20 grid-cols-2 gap-3 border-b border-[var(--color-border)] p-4">
        <PlatformMetaItem platform={platform} />
        <MetaItem label="Code" tone="primary" value={code ?? "코드 없음"} />
      </section>
      <section className="min-h-20 border-b border-[var(--color-border)] p-4">
        <h3 className="line-clamp-2 break-words text-base font-semibold leading-6 text-[var(--color-text-main)]">
          {name || "제목 없는 오버레이"}
        </h3>
      </section>
      <section className="mt-auto p-4">
        <Button
          className="w-full"
          onClick={(event) => {
            event.stopPropagation();
            onSave?.();
          }}
          variant={isSaved ? "secondary" : "primary"}
        >
          {isSaved ? "저장됨" : "저장"}
        </Button>
      </section>
    </Card>
  );
}

function PlatformMetaItem({ platform }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-[10px] font-semibold uppercase leading-4 text-[var(--color-text-sub)]">Platform</p>
      <PlatformIconBadge platform={platform} />
    </div>
  );
}

function MetaItem({ label, tone, value }) {
  const toneClass =
    tone === "primary"
      ? "border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
      : "border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]";

  return (
    <div className="min-w-0 space-y-1">
      <p className="text-[10px] font-semibold uppercase leading-4 text-[var(--color-text-sub)]">{label}</p>
      <span
        className={[
          "block max-w-full truncate rounded-full border px-3 py-1 text-center text-sm font-semibold leading-5",
          toneClass,
        ].join(" ")}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function Thumbnail({ name, thumbnailUrl }) {
  return thumbnailUrl ? (
    <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-[var(--color-canvas-bg)]">
      <img
        alt={`${name} 미리보기`}
        className="h-full w-full object-contain"
        src={thumbnailUrl}
      />
    </div>
  ) : (
    <div className="flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-[var(--color-canvas-bg)]">
      <strong className="text-sm font-semibold text-[var(--color-text-main)]">MSP Overlay</strong>
      <span className="mt-1 text-xs text-[var(--color-text-sub)]">업로드된 미리보기가 없습니다</span>
    </div>
  );
}
