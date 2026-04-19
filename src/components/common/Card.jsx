export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={[
        "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition duration-150",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
