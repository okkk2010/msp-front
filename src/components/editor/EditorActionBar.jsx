import { Button } from "../common/Button";
import { Card } from "../common/Card";

export function EditorActionBar({
  hasElements,
  isUploading,
  onExport,
  onImport,
  onPreview,
  onReset,
  onUpload,
}) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <h2 className="text-base font-semibold">Bottom Action Bar</h2>
        <p className="text-sm text-[var(--color-text-sub)]">
          JSON import/export는 백업과 테스트용입니다. 서버 업로드는 Editor 상태를 확인한 뒤 Upload로 진행합니다.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled={isUploading} onClick={onUpload} variant="secondary">
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
        <Button onClick={onPreview} variant="secondary">
          Preview
        </Button>
        <Button onClick={onExport} variant="secondary">
          Export JSON
        </Button>
        <Button onClick={onImport} variant="secondary">
          Import JSON
        </Button>
        <Button disabled={!hasElements || isUploading} onClick={onReset} variant="ghost">
          Reset
        </Button>
      </div>
    </Card>
  );
}
