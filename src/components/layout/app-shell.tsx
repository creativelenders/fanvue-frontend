import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
export function AppShell() {
  return (
    <div className="flex h-screen bg-bg-main text-text-main">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
