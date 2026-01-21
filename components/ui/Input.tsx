import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="font-medium text-foreground">{label}</span>}
      <input
        className={`w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground shadow-sm focus-visible:ring-2 focus-visible:ring-primary ${className}`}
        {...props}
      />
    </label>
  );
}
