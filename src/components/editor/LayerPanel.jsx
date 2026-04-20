import { Button } from "../common/Button";
import { Card } from "../common/Card";

export function LayerPanel({
  items,
  onMoveBack,
  onMoveFront,
  onSelect,
  selectedElementId,
}) {
  return (
    <Card className="space-y-3 p-5">
      <div>
        <h2 className="text-base font-semibold">Layer Panel</h2>
        <p className="mt-1 text-sm text-[var(--color-text-sub)]">
          현재 요소 목록과 zIndex 상태를 표시합니다.
        </p>
      </div>
      <div className="space-y-2">
        {items.length ? (
          items
            .slice()
            .sort((left, right) => right.zIndex - left.zIndex)
            .map((item) => (
              <div
                key={item.id}
                className={[
                  "rounded-2xl border px-4 py-3",
                  item.id === selectedElementId
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface-soft)]",
                ].join(" ")}
              >
                <button
                  className="w-full text-left"
                  onClick={() => onSelect(item.id)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-main)]">
                        {item.type}
                      </p>
                      <p className="text-xs text-[var(--color-text-sub)]">
                        {item.id}
                        {item.locked ? " | locked" : ""}
                        {item.visible === false ? " | hidden" : ""}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--color-text-sub)]">z {item.zIndex}</span>
                  </div>
                </button>
                <div className="mt-3 flex gap-2">
                  <Button onClick={() => onMoveFront(item.id)} variant="ghost">
                    Front
                  </Button>
                  <Button onClick={() => onMoveBack(item.id)} variant="ghost">
                    Back
                  </Button>
                </div>
              </div>
            ))
        ) : (
          <p className="text-sm text-[var(--color-text-sub)]">아직 추가된 요소가 없습니다.</p>
        )}
      </div>
    </Card>
  );
}
