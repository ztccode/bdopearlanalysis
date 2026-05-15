import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { recommendPearlItems, type AdvisorResult } from "@/lib/ai-advisor.functions";
import { useNotificationContext } from "@/shared/providers/NotificationProvider";

const GOALS = [
  "Refinamento endgame",
  "XP / Leveling",
  "Loot / Farming",
  "Custo-benefício geral",
] as const;

export function AIAdvisor() {
  const [budget, setBudget] = useState(10000);
  const [goal, setGoal] = useState<(typeof GOALS)[number]>("Refinamento endgame");
  const [note, setNote] = useState("");
  const fn = useServerFn(recommendPearlItems);
  const { addNotification } = useNotificationContext();

  const mutation = useMutation({
    mutationFn: (vars: { budget: number; goal: string; note?: string }) =>
      fn({ data: vars }) as Promise<AdvisorResult>,
    onSuccess: (res) => {
      if (!res.ok) {
        addNotification({
          type: "error",
          title:
            res.error === "rate_limited"
              ? "Limite atingido"
              : res.error === "payment_required"
              ? "Sem créditos"
              : "Erro na IA",
          message: res.message,
          duration: 6000,
        });
      }
    },
  });

  const result = mutation.data;
  const pct = result?.ok ? Math.min(100, Math.round((result.totalSpend / budget) * 100)) : 0;

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 via-transparent to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          IA Advisor — Plano de Compra Inteligente
        </CardTitle>
        <CardDescription>
          A IA escolhe os melhores itens da promoção atual para o seu orçamento e objetivo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ai-budget">Orçamento (Pérolas)</Label>
            <Input
              id="ai-budget"
              type="number"
              min={100}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Math.max(100, Number(e.target.value) || 0))}
            />
          </div>
          <div className="space-y-2">
            <Label>Objetivo</Label>
            <Select value={goal} onValueChange={(v) => setGoal(v as (typeof GOALS)[number])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOALS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:row-span-2">
            <Label htmlFor="ai-note">Observações (opcional)</Label>
            <Textarea
              id="ai-note"
              placeholder="Ex: GS 760, foco PEN boss, já tenho Value Pack ativo…"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              rows={4}
            />
          </div>
        </div>

        <Button
          onClick={() => mutation.mutate({ budget, goal, note: note || undefined })}
          disabled={mutation.isPending}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analisando catálogo…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar recomendação
            </>
          )}
        </Button>

        {mutation.isError && (
          <div className="flex gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p>Falha ao chamar a IA. Tente novamente.</p>
          </div>
        )}

        {result?.ok && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Gasto: {result.totalSpend.toLocaleString()} Pérolas</span>
                <span>Sobra: {result.leftover.toLocaleString()} Pérolas</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/40 border border-border/50">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{result.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.picks.map((p, idx) => (
                <Card key={`${p.id}-${idx}`} className="border-border/60">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {p.quantity}</p>
                      </div>
                      <span className="text-sm font-mono text-accent whitespace-nowrap">
                        {p.totalPrice.toLocaleString()} P
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
