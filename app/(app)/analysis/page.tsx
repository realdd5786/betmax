"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ToastProvider";

export default function AnalysisPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      teamA: String(form.get("teamA")),
      teamB: String(form.get("teamB")),
      competition: String(form.get("competition")),
      matchDate: form.get("matchDate") ? String(form.get("matchDate")) : null
    };

    const response = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      showToast(data.error ?? "Erro ao gerar análise.", "error");
      return;
    }

    window.location.href = `/analysis/${data.analysis.id}`;
  }

  return (
    <Card title="Nova análise">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Time A" name="teamA" required />
        <Input label="Time B" name="teamB" required />
        <Input label="Campeonato" name="competition" required />
        <Input label="Data (opcional)" name="matchDate" type="date" />
        <Button type="submit" disabled={loading}>
          {loading ? "Analisando..." : "Gerar análise"}
        </Button>
      </form>
      {loading && (
        <div className="mt-6">
          <LoadingSkeleton lines={4} />
        </div>
      )}
    </Card>
  );
}
