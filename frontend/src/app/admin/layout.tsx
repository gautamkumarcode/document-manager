import { Header } from "@/components/admin/Header";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-sidebar">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
