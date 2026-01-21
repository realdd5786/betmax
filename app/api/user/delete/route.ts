import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  const user = await requireAuth();
  if (user.isStaticAdmin) {
    return NextResponse.json({ error: "Conta estática não pode ser removida." }, { status: 400 });
  }

  await prisma.analysis.deleteMany({ where: { userId: user.id } });
  await prisma.creditTransaction.deleteMany({ where: { userId: user.id } });
  await prisma.pixPurchase.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ success: true });
}
