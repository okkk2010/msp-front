import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { LoginButton } from "../auth/LoginButton";
import { UserProfileButton } from "../auth/UserProfileButton";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { MobileDrawer } from "./MobileDrawer";

const NAV_ITEMS = [
  { label: "Home", to: ROUTES.home, end: true },
  { label: "Discover", to: ROUTES.overlays },
  { label: "Editor", to: ROUTES.editor },
  { label: "Library", to: ROUTES.library },
  { label: "Docs", href: "/docs/AGENTS.md" },
];

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { error, isAuthenticated, isReady, signOut, user } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-10">
          <NavLink className="text-lg font-semibold tracking-tight" to={ROUTES.home}>
            MSP Overlay
          </NavLink>
          <div className="hidden items-center gap-2 lg:flex">
            <DesktopNav />
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Input className="w-44" placeholder="Search overlays" />
            <Button onClick={() => navigate(ROUTES.editor)}>Create Overlay</Button>
            {!isReady ? (
              <span className="text-sm text-[var(--color-text-sub)]">Checking session...</span>
            ) : isAuthenticated ? (
              <>
                <UserProfileButton userName={user?.name ?? "User"} />
                <Button onClick={signOut} variant="ghost">
                  Logout
                </Button>
              </>
            ) : (
              <LoginButton variant="ghost">Login</LoginButton>
            )}
          </div>
          <Button className="md:hidden" onClick={() => setDrawerOpen(true)} variant="ghost">
            Menu
          </Button>
        </div>
        {error && !isAuthenticated ? (
          <div className="border-t border-[var(--color-border)] bg-[var(--color-danger)]/10 px-6 py-2 text-sm text-[var(--color-danger)] lg:px-10">
            {error}
          </div>
        ) : null}
      </header>
      <MobileDrawer
        isAuthenticated={isAuthenticated}
        isReady={isReady}
        items={NAV_ITEMS}
        onClose={() => setDrawerOpen(false)}
        onSignOut={signOut}
        open={drawerOpen}
        userName={user?.name}
      />
    </>
  );
}

function DesktopNav() {
  return NAV_ITEMS.map((item) =>
    item.href ? (
      <a
        key={item.label}
        className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--color-text-sub)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-main)]"
        href={item.href}
      >
        {item.label}
      </a>
    ) : (
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
    ),
  );
}
