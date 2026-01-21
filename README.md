# FutMax

Plataforma de análises de futebol com inteligência artificial, compra de créditos via PIX sandbox e geração de PDF. O FutMax foi desenhado para simplicidade, com foco em usuários 50+ e uso em Android.

## Visão geral
- Next.js LTS (App Router) + TypeScript
- TailwindCSS com tokens de tema
- MongoDB + Prisma
- NextAuth (Credentials) com JWT
- OpenAI oficial no servidor
- PDF server-side com PDFKit

## Setup local (sem Docker)
1. Copie as variáveis:
   ```bash
   cp .env.example .env
   ```
2. Configure o MongoDB local ou remoto e ajuste `DATABASE_URL`.
3. Instale dependências:
   ```bash
   npm install
   ```
4. Rode o Prisma:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run seed
   ```
5. Inicie o projeto:
   ```bash
   npm run dev
   ```

## Setup local (com Docker)
1. Copie as variáveis:
   ```bash
   cp .env.example .env
   ```
2. Build e execute:
   ```bash
   docker build -t futmax .
   docker run --env-file .env -p 3000:3000 futmax
   ```

## Como configurar o MongoDB
- Para MongoDB local, use `mongodb://localhost:27017/futmax`.
- Para Atlas, use a string de conexão do cluster no `DATABASE_URL`.

## Prisma: db push + seed
```bash
npm run prisma:push
npm run seed
```

## Como simular PIX sandbox
1. Acesse **Créditos**.
2. Clique em **Comprar via PIX**.
3. O sistema gera QR e payload.
4. Clique em **Confirmar pagamento (sandbox)**.

## Como configurar OpenAI
- Defina `OPENAI_API_KEY` no `.env`.
- A chave fica somente no servidor.

## Deploy na Vercel
1. Crie um novo projeto na Vercel.
2. Configure variáveis:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `OPENAI_API_KEY`
   - `ENABLE_STATIC_ADMIN`
   - `ANALYSIS_COST_CREDITS`
3. Deploy automático pelo Git.

## Checklist de produção
- Integrar provedor PIX real com webhooks.
- Revisar rate limit com Redis.
- Adicionar logs e observabilidade.
- Monitorar falhas do OpenAI.
- Ajustar política de segurança (CSP) conforme serviços externos.

## Rodar localmente (checklist)
- `cp .env.example .env`
- `npm install`
- `npm run prisma:generate`
- `npm run prisma:push`
- `npm run seed`
- `npm run dev`
