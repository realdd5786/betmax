"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      showToast("Credenciais inválidas.", "error");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <Card title="Entrar">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="E-mail" name="email" type="email" required />
          <Input label="Senha" name="password" type="password" required />
          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground">
          <Link href="/auth/forgot-password">Esqueci minha senha</Link>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Não tem conta? <Link href="/auth/register">Criar conta</Link>
        </div>
      </Card>
    </div>
  );
}
