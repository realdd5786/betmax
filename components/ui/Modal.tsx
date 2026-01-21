import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
};

export function Modal({ open, title, onClose, children, actions }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button aria-label="Fechar modal" onClick={onClose} className="text-sm text-muted-foreground">
            Fechar
          </button>
        </div>
        <div className="mt-4 space-y-4">{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
}
