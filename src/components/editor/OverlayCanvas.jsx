import { Card } from "../common/Card";

export function OverlayCanvas({ canvas, elements, selectedElementId }) {
  return (
    <Card className="flex h-full min-h-[520px] flex-col p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">Canvas Area</h2>
          <p className="mt-1 text-sm text-[var(--color-text-sub)]">
            SVG 구현은 다음 단계에서 진행합니다. 현재는 배치 구조와 요소 존재 여부를 확인합니다.
          </p>
        </div>
        <div className="text-right text-sm text-[var(--color-text-sub)]">
          <p>
            {canvas.baseWidth} × {canvas.baseHeight}
          </p>
          <p>{elements.length} elements</p>
        </div>
      </div>
      <div className="relative mt-5 flex flex-1 items-center justify-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]">
        <div className="relative aspect-video w-full max-w-4xl rounded-2xl border border-[var(--color-border)] bg-[#0f172a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
          {elements.length ? (
            <div className="absolute inset-4 flex flex-wrap content-start gap-3">
              {elements.map((element) => (
                <div
                  key={element.id}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm",
                    element.id === selectedElementId
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]",
                  ].join(" ")}
                >
                  {element.type}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold">Canvas Ready</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-text-sub)]">
                좌측 Toolbar에서 rect, circle, line을 추가하면 여기서 현재 상태를 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
