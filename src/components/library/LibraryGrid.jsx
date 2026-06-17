import { EmptyState } from "../common/EmptyState";
import { ErrorMessage } from "../common/ErrorMessage";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { LibraryItemCard } from "./LibraryItemCard";

export function LibraryGrid({
  error,
  isLoading,
  items,
  onRemove,
  onRetry,
  onUseAsTemplate,
  onViewDetail,
  removingOverlayId,
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSpinner label="라이브러리 목록을 불러오는 중입니다." />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]"
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
        description="마음에 드는 오버레이를 찾아 라이브러리에 저장해 보세요."
        title="아직 저장한 오버레이가 없습니다."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <LibraryItemCard
          key={item.libraryId}
          isRemoving={removingOverlayId === item.overlay.id}
          item={item}
          onRemove={() => onRemove(item)}
          onUseAsTemplate={() => onUseAsTemplate(item)}
          onViewDetail={() => onViewDetail(item)}
        />
      ))}
    </div>
  );
}
