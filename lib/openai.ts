import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export function buildPrompt({
  teamA,
  teamB,
  competition,
  matchDate
}: {
  teamA: string;
  teamB: string;
  competition: string;
  matchDate?: string | null;
}) {
  return `Você é um analista esportivo. Compare dois clubes de futebol considerando força atual, momento, estilo de jogo, confronto direto, mando de campo e contexto da competição.\n\nRegras de saída:\n- Gere JSON estruturado com: confidenceScore (0-100), teamAPros, teamACons, teamBPros, teamBCons, marketSuggestions (lista com mercado e ressalvas), responsibilityWarning.\n- Gere também um texto humano resumido.\n- Seja claro, direto e em PT-BR.\n\nJogo: ${teamA} x ${teamB}\nCompetição: ${competition}\nData: ${matchDate ?? "não informada"}\n\nFormato de resposta JSON:\n{\n  "confidenceScore": 0,\n  "teamAPros": [""],\n  "teamACons": [""],\n  "teamBPros": [""],\n  "teamBCons": [""],\n  "marketSuggestions": [{"market": "", "note": ""}],\n  "responsibilityWarning": ""\n}\n\nDepois do JSON, escreva um texto humano com um parágrafo curto.`;
}

export async function runOpenAIAnalysis(prompt: string) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: "Você gera análises de futebol responsáveis e em PT-BR."
      },
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0]?.message?.content ?? "";
}
