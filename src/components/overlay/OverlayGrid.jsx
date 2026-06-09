import { EmptyState } from "../common/EmptyState";
import { ErrorMessage } from "../common/ErrorMessage";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { OverlayCard } from "./OverlayCard";

export function OverlayGrid({
  error,
  isLoading,
  items,
  onCardClick,
  onLike,
  onRetry,
  onSave,
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSpinner label="커뮤니티 오버레이를 불러오는 중..." />
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[390px] animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
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
          다시 시도
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        description="더 넓은 키워드를 사용하거나 플랫폼 필터를 지우고, 오버레이 코드로도 검색해 보세요."
        title="이 필터와 일치하는 오버레이가 없습니다."
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <OverlayCard
          key={item.id ?? item.code}
          {...item}
          onClick={() => onCardClick(item)}
          onLike={() => onLike(item)}
          onSave={() => onSave(item)}
        />
      ))}
    </div>
  );
}
