export function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none transition placeholder:text-[var(--color-text-sub)] focus:border-[var(--color-primary)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
