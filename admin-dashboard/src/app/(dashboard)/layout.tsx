import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import StoreInitializer from "@/components/layout/StoreInitializer";
import { ToastProvider } from "@/components/ui/ToastProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFCFA]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}
