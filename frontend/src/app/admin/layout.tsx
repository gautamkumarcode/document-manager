import { Header } from "@/components/admin/Header";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
