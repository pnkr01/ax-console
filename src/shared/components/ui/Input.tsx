import { UseFormRegister, FieldValues, Path } from "react-hook-form";

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
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        autoFocus={autoFocus}
        {...register(name)}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm ${
          error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 hover:border-slate-300'
        }`}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}