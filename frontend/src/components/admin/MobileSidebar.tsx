"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-r-slate-800 text-white">
        <SheetHeader className="p-6 text-left">
          <SheetTitle className="text-2xl font-bold tracking-tight text-emerald-400">
            AdminPanel
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
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
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-500 group-hover:text-white"
                    )}
                  />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-800 mb-6">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
