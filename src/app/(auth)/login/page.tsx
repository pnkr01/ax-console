"use client";

import Link from "next/link";
import { useForm, UseFormRegister, FieldValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { loginSchema, LoginInput } from "@/shared/lib/schemas";
import { Activity, ShieldCheck, Zap, Globe } from "lucide-react";
import apiClient from "@/core/api/client";

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
      await apiClient.post("/auth/login", data);
      
      // Hard reload ensures the cookie is instantly recognized by the middleware
      window.location.assign("/onboarding/setup");
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      setError("root", { type: "server", message: errorMessage });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Splash Screen */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Activity className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold tracking-tight">AX Analytics</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Welcome back to <br /> <span className="text-blue-500">Mission Control.</span>
          </h1>
          <div className="space-y-6">
            <Feature icon={<Zap className="text-blue-400" />} title="Sub-millisecond Latency" desc="Engineered for high-concurrency AI agent telemetry." />
            <Feature icon={<ShieldCheck className="text-green-400" />} title="Enterprise Security" desc="SHA-256 key hashing and multi-tenant isolation." />
            <Feature icon={<Globe className="text-purple-400" />} title="Hyperlocal Insights" desc="Trace produce, voice, and actions across the globe." />
          </div>
        </div>
        <p className="text-slate-400 text-sm">© 2026 AX Analytics Inc. Built for Production.</p>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                {errors.root.message}
              </div>
            )}

            <InputGroup<LoginInput> 
              label="Work Email" 
              name="email" 
              register={register} 
              error={errors.email?.message} 
              placeholder="name@company.com" 
            />
            <InputGroup<LoginInput> 
              label="Password" 
              name="password" 
              type="password" 
              register={register} 
              error={errors.password?.message} 
              placeholder="••••••••" 
            />
            
            <button 
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 mt-2"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            {/* Link to Registration */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function Feature({ icon, title, desc }: FeatureProps) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-slate-400 text-sm">{desc}</p>
      </div>
    </div>
  );
}

interface InputGroupProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  type?: string;
  placeholder?: string;
}

function InputGroup<T extends FieldValues>({ 
  label, name, register, error, type = "text", placeholder 
}: InputGroupProps<T>) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}