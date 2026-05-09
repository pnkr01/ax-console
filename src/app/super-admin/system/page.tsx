import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ServerIcon, Activity, Database, Users } from "lucide-react";

// Server-side fetch to validate super-admin status
async function validateSuperAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("AX_SESSION");

  if (!session) redirect("/login");

  // In a real scenario, you would decode the JWT here or make a fast server-to-server call 
  // to your Go backend to verify the role is 'SUPER_ADMIN'.
  // Example:
  // const res = await fetch('http://api:8081/api/v1/auth/me', { headers: { Cookie: ... } });
  // const user = await res.json();
  // if (user.role !== 'SUPER_ADMIN') redirect('/dashboard/default/overview');
  
  return true; 
}

export default async function SystemPage() {
  await validateSuperAdmin();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center gap-3 border-b border-slate-800 pb-6">
          <ServerIcon className="w-8 h-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Super Admin Console</h1>
            <p className="text-slate-500 mt-1">Global platform telemetry and tenant management.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminCard title="Active Tenants" value="142" icon={<Database className="text-blue-400" />} />
          <AdminCard title="Global Users" value="8,409" icon={<Users className="text-green-400" />} />
          <AdminCard title="System Health" value="99.99%" icon={<Activity className="text-purple-400" />} />
        </div>
        
        {/* Further tables for managing all tenants globally would go here */}
      </div>
    </div>
  );
}

function AdminCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </div>
      <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
        {icon}
      </div>
    </div>
  );
}