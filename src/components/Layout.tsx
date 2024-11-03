import { Sidebar } from "@/components/Sidebar/sidebar";
import { useSidebarToggle } from "@/hook/use-sidebar-toggle";
import { useStore } from "@/hook/use-store";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <div className="flex flex-col h-screen">
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)]  transition-[margin-left] ease-in-out duration-300 overflow-auto overflow-x-hidden",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}

