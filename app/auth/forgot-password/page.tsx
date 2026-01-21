"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResetLink(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    setLoading(false);

    const data = await response.json();
    if (!response.ok) {
      showToast(data.error ?? "Erro ao solicitar reset.", "error");
      return;
    }

    showToast("Link de reset enviado (modo sandbox).", "success");
    if (data.resetLink) {
      setResetLink(data.resetLink);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <Card title="Esqueci minha senha">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="E-mail" name="email" type="email" required />
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link"}
          </Button>
        </form>
        {resetLink && (
          <div className="mt-4 rounded-md border bg-muted p-3 text-sm">
            <p className="font-semibold">Sandbox</p>
            <a href={resetLink} className="break-all text-primary">
              {resetLink}
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}
