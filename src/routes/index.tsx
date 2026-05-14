import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, Sparkles, Crown } from "lucide-react";
import { usePearlShop } from "@/shared/providers";
import { useNotificationContext } from "@/shared/providers/NotificationProvider";
import { PearlShopHeader } from "@/features/pearl-shop/components/PearlShopHeader";
import { PromotionBanner } from "@/features/pearl-shop/components/PromotionBanner";
import { ROIRanking } from "@/features/pearl-shop/components/ROIRanking";
import { OptimalPlanSection } from "@/features/pearl-shop/components/OptimalPlanSection";
import { ROICalculatorSection } from "@/features/pearl-shop/components/ROICalculatorSection";
import { FAQAccordion } from "@/features/pearl-shop/components/FAQAccordion";
import { PearlShopNews } from "@/features/pearl-shop/components/PearlShopNews";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BDO Pearl Shop Analysis — Início" },
      { name: "description", content: "Ranking de ROI, plano ótimo e calculadora para a Loja de Pérolas do BDO." },
      { property: "og:title", content: "BDO Pearl Shop Analysis" },
      { property: "og:description", content: "Estratégia endgame para a Loja de Pérolas do Black Desert Online." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { promotion, loading, error, refresh } = usePearlShop();
  const { addNotification } = useNotificationContext();

  useEffect(() => {
    if (error) {
      addNotification({
        type: "error",
        title: "Erro ao carregar dados",
        message: error.message,
        duration: 5000,
      });
    }
  }, [error, addNotification]);

  const handlePersonalize = () => navigate({ to: "/personalize" });

  const handleRefresh = async () => {
    try {
      await refresh();
      addNotification({
        type: "success",
        title: "Dados atualizados",
        message: "Informações da Loja de Pérolas foram atualizadas",
        duration: 3000,
      });
    } catch {
      addNotification({
        type: "error",
        title: "Erro ao atualizar",
        message: "Falha ao atualizar dados",
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PearlShopHeader onRefresh={handleRefresh} isLoading={loading.isLoading} />

      <main className="container mx-auto px-4 py-8">
        {promotion && <PromotionBanner promotion={promotion} />}

        <section className="mb-12">
          <PearlShopNews />
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-accent" />
                  Análise Personalizada
                </CardTitle>
                <CardDescription>
                  Importe seu personagem do Garmoth para recomendações customizadas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handlePersonalize} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Personalizar Análise
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  ROI em Tempo Real
                </CardTitle>
                <CardDescription>
                  Calcule o melhor custo-benefício para sua estratégia.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Ver Calculadora</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <Tabs defaultValue="ranking" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ranking">Ranking ROI</TabsTrigger>
            <TabsTrigger value="optimal">Plano Ótimo</TabsTrigger>
            <TabsTrigger value="details">Análise Detalhada</TabsTrigger>
          </TabsList>

          <TabsContent value="ranking" className="space-y-4">
            {loading.isLoading ? (
              <Card><CardContent className="pt-6 text-center text-muted-foreground">Carregando ranking…</CardContent></Card>
            ) : (
              <ROIRanking promotion={promotion} />
            )}
          </TabsContent>

          <TabsContent value="optimal" className="space-y-4">
            {loading.isLoading ? (
              <Card><CardContent className="pt-6 text-center text-muted-foreground">Calculando plano ótimo…</CardContent></Card>
            ) : (
              <OptimalPlanSection promotion={promotion} />
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise Estratégica</CardTitle>
                <CardDescription>Insights e recomendações baseadas em seu perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-200">
                    <p className="font-semibold mb-1">Recomendação Estratégica</p>
                    <p>
                      Para players GS 775+, priorize Cron Stones e Conselho de Valks. O ROI em refinamento é
                      significativamente superior a outros itens.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="mb-12">
          <ROICalculatorSection />
        </section>

        <section className="mb-12">
          <FAQAccordion />
        </section>

        <section className="py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Pronto para otimizar sua estratégia?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Importe seu personagem agora e receba recomendações personalizadas baseadas em seu nível de progressão.
          </p>
          <Button size="lg" onClick={handlePersonalize} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Começar análise personalizada
          </Button>
        </section>
      </main>
    </div>
  );
}
