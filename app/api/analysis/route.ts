import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { analysisSchema } from "@/lib/validators";
import { buildPrompt, runOpenAIAnalysis } from "@/lib/openai";
import { rateLimit } from "@/lib/rateLimit";
import { consumeCredits, refundCredits, reserveCredits } from "@/lib/credits";

function extractJsonAndText(content: string) {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Resposta inválida");
  }
  const jsonString = jsonMatch[0];
  const json = JSON.parse(jsonString);
  const text = content.replace(jsonString, "").trim();
  return { json, text };
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await requireAuth();
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rate = rateLimit(`${user.id}:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Limite de requisições atingido." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = analysisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const costCredits = Number(process.env.ANALYSIS_COST_CREDITS ?? 5);

  let reservation: { id: string } | null = null;

  try {
    if (!user.isStaticAdmin) {
      reservation = await reserveCredits({
        userId: user.id,
        amount: costCredits,
        metadata: { reason: "analysis" }
      });
    }

    const prompt = buildPrompt(parsed.data);
    const content = await runOpenAIAnalysis(prompt);

    const { json, text } = extractJsonAndText(content);

    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        teamA: parsed.data.teamA,
        teamB: parsed.data.teamB,
        competition: parsed.data.competition,
        matchDate: parsed.data.matchDate ?? null,
        prompt,
        resultJson: json,
        resultText: text,
        costCredits
      }
    });

    if (reservation) {
      await consumeCredits(reservation.id);
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    if (error instanceof Error && error.message === "Saldo insuficiente") {
      return NextResponse.json({ error: "Saldo insuficiente." }, { status: 402 });
    }
    if (reservation) {
      await refundCredits({
        userId: user.id,
        amount: costCredits,
        metadata: { reason: "openai_failure" }
      });
    }

    return NextResponse.json({ error: "Não foi possível gerar a análise." }, { status: 500 });
  }
}
