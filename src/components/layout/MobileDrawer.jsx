import { NavLink } from "react-router-dom";

import { Button } from "../common/Button";

export function MobileDrawer({ items, onClose, open }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/55 md:hidden" onClick={onClose}>
      <aside
        className="ml-auto flex h-full w-72 flex-col gap-4 border-l border-[var(--color-border)] bg-[var(--color-surface)] p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <strong className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-sub)]">
            Menu
          </strong>
          <Button onClick={onClose} variant="ghost">
            닫기
          </Button>
        </div>
        <nav className="flex flex-col gap-2">
          {items.map((item) =>
            item.href ? (
              <a
                key={item.label}
                className="rounded-xl px-4 py-3 text-sm text-[var(--color-text-sub)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-main)]"
                href={item.href}
                onClick={onClose}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-xl px-4 py-3 text-sm transition",
                    isActive
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-sub)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-main)]",
                  ].join(" ")
                }
                onClick={onClose}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      </aside>
    </div>
  );
}
