export function Select({ children, className = "", ...props }) {
  return (
    <select
      className={[
        "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-primary)]",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}
