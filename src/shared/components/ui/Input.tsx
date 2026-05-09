import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { AlertCircle } from "lucide-react";

interface InputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function Input<T extends FieldValues>({ 
  label, 
  name, 
  register, 
  error, 
  type = "text", 
  placeholder,
  autoFocus = false
}: InputProps<T>) {
  return (
    <div className="space-y-1.5 flex flex-col">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <div className="relative">
        <input 
          type={type}
          placeholder={placeholder}
          autoFocus={autoFocus}
          {...register(name)}
          className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all duration-200 shadow-sm placeholder:text-zinc-400 ${
            error 
            ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5'
          }`}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && <p className="text-[13px] text-red-500 font-medium mt-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}