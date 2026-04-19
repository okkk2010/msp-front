export function Toast({ message, tone = "info" }) {
  const toneClass =
    tone === "success"
      ? "border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-[var(--color-success)]"
      : tone === "error"
        ? "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
        : "border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]";

  return (
    <div className={["rounded-2xl border px-4 py-3 text-sm", toneClass].join(" ")}>
      {message}
    </div>
  );
}
