import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

export function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
