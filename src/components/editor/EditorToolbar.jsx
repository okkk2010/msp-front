import { Button } from "../common/Button";
import { Card } from "../common/Card";

const TOOL_ITEMS = [
  { label: "Select", mode: "select" },
  { label: "Rect", mode: "rect" },
  { label: "Circle", mode: "circle" },
  { label: "Line", mode: "line" },
];

export function EditorToolbar({
  currentMode,
  onDelete,
  onMoveBack,
  onMoveFront,
  onSelectMode,
}) {
  return (
    <Card className="flex h-full flex-col gap-3 rounded-none border-x-0 p-4">
      <div>
        <h2 className="text-base font-semibold">Toolbar</h2>
        <p className="mt-1 text-xs leading-5 text-[var(--color-text-sub)]">
          도구를 선택한 뒤 캔버스에서 작업합니다.
        </p>
      </div>
      <div className="grid gap-2">
        {TOOL_ITEMS.map((tool) => (
          <Button
            key={tool.mode}
            onClick={() => onSelectMode(tool.mode)}
            variant={currentMode === tool.mode ? "primary" : "secondary"}
          >
            {tool.label}
          </Button>
        ))}
      </div>
      <div className="mt-auto grid gap-2 border-t border-[var(--color-border)] pt-3">
        <Button onClick={onDelete} variant="ghost">
          Delete
        </Button>
        <Button onClick={onMoveFront} variant="ghost">
          Bring Forward
        </Button>
        <Button onClick={onMoveBack} variant="ghost">
          Send Backward
        </Button>
      </div>
    </Card>
  );
}
