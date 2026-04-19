export function ErrorMessage({ children }) {
  return (
    <div className="rounded-2xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]">
      {children}
    </div>
  );
}
