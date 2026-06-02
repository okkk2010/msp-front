export function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-main)] outline-none transition placeholder:text-[var(--color-text-sub)] focus:border-[var(--color-primary)] focus:ring-3 focus:ring-[var(--color-primary-soft)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
