import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "FutMax | Inteligência para apostas com responsabilidade",
  description:
    "FutMax oferece análises de futebol com IA, compra de créditos e relatórios em PDF. Feito para torcedores e investidores esportivos.",
  metadataBase: new URL("https://futmax.vercel.app"),
  openGraph: {
    title: "FutMax | Inteligência para apostas com responsabilidade",
    description:
      "Análises de futebol com IA, créditos flexíveis e relatório em PDF. FutMax é simples e seguro.",
    type: "website",
    url: "https://futmax.vercel.app"
  },
  twitter: {
    card: "summary_large_image",
    title: "FutMax",
    description: "Análises esportivas com IA e responsabilidade."
  },
  robots: "index, follow"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
