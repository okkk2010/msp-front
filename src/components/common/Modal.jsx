export function Modal({ children, className = "", open = false, title }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div
        className={[
          "w-full max-w-xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl",
          className,
        ].join(" ")}
      >
        {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}
        <div className={title ? "mt-4" : ""}>{children}</div>
      </div>
    </div>
  );
}
