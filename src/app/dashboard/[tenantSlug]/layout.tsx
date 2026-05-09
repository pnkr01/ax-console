import { ReactNode } from "react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";

export default async function DashboardLayout({ 
  children, 
  params 
}: { 
  children: ReactNode; 
  params: Promise<{ tenantSlug: string }> 
}) {
  const { tenantSlug } = await params;

  return (
    <div className="flex h-screen w-full bg-zinc-50/50 overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar tenantSlug={tenantSlug} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header stays at the top */}
        <Header />
        
        {/* Content area with internal padding and max-width for readability */}
        <main className="flex-1 overflow-y-auto px-10 py-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}