export function Select({ children, className = "", ...props }) {
  return (
    <select
      className={[
        "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-primary)] focus:ring-3 focus:ring-[var(--color-primary-soft)]",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}
