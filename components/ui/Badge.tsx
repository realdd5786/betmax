import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "success" | "warning" | "info";
};

const tones = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800"
};

export function Badge({ children, tone = "info" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
