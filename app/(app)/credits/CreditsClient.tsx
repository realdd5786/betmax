"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ToastProvider";
import type { CreditPackage } from "@/lib/pix";

type Purchase = {
  id: string;
  pixPayload: string;
  qrCodeBase64?: string | null;
  status: string;
};

type Transaction = {
  id: string;
  type: string;
  status: string;
  amount: number;
  createdAt: string;
};

type CreditsClientProps = {
  packages: CreditPackage[];
  transactions: Transaction[];
};

export function CreditsClient({ packages, transactions }: CreditsClientProps) {
  const { showToast } = useToast();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handlePurchase(packageId: string) {
    setLoadingId(packageId);
    const response = await fetch("/api/pix/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId })
    });
    setLoadingId(null);

    const data = await response.json();
    if (!response.ok) {
      showToast(data.error ?? "Erro ao gerar PIX.", "error");
      return;
    }

    setPurchase(data.purchase);
    showToast("PIX criado. Confirme no sandbox.", "success");
  }

  async function confirmPayment() {
    if (!purchase) return;

    const response = await fetch("/api/pix/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId: purchase.id })
    });

    const data = await response.json();
    if (!response.ok) {
      showToast(data.error ?? "Erro ao confirmar.", "error");
      return;
    }

    setPurchase(data.purchase);
    showToast("Pagamento confirmado! Créditos liberados.", "success");
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <Card title="Pacotes de créditos">
        <div className="grid gap-4 md:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="rounded-lg border p-4">
              <h4 className="text-lg font-semibold">{pkg.label}</h4>
              <p className="text-sm text-muted-foreground">R$ {pkg.priceBRL}</p>
              <Button
                className="mt-3 w-full"
                onClick={() => handlePurchase(pkg.id)}
                disabled={loadingId === pkg.id}
              >
                {loadingId === pkg.id ? "Gerando..." : "Comprar via PIX"}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {purchase && (
        <Card title="PIX sandbox">
          <p className="text-sm text-muted-foreground">Status: {purchase.status}</p>
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold">PIX copia e cola</p>
            <code className="block break-all rounded bg-muted p-2 text-xs">{purchase.pixPayload}</code>
            {purchase.qrCodeBase64 && (
              <img
                src={`data:image/png;base64,${purchase.qrCodeBase64}`}
                alt="QR Code PIX"
                className="h-32 w-32"
              />
            )}
            <Button variant="secondary" onClick={confirmPayment}>
              Confirmar pagamento (sandbox)
            </Button>
          </div>
        </Card>
      )}

      <Card title="Histórico de transações">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem transações.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between">
                <span>{transaction.type}</span>
                <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
