"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ToastProvider";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    const response = await fetch("/api/user/delete", {
      method: "POST"
    });
    const data = await response.json();
    if (!response.ok) {
      showToast(data.error ?? "Erro ao apagar conta.", "error");
      return;
    }
    showToast("Conta removida.", "success");
    window.location.href = "/";
  }

  return (
    <Card title="Configurações">
      <p className="text-sm text-muted-foreground">Apague sua conta e dados relacionados.</p>
      <Button variant="outline" className="mt-4" onClick={() => setOpen(true)}>
        Apagar minha conta
      </Button>
      <Modal
        open={open}
        title="Confirmar exclusão"
        onClose={() => setOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDelete}>Confirmar</Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Esta ação é permanente e remove análises, compras e créditos.
        </p>
      </Modal>
    </Card>
  );
}
