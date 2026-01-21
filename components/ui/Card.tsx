import { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Card({ title, children, footer }: CardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      {title && <h3 className="mb-4 text-lg font-semibold">{title}</h3>}
      <div className="space-y-4">{children}</div>
      {footer && <div className="mt-6 border-t pt-4">{footer}</div>}
    </div>
  );
}
