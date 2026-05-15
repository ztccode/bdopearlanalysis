import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MOCK_PEARL_SHOP_ITEMS } from "@/mocks/pearl-shop";

const InputSchema = z.object({
  budget: z.number().int().min(100).max(1_000_000),
  goal: z.enum([
    "Refinamento endgame",
    "XP / Leveling",
    "Loot / Farming",
    "Custo-benefício geral",
  ]),
  note: z.string().max(500).optional(),
});

export type AdvisorPick = {
  id: string;
  name: string;
  quantity: number;
  totalPrice: number;
  reason: string;
};

export type AdvisorResult =
  | {
      ok: true;
      summary: string;
      picks: AdvisorPick[];
      totalSpend: number;
      leftover: number;
    }
  | { ok: false; error: "rate_limited" | "payment_required" | "unknown"; message: string };

export const recommendPearlItems = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AdvisorResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "unknown", message: "LOVABLE_API_KEY ausente" };
    }

    const catalog = MOCK_PEARL_SHOP_ITEMS.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      discount: i.discount ?? 0,
      finalPrice: Math.round(i.price * (1 - (i.discount ?? 0) / 100)),
      category: i.category,
      roi: i.roi,
      description: i.description,
    }));

    const systemPrompt = `Você é um especialista em economia de Black Desert Online (BDO), focado em otimizar compras na Loja de Pérolas para players endgame.
Você DEVE escolher itens APENAS do catálogo fornecido (use os ids exatos).
Considere desconto, ROI declarado, e o objetivo do player.
Não exceda o orçamento. Quantidades inteiras > 0.
Responda SEMPRE chamando a tool recommend_items.
Escreva summary e reason em português, tom direto e técnico.`;

    const userPrompt = `Orçamento: ${data.budget} Pérolas
Objetivo: ${data.goal}
Observações: ${data.note ?? "(nenhuma)"}

Catálogo (JSON):
${JSON.stringify(catalog, null, 2)}`;

    const tool = {
      type: "function",
      function: {
        name: "recommend_items",
        description: "Retorna a recomendação de compra ótima",
        parameters: {
          type: "object",
          properties: {
            summary: { type: "string", description: "Racional em markdown (3-6 linhas)" },
            picks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  quantity: { type: "integer", minimum: 1 },
                  totalPrice: { type: "integer", minimum: 0 },
                  reason: { type: "string" },
                },
                required: ["id", "name", "quantity", "totalPrice", "reason"],
                additionalProperties: false,
              },
            },
            totalSpend: { type: "integer" },
            leftover: { type: "integer" },
          },
          required: ["summary", "picks", "totalSpend", "leftover"],
          additionalProperties: false,
        },
      },
    };

    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "recommend_items" } },
        }),
      });
    } catch (err) {
      console.error("AI gateway fetch failed:", err);
      return { ok: false, error: "unknown", message: "Falha de rede ao chamar IA" };
    }

    if (response.status === 429) {
      return { ok: false, error: "rate_limited", message: "Muitas requisições. Tente novamente em instantes." };
    }
    if (response.status === 402) {
      return { ok: false, error: "payment_required", message: "Créditos esgotados na workspace." };
    }
    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return { ok: false, error: "unknown", message: `Erro IA (${response.status})` };
    }

    const json = (await response.json()) as any;
    const call = json?.choices?.[0]?.message?.tool_calls?.[0];
    const argStr = call?.function?.arguments;
    if (!argStr) {
      return { ok: false, error: "unknown", message: "Resposta da IA sem tool call" };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(argStr);
    } catch {
      return { ok: false, error: "unknown", message: "JSON inválido da IA" };
    }

    const picks: AdvisorPick[] = Array.isArray(parsed.picks) ? parsed.picks : [];
    const totalSpend =
      typeof parsed.totalSpend === "number"
        ? parsed.totalSpend
        : picks.reduce((s, p) => s + (p.totalPrice ?? 0), 0);

    return {
      ok: true,
      summary: String(parsed.summary ?? ""),
      picks,
      totalSpend,
      leftover: data.budget - totalSpend,
    };
  });
