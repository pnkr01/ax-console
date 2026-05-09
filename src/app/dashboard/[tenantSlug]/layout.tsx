import { ReactNode } from "react";
import { Sidebar } from "@/features/dashboard/components/Sidebar"; // Adjust path if needed
import { Header } from "@/features/dashboard/components/Header";   // Adjust path if needed

interface DashboardLayoutProps {
  children: ReactNode;
  // Next.js 15 Rule: params is a Promise
  params: Promise<{ tenantSlug: string }>; 
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  // Await the params before extracting the slug
  const resolvedParams = await params;
  const tenantSlug = resolvedParams.tenantSlug;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Pass the properly resolved string to the Sidebar */}
      <Sidebar tenantSlug={tenantSlug} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}