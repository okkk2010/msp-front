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
  const authorName = author?.name ?? "Unknown creator";

  return (
    <Card
      className="group cursor-pointer overflow-hidden p-0 hover:border-[var(--color-primary)] hover:shadow-md"
      onClick={onClick}
    >
      <div className="grid gap-0 md:grid-cols-[260px_minmax(0,1fr)]">
        <Thumbnail name={name} thumbnailUrl={thumbnailUrl} />
        <div className="flex min-w-0 flex-col gap-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {platform?.name ? <Badge tone="accent">{platform.name}</Badge> : null}
                {game?.displayName ? <Badge>{game.displayName}</Badge> : null}
                {code ? <Badge tone="primary">{code}</Badge> : null}
              </div>
              <h3 className="line-clamp-2 text-xl font-semibold leading-7 text-[var(--color-text-main)]">
                {name || "Untitled overlay"}
              </h3>
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

          <p className="line-clamp-2 text-sm leading-6 text-[var(--color-text-sub)]">
            {description || "No description yet. Open the detail page to inspect the overlay JSON and preview."}
          </p>

          <div className="flex flex-wrap gap-2">
            {elementTypes.slice(0, 4).map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
            {elementTypes.length > 4 ? <Badge>+{elementTypes.length - 4}</Badge> : null}
          </div>

          <div className="mt-auto grid gap-3 border-t border-[var(--color-border)] pt-3 text-sm text-[var(--color-text-sub)] sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-sm font-bold text-[var(--color-accent)]">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--color-text-main)]">{authorName}</p>
                <p className="text-xs text-[var(--color-text-sub)]">Shared by community</p>
              </div>
            </div>
            {typeof savedCount === "number" ? (
              <span className="text-xs font-medium">{savedCount} saves</span>
            ) : null}
            {updatedAt ? <span className="text-xs font-medium">Updated {updatedAt}</span> : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Thumbnail({ name, thumbnailUrl }) {
  return thumbnailUrl ? (
    <div className="flex aspect-video min-h-48 w-full items-center justify-center bg-[var(--color-canvas-bg)] md:aspect-auto">
      <img
        alt={`${name} preview`}
        className="max-h-full w-full object-contain"
        src={thumbnailUrl}
      />
    </div>
  ) : (
    <div className="flex aspect-video min-h-48 w-full flex-col items-center justify-center bg-[var(--color-canvas-bg)] md:aspect-auto">
      <strong className="text-sm font-semibold text-[var(--color-text-main)]">MSP Overlay</strong>
      <span className="mt-1 text-xs text-[var(--color-text-sub)]">No preview uploaded</span>
    </div>
  );
}
