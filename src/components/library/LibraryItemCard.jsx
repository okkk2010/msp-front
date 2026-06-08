import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { PlatformIconBadge } from "../common/PlatformIconBadge";

export function LibraryItemCard({ item, onUseAsTemplate, onViewDetail }) {
  const overlay = item.overlay;

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 md:flex-row">
        <Thumbnail name={overlay.name} thumbnailUrl={overlay.thumbnailUrl} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="space-y-1">
            <h2 className="truncate text-lg font-semibold">{overlay.name}</h2>
            <p className="text-sm text-[var(--color-text-sub)]">
              제작자: {overlay.author?.name ?? "알 수 없음"}
            </p>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--color-text-sub)]">
            {overlay.description || "아직 등록된 설명이 없습니다."}
          </p>
          <div className="flex flex-wrap gap-2">
            {overlay.platform?.name ? <PlatformIconBadge platform={overlay.platform} /> : null}
            {overlay.game?.displayName ? <Badge>{overlay.game.displayName}</Badge> : null}
            {overlay.code ? <Badge tone="primary">{overlay.code}</Badge> : null}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-text-sub)]">
              저장일 {item.savedAtFormatted}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onViewDetail} variant="secondary">
                상세 보기
              </Button>
              <Button onClick={onUseAsTemplate}>템플릿으로 사용</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Thumbnail({ name, thumbnailUrl }) {
  return thumbnailUrl ? (
    <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas-bg)] md:w-56">
      <img
        alt={`${name} 미리보기`}
        className="max-h-full w-full object-contain"
        src={thumbnailUrl}
      />
    </div>
  ) : (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-canvas-bg)] md:w-56">
      <strong className="text-sm font-semibold">MSP Overlay</strong>
      <span className="mt-1 text-xs text-[var(--color-text-sub)]">미리보기 없음</span>
    </div>
  );
}
