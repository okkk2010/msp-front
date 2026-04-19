import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

export function OverlayCard({
  author,
  code,
  description,
  elementTypes = [],
  game,
  isSaved,
  name,
  onClick,
  onSave,
  platform,
  savedCount,
  thumbnailUrl,
  updatedAt,
}) {
  return (
    <Card
      className="group cursor-pointer p-4 hover:border-[var(--color-primary)] hover:bg-[rgba(17,24,39,0.96)]"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <Thumbnail name={name} thumbnailUrl={thumbnailUrl} />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <h3 className="truncate text-lg font-semibold">{name}</h3>
              <p className="text-sm text-[var(--color-text-sub)]">by {author?.name ?? "Unknown"}</p>
            </div>
            <Button
              className="shrink-0"
              onClick={(event) => {
                event.stopPropagation();
                onSave?.();
              }}
              variant={isSaved ? "secondary" : "primary"}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--color-text-sub)]">{description}</p>
          <div className="flex flex-wrap gap-2">
            {platform?.name ? <Badge>{platform.name}</Badge> : null}
            {game?.displayName ? <Badge>{game.displayName}</Badge> : null}
            {elementTypes.slice(0, 3).map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--color-text-sub)]">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="primary">{code}</Badge>
              {typeof savedCount === "number" ? <span>Saved {savedCount}</span> : null}
              {updatedAt ? <span>Updated {updatedAt}</span> : null}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Thumbnail({ name, thumbnailUrl }) {
  return thumbnailUrl ? (
    <img
      alt={`${name} preview`}
      className="aspect-video w-full rounded-2xl border border-[var(--color-border)] object-cover md:w-56"
      src={thumbnailUrl}
    />
  ) : (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] md:w-56">
      <strong className="text-sm font-semibold">MSP Overlay</strong>
      <span className="mt-1 text-xs text-[var(--color-text-sub)]">No Preview</span>
    </div>
  );
}
