export function LoadingSpinner({ label = "로딩 중" }) {
  return (
    <div className="inline-flex items-center gap-3 text-sm text-[var(--color-text-sub)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
      <span>{label}</span>
    </div>
  );
}
