import { Card } from "../common/Card";

const TOOL_ITEMS = [
  { icon: SelectIcon, label: "선택", mode: "select" },
  { icon: RectIcon, label: "사각형", mode: "rect" },
  { icon: CircleIcon, label: "원", mode: "circle" },
];

const ACTION_ITEMS = [
  { icon: DeleteIcon, label: "삭제", action: "delete" },
  { icon: BringForwardIcon, label: "앞으로", action: "front" },
  { icon: SendBackwardIcon, label: "뒤로", action: "back" },
];

export function EditorToolbar({
  currentMode,
  onDelete,
  onMoveBack,
  onMoveFront,
  onSelectMode,
}) {
  const actionHandlers = {
    delete: onDelete,
    front: onMoveFront,
    back: onMoveBack,
  };

  return (
    <Card className="flex h-full flex-col gap-3 rounded-none border-x-0 p-3">
      <div>
        <h2 className="text-sm font-semibold">Toolbar</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {TOOL_ITEMS.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              aria-label={tool.label}
              className={[
                "flex aspect-square w-full items-center justify-center rounded-lg border text-[var(--color-text-main)] transition",
                currentMode === tool.mode
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]",
              ].join(" ")}
              key={tool.mode}
              onClick={() => onSelectMode(tool.mode)}
              title={tool.label}
              type="button"
            >
              <Icon />
            </button>
          );
        })}
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[var(--color-border)] pt-3">
        {ACTION_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              aria-label={item.label}
              className="flex aspect-square w-full items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]"
              key={item.action}
              onClick={actionHandlers[item.action]}
              title={item.label}
              type="button"
            >
              <Icon />
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function SelectIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M6 3l10 10-5 1.2L8.5 20 6 3z" fill="currentColor" />
    </svg>
  );
}

function RectIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <rect height="12" rx="1.5" stroke="currentColor" strokeWidth="2.2" width="16" x="4" y="6" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M8 7h8m-6 0V5h4v2m-5 3v7m3-7v7m3-7v7M7 7l1 13h8l1-13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function BringForwardIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <rect height="8" rx="1.5" stroke="currentColor" strokeWidth="2" width="8" x="5" y="11" />
      <rect height="8" rx="1.5" stroke="currentColor" strokeWidth="2" width="8" x="11" y="5" />
    </svg>
  );
}

function SendBackwardIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <rect height="8" rx="1.5" stroke="currentColor" strokeWidth="2" width="8" x="11" y="11" />
      <rect height="8" rx="1.5" stroke="currentColor" strokeWidth="2" width="8" x="5" y="5" />
    </svg>
  );
}
