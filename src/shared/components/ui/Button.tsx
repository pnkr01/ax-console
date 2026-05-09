import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "outline";
}

export function Button({ 
  children, 
  isLoading, 
  variant = "primary", 
  className = "", 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900";
  
  const variants = {
    primary: "bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm hover:shadow-md",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md focus-visible:ring-blue-600",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus-visible:ring-red-600",
    outline: "bg-transparent border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}