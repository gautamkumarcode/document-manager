"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: FileText,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="hidden md:flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-400">
          AdminPanel
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white"
                )}
              />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
