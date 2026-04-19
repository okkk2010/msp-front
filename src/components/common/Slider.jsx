export function Slider({ className = "", ...props }) {
  return (
    <input
      className={["w-full accent-[var(--color-primary)]", className].join(" ")}
      type="range"
      {...props}
    />
  );
}
