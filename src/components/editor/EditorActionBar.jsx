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
  uploadActionLabel = "업로드",
}) {
  return (
    <Card className={["flex flex-wrap items-center justify-between gap-3 p-4", className].join(" ")}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold">작업</h2>
        <p className="text-sm text-[var(--color-text-sub)] xl:hidden">
          JSON 가져오기/내보내기와 업로드 작업입니다.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 xl:w-full">
        <Button disabled={isUploading} onClick={onUpload} variant="secondary">
          {isUploading ? "저장 중..." : uploadActionLabel}
        </Button>
        <Button onClick={onPreview} variant="secondary">
          미리보기
        </Button>
        <Button onClick={onExport} variant="secondary">
          JSON 내보내기
        </Button>
        <Button onClick={onImport} variant="secondary">
          JSON 가져오기
        </Button>
        <Button disabled={!hasElements || isUploading} onClick={onReset} variant="ghost">
          초기화
        </Button>
      </div>
    </Card>
  );
}
