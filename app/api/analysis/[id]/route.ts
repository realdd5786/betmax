import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth();
  const analysis = await prisma.analysis.findUnique({
    where: { id: params.id }
  });

  if (!analysis) {
    return NextResponse.json({ error: "Análise não encontrada." }, { status: 404 });
  }

  if (analysis.userId !== user.id && !user.isStaticAdmin) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  return NextResponse.json({ analysis });
}
