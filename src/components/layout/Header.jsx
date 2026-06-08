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
  { label: "홈", to: ROUTES.home, end: true },
  { label: "탐색", to: ROUTES.overlays },
  { label: "에디터", to: ROUTES.editor },
  { label: "라이브러리", to: ROUTES.library },
  { label: "문서", href: "/docs/AGENTS.md" },
];

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { error, isAuthenticated, isReady, signOut, user } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <NavLink className="shrink-0 whitespace-nowrap text-lg font-semibold tracking-tight" to={ROUTES.home}>
            MSP Overlay
          </NavLink>
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-2">
            <DesktopNav />
          </div>
          <div className="hidden min-w-0 shrink items-center gap-2 md:flex">
            <Input className="hidden w-44 xl:block 2xl:w-72" placeholder="오버레이 검색" />
            <Button className="shrink-0 whitespace-nowrap" onClick={() => navigate(ROUTES.editor)}>
              오버레이 만들기
            </Button>
            {!isReady ? (
              <span className="shrink-0 whitespace-nowrap text-sm text-[var(--color-text-sub)]">세션 확인 중...</span>
            ) : isAuthenticated ? (
              <>
                <UserProfileButton userName={user?.name ?? "사용자"} />
                <Button className="shrink-0 whitespace-nowrap" onClick={signOut} variant="ghost">
                  로그아웃
                </Button>
              </>
            ) : (
              <LoginButton variant="ghost">로그인</LoginButton>
            )}
          </div>
          <Button className="md:hidden" onClick={() => setDrawerOpen(true)} variant="ghost">
            메뉴
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
        className="min-w-fit whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium leading-5 text-[var(--color-text-sub)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-main)] xl:px-4"
        href={item.href}
      >
        {item.label}
      </a>
    ) : (
      <NavLink
        key={item.to}
        className={({ isActive }) =>
          [
            "min-w-fit whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium leading-5 transition-colors xl:px-4",
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
