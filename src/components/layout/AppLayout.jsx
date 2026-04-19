import { Outlet } from "react-router-dom";

import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)]">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10 lg:px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
