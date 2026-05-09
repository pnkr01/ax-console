"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { workspaceSchema, WorkspaceInput } from "@/shared/lib/schemas";
import apiClient from "@/core/api/client";

export default function WorkspaceSetupPage() {
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    setError,
    formState: { errors, isSubmitting } 
  } = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      industry: "",
    }
  });

  // Watch the slug field to show a live preview of the URL
  const slugValue = watch("slug", "");

  const onSubmit = async (data: WorkspaceInput) => {
    try {
      // 1. Call the Go Management API to create the tenant
      const res = await apiClient.post("/tenants", data);
      
      // 2. Extract the slug from the response (Go might capitalize it as 'Slug')
      const tenantSlug = res.data.Slug || res.data.slug;
      
      // 3. Navigate to the newly created dashboard
      // Use router.push because the AX_SESSION cookie was already set during registration
      router.push(`/dashboard/${tenantSlug}/overview`);
    } catch (err: unknown) {
      let errorMessage = "Could not create workspace. Please try a different slug.";
      
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      
      setError("root", { type: "server", message: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10 border border-slate-200">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create your workspace</h1>
          <p className="text-slate-500 mt-2">Set up your enterprise environment to begin tracking AI telemetry.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Server Side Error Handling */}
          {errors.root && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {errors.root.message}
            </div>
          )}

          <div className="space-y-4">
            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Company Name</label>
              <input 
                {...register("name")}
                placeholder="e.g. Fidelity International"
                className={`w-full p-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            {/* Workspace Slug / URL */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Workspace URL</label>
              <div className={`flex items-center border rounded-lg bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 ${
                errors.slug ? 'border-red-500' : 'border-slate-200'
              }`}>
                <span className="px-4 text-slate-400 text-sm font-medium border-r border-slate-200 bg-slate-100 py-3">
                  ax.com/
                </span>
                <input 
                  {...register("slug")}
                  placeholder="fidelity-intl"
                  className="flex-1 bg-white p-3 outline-none text-slate-900"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 italic">
                Your dashboard will be at: ax.com/dashboard/{slugValue || 'your-slug'}/overview
              </p>
              {errors.slug && <p className="text-xs text-red-500 font-medium">{errors.slug.message}</p>}
            </div>

            {/* Industry Selection */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Industry</label>
              <select 
                {...register("industry")}
                className={`w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.industry ? 'border-red-500' : 'border-slate-200'
                }`}
              >
                <option value="" disabled>Select your industry</option>
                <option value="fintech">Fintech & Banking</option>
                <option value="logistics">Hyperlocal Marketplace</option>
                <option value="healthcare">Healthcare & Biotech</option>
                <option value="ecommerce">E-commerce</option>
              </select>
              {errors.industry && <p className="text-xs text-red-500 font-medium">{errors.industry.message}</p>}
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Finalizing Workspace..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}