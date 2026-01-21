import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Footer } from "@/components/Footer";

const faqs = [
  {
    question: "O que é o FutMax?",
    answer:
      "O FutMax é um sistema de análise de partidas de futebol com inteligência artificial, feito para ajudar você a tomar decisões com mais informação."
  },
  {
    question: "As análises garantem lucro?",
    answer:
      "Não. As análises são orientativas e não garantem resultados. A decisão final é sempre sua."
  },
  {
    question: "Como funcionam os créditos?",
    answer:
      "Você compra pacotes de créditos e usa para gerar análises. Cada análise consome uma quantidade fixa de créditos."
  },
  {
    question: "Preciso saber tecnologia?",
    answer:
      "Não. O FutMax foi pensado para ser simples, com botões grandes e explicações claras."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="flex flex-col gap-4">
          <Badge tone="success">IA + Futebol + Responsabilidade</Badge>
          <h1 className="text-3xl font-bold md:text-5xl">FutMax: decisões mais seguras para o seu futebol.</h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Pensado para o público 50+ e para quem usa Android. Interface simples, análises diretas e créditos flexíveis.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/auth/register">
            <Button> Criar conta </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline">Entrar</Button>
          </Link>
          <Link href="/credits">
            <Button variant="secondary">Comprar créditos</Button>
          </Link>
          <Link href="/analysis">
            <Button variant="primary">Fazer análise</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16">
        <section className="grid gap-6 md:grid-cols-3">
          <Card title="Exemplo de análise">
            <p className="text-sm text-muted-foreground">
              Flamengo x Palmeiras - Série A. Momento recente favorece o Flamengo, com ataque eficiente e mando forte.
            </p>
            <ul className="list-disc pl-5 text-sm">
              <li>Confiança: 72/100</li>
              <li>Mercados sugeridos: dupla chance e gols acima de 1.5</li>
              <li>Risco moderado, considerar desfalques</li>
            </ul>
          </Card>
          <Card title="Compra simples por PIX">
            <p className="text-sm text-muted-foreground">
              Geração automática de QR Code e confirmação sandbox. Sem complicação para recarregar créditos.
            </p>
          </Card>
          <Card title="PDF para imprimir">
            <p className="text-sm text-muted-foreground">
              Gere relatórios em PDF para compartilhar com amigos ou guardar seu histórico.
            </p>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card title="Por que o FutMax?">
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>Interface simples e direta.</li>
              <li>Análises em linguagem humana.</li>
              <li>Controle de créditos com histórico completo.</li>
              <li>Alertas de responsabilidade e riscos.</li>
            </ul>
          </Card>
          <Card title="Perguntas frequentes">
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-sm font-semibold">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">Pronto para começar?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie sua conta, compre créditos e gere análises em minutos.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/register">
              <Button>Começar agora</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline">Já tenho conta</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FutMax",
            url: "https://futmax.vercel.app",
            description: "Plataforma de análises de futebol com IA e créditos flexíveis.",
            sameAs: []
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FutMax",
            url: "https://futmax.vercel.app",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://futmax.vercel.app/analysis?query={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </div>
  );
}
