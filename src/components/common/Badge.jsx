export function Badge({ children, tone = "default" }) {
  const toneClass =
    tone === "primary"
      ? "border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
      : "border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-sub)]";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClass,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
