import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export default async function AnalysisDetailPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  const analysis = await prisma.analysis.findUnique({
    where: { id: params.id }
  });

  if (!analysis) {
    return <Card title="Análise não encontrada">Tente novamente.</Card>;
  }

  if (analysis.userId !== user?.id && !user?.isStaticAdmin) {
    return <Card title="Sem permissão">Você não pode acessar esta análise.</Card>;
  }

  const summary = Array.isArray((analysis.resultJson as any)?.marketSuggestions)
    ? (analysis.resultJson as any).marketSuggestions
    : [];

  return (
    <div className="space-y-6">
      <Card title={`${analysis.teamA} x ${analysis.teamB}`}>
        <p className="text-sm text-muted-foreground">{analysis.competition}</p>
        <p className="mt-4 whitespace-pre-line text-sm">{analysis.resultText}</p>
      </Card>

      <Card title="Resumo em bullets">
        <ul className="list-disc space-y-2 pl-5 text-sm">
          {summary.length === 0 ? (
            <li>Resumo não disponível.</li>
          ) : (
            summary.map((item: any, index: number) => (
              <li key={index}>
                {item.market}: {item.note}
              </li>
            ))
          )}
        </ul>
      </Card>

      <Card title="JSON completo">
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold">Ver JSON</summary>
          <pre className="mt-4 whitespace-pre-wrap rounded bg-muted p-3">
            {JSON.stringify(analysis.resultJson, null, 2)}
          </pre>
        </details>
      </Card>

      <div>
        <Link href={`/api/analysis/${analysis.id}/pdf`}>
          <Button variant="secondary">Exportar PDF</Button>
        </Link>
      </div>
    </div>
  );
}
