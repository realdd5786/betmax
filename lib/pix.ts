import { prisma } from "@/lib/db";

export type CreditPackage = {
  id: string;
  credits: number;
  priceBRL: number;
  label: string;
};

export const creditPackages: CreditPackage[] = [
  { id: "basic-10", credits: 10, priceBRL: 19, label: "10 créditos" },
  { id: "pro-30", credits: 30, priceBRL: 49, label: "30 créditos" },
  { id: "max-100", credits: 100, priceBRL: 139, label: "100 créditos" }
];

export function getPackageById(packageId: string) {
  const pkg = creditPackages.find((item) => item.id === packageId);
  if (!pkg) {
    throw new Error("Pacote inválido");
  }
  return pkg;
}

export async function createPixPurchase({
  userId,
  packageId
}: {
  userId: string;
  packageId: string;
}) {
  const pkg = getPackageById(packageId);
  const pixKey = "FUTMAX-SANDBOX";
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const pixPayload = `000201FUTMAX${pkg.id}${Date.now()}`;
  const qrCodeBase64 = Buffer.from(`PIX:${pixPayload}`).toString("base64");

  return prisma.pixPurchase.create({
    data: {
      userId,
      packageId: pkg.id,
      amountBRL: pkg.priceBRL,
      status: "PENDING",
      pixKey,
      pixPayload,
      qrCodeBase64,
      expiresAt
    }
  });
}

export async function confirmPixPurchase(purchaseId: string, userId: string) {
  const purchase = await prisma.pixPurchase.findUnique({
    where: { id: purchaseId }
  });
  if (!purchase) {
    throw new Error("Cobrança não encontrada");
  }

  if (purchase.userId !== userId) {
    throw new Error("Sem permissão");
  }

  if (purchase.status !== "PENDING") {
    return purchase;
  }

  const pkg = getPackageById(purchase.packageId);

  const updated = await prisma.pixPurchase.update({
    where: { id: purchaseId },
    data: {
      status: "PAID",
      paidAt: new Date()
    }
  });

  await prisma.creditTransaction.create({
    data: {
      userId: purchase.userId,
      type: "PURCHASE",
      status: "PAID",
      amount: pkg.credits,
      metadata: { purchaseId: purchase.id, packageId: pkg.id }
    }
  });

  return updated;
}
