import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="pl-[228px] w-full min-h-screen bg-background">
        {children}
      </main>
    </div>
  );
}
