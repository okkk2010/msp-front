import { NavLink } from "react-router-dom";

import { ROUTES } from "../../constants/routes";

const NAV_ITEMS = [
  { label: "Home", to: ROUTES.home, end: true },
  { label: "Discover", to: ROUTES.overlays },
  { label: "Editor", to: ROUTES.editor },
  { label: "Library", to: ROUTES.library },
];

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <NavLink className="text-lg font-semibold tracking-tight" to={ROUTES.home}>
          msp overlay
        </NavLink>
        <nav className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                [
                  "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-sub)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-main)]",
                ].join(" ")
              }
              end={item.end}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
