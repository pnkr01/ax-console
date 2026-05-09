"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { loginSchema, LoginInput } from "@/shared/lib/schemas";
import { Activity, ShieldCheck, Zap, Globe, AlertCircle } from "lucide-react";
import apiClient from "@/core/api/client";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";

export default function LoginPage() {
  const { 
    register, 
    handleSubmit,
    setError,
    formState: { errors, isSubmitting } 
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      const tenantSlug = response.data.tenant_slug;

      if (tenantSlug) {
        window.location.assign(`/dashboard/${tenantSlug}/overview`);
      } else {
        window.location.assign("/onboarding/setup");
      }
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      setError("root", { type: "server", message: errorMessage });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Side: Splash Screen */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between text-white border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AX Analytics</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-8">
            Welcome back to <br /> <span className="text-blue-500">Mission Control.</span>
          </h1>
          <div className="space-y-8">
            <Feature icon={<Zap className="text-blue-400 w-6 h-6" />} title="Sub-millisecond Latency" desc="Engineered for high-concurrency AI agent telemetry." />
            <Feature icon={<ShieldCheck className="text-green-400 w-6 h-6" />} title="Enterprise Security" desc="SHA-256 key hashing and multi-tenant isolation." />
            <Feature icon={<Globe className="text-purple-400 w-6 h-6" />} title="Hyperlocal Insights" desc="Trace produce, voice, and actions across the globe." />
          </div>
        </div>
        <p className="text-slate-400 text-sm font-medium">© 2026 AX Analytics Inc. Built for Production.</p>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sign in</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="font-medium">{errors.root.message}</p>
              </div>
            )}

            <div className="space-y-4">
                <Input<LoginInput> 
                label="Work Email" 
                name="email" 
                register={register} 
                error={errors.email?.message} 
                placeholder="name@company.com" 
                autoFocus
                />
                <Input<LoginInput> 
                label="Password" 
                name="password" 
                type="password" 
                register={register} 
                error={errors.password?.message} 
                placeholder="••••••••" 
                />
            </div>
            
            <div className="pt-2">
                <Button isLoading={isSubmitting} variant="primary">
                Sign in
                </Button>
            </div>

            <p className="text-center text-sm text-slate-500 pt-4">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// Extracted internal feature component - keep this here as it's specific to the splash screens
function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string; }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 h-fit">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg text-slate-100">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}