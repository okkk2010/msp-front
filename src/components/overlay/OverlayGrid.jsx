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
        <LoadingSpinner label="오버레이 목록을 불러오는 중입니다." />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]"
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
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)]"
          onClick={onRetry}
          type="button"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        description="검색어 또는 필터를 변경해보세요."
        title="조건에 맞는 오버레이가 없습니다."
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
