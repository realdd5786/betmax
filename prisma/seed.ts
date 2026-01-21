import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

async function main() {
  await prisma.analysis.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.pixPurchase.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("senha123", 10);

  const user1 = await prisma.user.create({
    data: {
      email: "joao@futmax.com",
      passwordHash
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: "maria@futmax.com",
      passwordHash
    }
  });

  await prisma.creditTransaction.createMany({
    data: [
      {
        userId: user1.id,
        type: "PURCHASE",
        status: "PAID",
        amount: 30,
        metadata: { seed: true }
      },
      {
        userId: user1.id,
        type: "CONSUME",
        status: "CONSUMED",
        amount: -5,
        metadata: { seed: true }
      },
      {
        userId: user2.id,
        type: "PURCHASE",
        status: "PAID",
        amount: 10,
        metadata: { seed: true }
      }
    ]
  });

  await prisma.analysis.createMany({
    data: [
      {
        userId: user1.id,
        teamA: "Flamengo",
        teamB: "Palmeiras",
        competition: "Série A",
        matchDate: "2024-08-12",
        prompt: "Análise seed",
        resultJson: {
          confidenceScore: 72,
          teamAPros: ["Mando de campo"],
          teamACons: ["Defesa instável"],
          teamBPros: ["Elenco completo"],
          teamBCons: ["Sequência de viagens"],
          marketSuggestions: [{ market: "Dupla chance", note: "Proteção" }],
          responsibilityWarning: "Não é garantia."
        },
        resultText: "Flamengo tem vantagem pelo mando, mas o Palmeiras traz equilíbrio.",
        costCredits: 5
      },
      {
        userId: user2.id,
        teamA: "Corinthians",
        teamB: "São Paulo",
        competition: "Paulistão",
        matchDate: "2024-09-02",
        prompt: "Análise seed",
        resultJson: {
          confidenceScore: 65,
          teamAPros: ["Ataque forte"],
          teamACons: ["Baixa criação"],
          teamBPros: ["Defesa sólida"],
          teamBCons: ["Pouca finalização"],
          marketSuggestions: [{ market: "Menos de 2.5 gols", note: "Clássico tenso" }],
          responsibilityWarning: "Não é garantia."
        },
        resultText: "Clássico equilibrado, com tendência de poucos gols.",
        costCredits: 5
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
