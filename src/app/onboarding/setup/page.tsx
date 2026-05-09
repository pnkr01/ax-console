"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { workspaceSchema, WorkspaceInput } from "@/shared/lib/schemas";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { workspaceService } from "@/core/services/workspace.service";
import { AlertCircle } from "lucide-react";

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

  const slugValue = watch("slug", "");

  const onSubmit = async (data: WorkspaceInput) => {
    try {
      // Utilizing our new Service Implementation
      const { tenantSlug } = await workspaceService.createWorkspace(data);
      
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
          
          {errors.root && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p>{errors.root.message}</p>
            </div>
          )}

          <div className="space-y-4">
            <Input<WorkspaceInput> 
              label="Company Name" 
              name="name" 
              register={register} 
              error={errors.name?.message} 
              placeholder="e.g. Acme Corp" 
              autoFocus
            />

            {/* Custom UI for the Slug Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Workspace URL</label>
              <div className={`flex items-center border rounded-lg bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm ${
                errors.slug ? 'border-red-500 focus-within:ring-red-200' : 'border-slate-200'
              }`}>
                <span className="px-4 text-slate-500 text-sm font-medium border-r border-slate-200 bg-slate-100 py-3">
                  ax.com/
                </span>
                <input 
                  {...register("slug")}
                  placeholder="acme-corp"
                  className="flex-1 bg-white p-3 outline-none text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Your dashboard will be at: <span className="text-slate-900">ax.com/dashboard/{slugValue || 'your-slug'}/overview</span>
              </p>
              {errors.slug && <p className="text-xs text-red-500 font-medium">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Industry</label>
              <select 
                {...register("industry")}
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm ${
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

          <div className="pt-4">
            <Button isLoading={isSubmitting} variant="primary">
              Complete Setup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}