export function ColorPicker({ className = "", ...props }) {
  return (
    <input
      className={[
        "h-11 w-full cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-1",
        className,
      ].join(" ")}
      type="color"
      {...props}
    />
  );
}
