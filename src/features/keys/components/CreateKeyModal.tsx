"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { X, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import apiClient from "@/core/api/client";
import { createKeySchema, CreateKeyInput } from "@/shared/lib/schemas";

interface CreateKeyModalProps {
  tenantSlug: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateKeyModal({ tenantSlug, isOpen, onClose, onSuccess }: CreateKeyModalProps) {
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateKeyInput>({
    resolver: zodResolver(createKeySchema),
  });

  const onSubmit = async (data: CreateKeyInput) => {
    try {
      // data is guaranteed to be { name: "string" } because of your Zod schema!
      const response = await apiClient.post(`/tenants/${tenantSlug}/keys`, data);
      
      // Extract the raw key from the Go backend response
      if (response.data && response.data.api_key) {
        setGeneratedKey(response.data.api_key);
        onSuccess(); // Trigger the table refresh in the parent component
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: unknown) {
      let errorMessage = "Failed to generate key. Please try again.";
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      setError("root", { type: "server", message: errorMessage });
    }
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    reset(); // Clear the form
    setGeneratedKey(null); // Clear the key
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Create API Key</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* STATE 1: Show the Form */}
          {!generatedKey ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{errors.root.message}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Key Name</label>
                <input
                  {...register("name")}
                  placeholder="e.g., Production Next.js Edge"
                  className={`w-full p-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-slate-300"
                  }`}
                  autoFocus
                />
                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Keys grant full ingestion access to your workspace. Ensure you name it appropriately so you can easily identify and revoke it later if compromised.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Generating..." : "Generate Key"}
                </button>
              </div>
            </form>
          ) : (
            
            /* STATE 2: Show the Generated Key (Only Once!) */
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-2 mb-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Key Generated Successfully</h3>
                <p className="text-sm text-slate-500">
                  Please copy this key and store it securely. For your protection, you will not be able to view it again.
                </p>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  readOnly
                  value={generatedKey}
                  className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-900 outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-2 p-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg shadow-sm transition"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 text-sm font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
              >
                I have saved my key
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}