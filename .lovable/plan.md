
# Importar BDO Pearl Shop — só frontend, dados mockados

## O que entra

Páginas e componentes do `client/src` do projeto enviado, adaptados ao stack atual (TanStack Start + Tailwind v4 + shadcn). Backend (Express/tRPC/Drizzle), scraping (Playwright) e cron ficam **de fora**.

### Páginas portadas
- `/` — Home (Pearl Shop: header, banner de promoção, abas Ranking/Plano Ótimo/Detalhes, calculadora ROI, FAQ, news, CTA)
- `/personalize` — Importação de personagem (Garmoth) + análise personalizada (sem chamada real à API; mock local)
- ~~`/admin`~~ — **excluído** (depende inteiro de tRPC: scraping, snapshots, automação)
- `/404` — NotFound

### Componentes portados
Todos os componentes de feature relevantes:
- `features/pearl-shop/*` (PearlShopHeader, PromotionBanner, ROIRanking, OptimalPlanSection, ROICalculatorSection, FAQAccordion, PearlShopNews)
- `components/CharacterImporter`, `PersonalizedAnalysis`, `ROICalculator`, `ROICharts`, `FAQSection`, `PDFExporter`, `ErrorBoundary`
- Componentes shadcn UI faltantes (a maioria já existe no template; adiciono os que faltam)
- `core/types`, `core/constants`, `core/utils`, `shared/providers/PearlShopProvider`, `NotificationProvider`, `CacheProvider`

### Dados mockados
- Crio `src/mocks/pearl-shop.ts` com um snapshot estático de promoção (estrutura igual à de `PearlShopService`), e o `PearlShopProvider` passa a servir esses dados em vez de chamar o backend.
- `useHistoricalComparison`, `useHistoricalData` → retornam arrays vazios/estáticos.
- `CharacterImporter` (Garmoth) → função `importCharacter` retorna um personagem fake (AP/DP/GS) após pequeno delay; sem fetch externo.

### O que é descartado
- Tudo em `server/`, `shared/` (do zip), `drizzle/`, `patches/`
- `lib/trpc.ts` e qualquer hook que use `trpc.*` (admin, scraping, automation, history, auth)
- Playwright, cron, snapshots, logger server-side

## Adaptações técnicas

| Original | Vira |
|---|---|
| `wouter` (`Route`, `Switch`, `useLocation`) | `@tanstack/react-router` (`createFileRoute`, `Link`, `useNavigate`) |
| `client/src/App.tsx` (providers) | Providers movidos para `RootComponent` em `src/routes/__root.tsx` |
| `client/src/main.tsx` | Não usado (TanStack Start já tem entry) |
| `client/src/index.css` (tema dark + tokens) | Tokens portados para `src/styles.css` (oklch), tema dark por padrão |
| `next-themes` ThemeProvider | Mantido (já compatível) ou simplificado para classe `dark` no `<html>` |
| `tailwindcss-animate` | Já temos `tw-animate-css` no template |
| Imports `@/...` | Mantidos (alias já configurado) |
| Hooks/components que importam `trpc` | Removidos do bundle |

## Estrutura final

```text
src/
  routes/
    __root.tsx           (providers + Toaster + dark theme)
    index.tsx            (Home)
    personalize.tsx
    404 já tratado pelo notFoundComponent
  components/            (CharacterImporter, ROICalculator, etc.)
  components/ui/         (shadcn — adiciono os que faltarem)
  features/pearl-shop/   (componentes + hooks adaptados)
  shared/providers/      (PearlShop, Notification, Cache)
  core/                  (types, constants, utils, design-system)
  mocks/pearl-shop.ts    (dados estáticos)
  styles.css             (tokens BDO)
```

## Passos de execução

1. Copiar `core/`, `features/pearl-shop/`, `shared/providers/`, `components/` (UI+feature), `contexts/ThemeContext.tsx` do zip para `src/`.
2. Instalar deps faltantes: `wouter` (não — substituído), `framer-motion`, `recharts`, `next-themes`, `nanoid`, `embla-carousel-react`, `react-day-picker`, `vaul`, `cmdk`, `input-otp`, `react-resizable-panels`, `@hookform/resolvers`, `streamdown`, `@tailwindcss/typography` (verifico o que já está e adiciono o resto).
3. Migrar tokens de tema do `index.css` antigo para `src/styles.css` (converter HSL → oklch onde necessário; manter visual dark da Pearl Shop).
4. Criar `src/mocks/pearl-shop.ts` e refatorar `PearlShopProvider` + serviços para consumirem o mock (sem `fetch`/`trpc`).
5. Substituir `wouter` por TanStack Router em todos os componentes (`useNavigate` em vez de `useLocation`, `<Link to=...>`).
6. Remover/stubar imports de `trpc` em `useHistoricalData`, `useScraping`, `useAutomation`, `useAuth` (ou apagar os arquivos não usados pela Home/Personalize).
7. Criar `src/routes/index.tsx` (Home) e `src/routes/personalize.tsx`; mover providers para `__root.tsx`.
8. Adicionar `head()` por rota com title/description/og em PT-BR.
9. Verificar build (lint/typecheck) e ajustar imports/tipos quebrados.

## Riscos / observações

- O projeto original tem ~5k linhas; vou priorizar Home + Personalize funcionais. Se algum componente arrastar dependência pesada de tRPC, ele é simplificado ou removido.
- `PDFExporter` pode depender de libs Node — se for o caso, adapto para lib browser ou removo.
- Tema dark agressivo (estilo BDO) será mantido como default; sem tela de login.
- Sem persistência: cada reload reinicia.

Confirma que posso prosseguir? Se quiser que eu **inclua o Admin** (com botões/UI fakes em vez de tRPC) ou **exclua a página Personalize**, me diz antes.
