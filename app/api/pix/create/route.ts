import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createPixPurchase } from "@/lib/pix";
import { pixCreateSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await requireAuth();
  const body = await request.json();
  const parsed = pixCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const purchase = await createPixPurchase({
    userId: user.id,
    packageId: parsed.data.packageId
  });

  return NextResponse.json({ purchase });
}
