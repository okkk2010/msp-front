const VARIANT_CLASS = {
  primary:
    "bg-[var(--color-primary)] text-white shadow-sm hover:brightness-105",
  secondary:
    "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
  ghost:
    "bg-transparent text-[var(--color-text-sub)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-main)]",
};

export function Button({
  as,
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}) {
  const Component = as ?? "button";

  return (
    <Component
      className={[
        "inline-flex min-w-0 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold leading-5 transition disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_CLASS[variant],
        className,
      ].join(" ")}
      type={Component === "button" ? type : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
