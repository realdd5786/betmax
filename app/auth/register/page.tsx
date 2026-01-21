"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";

export default function RegisterPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email")),
      password: String(form.get("password"))
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      showToast(data.error ?? "Erro ao criar conta.", "error");
      return;
    }

    showToast("Conta criada com sucesso. Faça login.", "success");
    window.location.href = "/auth/login";
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <Card title="Criar conta">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="E-mail" name="email" type="email" required />
          <Input label="Senha" name="password" type="password" required minLength={6} />
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground">
          Já tem conta? <Link href="/auth/login">Entrar</Link>
        </div>
      </Card>
    </div>
  );
}
