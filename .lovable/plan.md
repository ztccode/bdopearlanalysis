# AI Pearl Shop Advisor

Add an AI-powered recommendation panel on the Home page that takes the user's budget (in Pérolas) and optional goals, then asks Lovable AI to pick the best items from the mock catalog and explain why.

## UX

- New section on `/` (above the existing "Plano Ótimo" tab, or as a new tab "AI Advisor")
- Inputs:
  - Budget (number, Pérolas) — default 10000
  - Goal (select): "Refinamento endgame" | "XP / Leveling" | "Loot / Farming" | "Custo-benefício geral"
  - Optional free-text note (e.g. "GS 760, foco em PEN boss")
- Button: "Gerar recomendação"
- Output card:
  - Streamed AI text (Markdown) with reasoning
  - Structured list of recommended items (name, qty, total cost, why) rendered as cards using existing tokens
  - Total spend vs budget bar

## Technical

**Server function** `src/lib/ai-advisor.functions.ts`
- `recommendPearlItems({ budget, goal, note })` via `createServerFn`
- Reads `process.env.LOVABLE_API_KEY` inside `.handler()`
- Calls `https://ai.gateway.lovable.dev/v1/chat/completions`
- Model: `google/gemini-3-flash-preview`
- Passes `MOCK_PEARL_SHOP_ITEMS` (imported from `src/mocks/pearl-shop.ts`) into the system prompt as JSON so the model only picks from real items
- Uses **tool calling** for structured output:
  ```
  recommend_items({
    summary: string,           // markdown rationale
    picks: [{ id, name, quantity, totalPrice, reason }],
    totalSpend: number,
    leftover: number
  })
  ```
- Handles 429 / 402 → returns `{ error: 'rate_limited' | 'payment_required' }`
- Non-streaming (simpler; structured tool call). Streaming can come later if desired.

**Client component** `src/features/pearl-shop/components/AIAdvisor.tsx`
- Form (budget, goal, note) using existing `Input`, `Select`, `Button`, `Card`
- `useMutation` calling the server fn via `useServerFn`
- Renders summary with simple Markdown (or plain whitespace-pre-wrap for v1)
- Renders picks as a list with quantity, total, reason
- Toast notifications on rate limit / payment errors via `useNotificationContext`

**Wiring**
- Add `<AIAdvisor />` section on `src/routes/index.tsx` between the "ROI em Tempo Real" cards and the Tabs, OR as a new `<TabsTrigger value="ai">` tab — I'll go with a new tab "🤖 IA Advisor" to keep the page tidy.
- Verify `attachSupabaseAuth` middleware is registered in `src/start.ts` (no auth needed here, but check).
- The serverFn is **public** (no `requireSupabaseAuth`) — anyone can call it. Acceptable since it only reads mock data.

## Files

- create `src/lib/ai-advisor.functions.ts`
- create `src/features/pearl-shop/components/AIAdvisor.tsx`
- edit `src/routes/index.tsx` — add new tab + render component

## Out of scope

- Persisting recommendations
- Streaming UI (can add later)
- Auth / rate limiting per user
- Editing the existing rule-based `OptimalPlanSection` (kept side by side as deterministic baseline)
