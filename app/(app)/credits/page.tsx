import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { creditPackages } from "@/lib/pix";
import { CreditsClient } from "./CreditsClient";

export default async function CreditsPage() {
  const user = await getSessionUser();
  const transactions = user?.isStaticAdmin
    ? []
    : await prisma.creditTransaction.findMany({
        where: { userId: user?.id },
        orderBy: { createdAt: "desc" }
      });

  const serializedTransactions = transactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type,
    status: transaction.status,
    amount: transaction.amount,
    createdAt: transaction.createdAt.toISOString()
  }));

  return <CreditsClient packages={creditPackages} transactions={serializedTransactions} />;
}
