export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={[
        "min-h-28 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-text-main)] outline-none transition placeholder:text-[var(--color-text-sub)] focus:border-[var(--color-primary)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
