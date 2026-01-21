import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { confirmPixPurchase } from "@/lib/pix";
import { pixConfirmSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await requireAuth();
  const body = await request.json();
  const parsed = pixConfirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  try {
    const purchase = await confirmPixPurchase(parsed.data.purchaseId, user.id);
    return NextResponse.json({ purchase });
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível confirmar." }, { status: 400 });
  }
}
