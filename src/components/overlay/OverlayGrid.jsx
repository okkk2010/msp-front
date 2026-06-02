import { EmptyState } from "../common/EmptyState";
import { ErrorMessage } from "../common/ErrorMessage";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { OverlayCard } from "./OverlayCard";

export function OverlayGrid({
  error,
  isLoading,
  items,
  onCardClick,
  onRetry,
  onSave,
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSpinner label="Loading community overlays..." />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage>{error}</ErrorMessage>
        <button
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)]"
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        description="Try a broader keyword, clear the platform filter, or search by overlay code."
        title="No overlays match these filters."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <OverlayCard
          key={item.id ?? item.code}
          {...item}
          onClick={() => onCardClick(item)}
          onSave={() => onSave(item)}
        />
      ))}
    </div>
  );
}
