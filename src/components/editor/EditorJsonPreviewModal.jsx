import { Button } from "../common/Button";
import { Modal } from "../common/Modal";

export function EditorJsonPreviewModal({
  errors,
  jsonText,
  onClose,
  onExport,
  open,
  summary,
}) {
  return (
    <Modal open={open} title="오버레이 JSON 미리보기">
      <div className="space-y-4">
        {errors.length ? (
          <div className="rounded-2xl border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 p-4">
            <h3 className="text-sm font-semibold text-[var(--color-danger)]">검증 오류</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-main)]">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 p-4 text-sm text-[var(--color-text-main)]">
            검증을 통과했습니다.
          </div>
        )}

        {summary ? (
          <div className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 md:grid-cols-2">
            <SummaryItem label="스키마" value={summary.schemaVersion} />
            <SummaryItem label="오버레이 ID" value={summary.overlayId} />
            <SummaryItem label="플랫폼" value={summary.platform} />
            <SummaryItem label="캔버스" value={`${summary.baseWidth} x ${summary.baseHeight}`} />
            <SummaryItem label="투명도" value={String(summary.opacity)} />
            <SummaryItem label="요소" value={`${summary.elementCount}`} />
            <SummaryItem
              label="유형"
              value={summary.elementTypes?.length ? summary.elementTypes.join(", ") : "-"}
            />
          </div>
        ) : null}

        <pre className="max-h-[420px] overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 text-xs leading-6 text-[var(--color-text-main)]">
          <code>{jsonText}</code>
        </pre>

        <div className="flex flex-wrap justify-end gap-2">
          <Button onClick={onClose} variant="ghost">
            닫기
          </Button>
          <Button onClick={onExport} variant="secondary">
            JSON 내보내기
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-sub)]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[var(--color-text-main)]">{value}</p>
    </div>
  );
}
