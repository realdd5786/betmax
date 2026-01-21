"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      showToast("Token inválido.", "error");
      return;
    }
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });

    setLoading(false);

    const data = await response.json();
    if (!response.ok) {
      showToast(data.error ?? "Erro ao resetar senha.", "error");
      return;
    }

    showToast("Senha atualizada. Faça login.", "success");
    window.location.href = "/auth/login";
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <Card title="Resetar senha">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Nova senha" name="password" type="password" required minLength={6} />
          <Button type="submit" disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar senha"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
