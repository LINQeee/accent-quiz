import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "default" | "outline";

interface ButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: ButtonVariant;
}

export function Button({ children, className = "", variant = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium transition disabled:pointer-events-none disabled:opacity-50";
  const styles = variant === "outline"
    ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
    : "bg-slate-900 text-white hover:bg-slate-800";

  return <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>;
}
