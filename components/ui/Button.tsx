import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const styles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primaryForeground hover:bg-accent focus-visible:ring-primary",
  secondary:
    "bg-secondary text-secondaryForeground hover:bg-secondary/90 focus-visible:ring-secondary",
  outline:
    "border border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary"
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition ${
        styles[variant]
      } ${className}`}
      {...props}
    />
  );
}
