import { Outlet, useLocation } from "react-router-dom";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { ToastViewport } from "../common/ToastViewport";

export function AppLayout() {
  const location = useLocation();
  const isEditorRoute = location.pathname === "/editor" || location.pathname.startsWith("/editor/");

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)]">
      <Header />
      <main
        className={[
          "mx-auto flex w-full flex-1 flex-col",
          isEditorRoute ? "max-w-none px-0 py-6" : "max-w-7xl px-6 py-10 lg:px-10",
        ].join(" ")}
      >
        <Outlet />
      </main>
      <Footer />
      <ToastViewport />
    </div>
  );
}
