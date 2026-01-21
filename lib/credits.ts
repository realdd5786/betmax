import { prisma } from "@/lib/db";

export async function getBalance(userId: string) {
  const result = await prisma.creditTransaction.aggregate({
    where: { userId },
    _sum: { amount: true }
  });
  return result._sum.amount ?? 0;
}

export async function reserveCredits({
  userId,
  amount,
  metadata
}: {
  userId: string;
  amount: number;
  metadata?: Record<string, unknown>;
}) {
  const balance = await getBalance(userId);
  if (balance < amount) {
    throw new Error("Saldo insuficiente");
  }

  return prisma.creditTransaction.create({
    data: {
      userId,
      type: "CONSUME",
      status: "RESERVED",
      amount: -Math.abs(amount),
      metadata: metadata ?? {}
    }
  });
}

export async function consumeCredits(transactionId: string) {
  return prisma.creditTransaction.update({
    where: { id: transactionId },
    data: {
      status: "CONSUMED"
    }
  });
}

export async function refundCredits({
  userId,
  amount,
  metadata
}: {
  userId: string;
  amount: number;
  metadata?: Record<string, unknown>;
}) {
  return prisma.creditTransaction.create({
    data: {
      userId,
      type: "REFUND",
      status: "REFUNDED",
      amount: Math.abs(amount),
      metadata: metadata ?? {}
    }
  });
}
