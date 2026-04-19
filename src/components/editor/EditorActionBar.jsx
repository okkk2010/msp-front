import { Button } from "../common/Button";
import { Card } from "../common/Card";

export function EditorActionBar({ hasElements, onImport, onPreview, onReset }) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <h2 className="text-base font-semibold">Bottom Action Bar</h2>
        <p className="text-sm text-[var(--color-text-sub)]">
          업로드와 JSON 입출력은 이후 단계에서 실제 동작을 연결합니다.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary">Upload</Button>
        <Button onClick={onPreview} variant="secondary">
          Preview
        </Button>
        <Button variant="secondary">Export JSON</Button>
        <Button onClick={onImport} variant="secondary">
          Import JSON
        </Button>
        <Button disabled={!hasElements} onClick={onReset} variant="ghost">
          Reset
        </Button>
      </div>
    </Card>
  );
}
