export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={[
        "rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition duration-150",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
