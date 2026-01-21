import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getBalance } from "@/lib/credits";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const balance = user && !user.isStaticAdmin ? await getBalance(user.id) : 9999;

  const transactions = user?.isStaticAdmin
    ? []
    : await prisma.creditTransaction.findMany({
        where: { userId: user?.id },
        orderBy: { createdAt: "desc" },
        take: 5
      });

  const analyses = user?.isStaticAdmin
    ? []
    : await prisma.analysis.findMany({
        where: { userId: user?.id },
        orderBy: { createdAt: "desc" },
        take: 5
      });

  return (
    <div className="space-y-8">
      <Card title="Seu saldo">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-primary">{balance} créditos</p>
          <div className="flex gap-2">
            <Link href="/credits">
              <Button variant="secondary">Comprar créditos</Button>
            </Link>
            <Link href="/analysis">
              <Button>Fazer análise</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Últimas transações">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma transação recente.</p>
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

        <Card title="Últimas análises">
          {analyses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma análise recente.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {analyses.map((analysis) => (
                <li key={analysis.id} className="flex items-center justify-between">
                  <span>
                    {analysis.teamA} x {analysis.teamB}
                  </span>
                  <Link href={`/analysis/${analysis.id}`} className="text-primary">
                    Ver
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
