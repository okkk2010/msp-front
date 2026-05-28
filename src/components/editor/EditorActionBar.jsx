import { Button } from "../common/Button";
import { Card } from "../common/Card";

export function EditorActionBar({
  className = "",
  hasElements,
  isUploading,
  onExport,
  onImport,
  onPreview,
  onReset,
  onUpload,
}) {
  return (
    <Card className={["flex flex-wrap items-center justify-between gap-3 p-4", className].join(" ")}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold">Actions</h2>
        <p className="text-sm text-[var(--color-text-sub)] xl:hidden">
          JSON import/export and upload actions.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 xl:w-full">
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
