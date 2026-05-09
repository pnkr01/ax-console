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
    <div className="flex min-h-screen bg-zinc-50">
      {/* Left Side: Splash Screen with Gradient Mesh */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0b] p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Activity className="w-7 h-7 text-blue-500" />
            </div>
            <span className="text-xl font-bold tracking-wide">AX Analytics</span>
          </div>
          <h1 className="text-5xl font-bold leading-[1.15] mb-10 tracking-tight">
            Welcome back to <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Mission Control.
            </span>
          </h1>
          <div className="space-y-8">
            <Feature icon={<Zap className="text-blue-400 w-5 h-5" />} title="Sub-millisecond Latency" desc="Engineered for high-concurrency AI agent telemetry." />
            <Feature icon={<ShieldCheck className="text-emerald-400 w-5 h-5" />} title="Enterprise Security" desc="SHA-256 key hashing and multi-tenant isolation." />
            <Feature icon={<Globe className="text-purple-400 w-5 h-5" />} title="Hyperlocal Insights" desc="Trace produce, voice, and actions across the globe." />
          </div>
        </div>
        <p className="text-zinc-500 text-[13px] font-medium relative z-10">© 2026 AX Analytics Inc. Built for Production.</p>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Sign in</h2>
            <p className="text-zinc-500 mt-2.5 text-sm">Enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-[13px] rounded-xl flex gap-3 items-start animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{errors.root.message}</p>
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
                  Sign in to Workspace
                </Button>
            </div>

            <p className="text-center text-[13px] text-zinc-500 pt-4">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-zinc-900 font-semibold hover:text-blue-600 transition-colors">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string; }) {
  return (
    <div className="flex gap-4 group">
      <div className="mt-1 bg-white/5 p-2.5 rounded-xl border border-white/10 h-fit group-hover:bg-white/10 transition-colors">{icon}</div>
      <div>
        <h3 className="font-semibold text-[15px] text-zinc-100">{title}</h3>
        <p className="text-zinc-400 text-[13px] leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}