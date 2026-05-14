import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";

interface ROIResult {
  totalPearls: number;
  totalCrons: number;
  costPerCron: number;
  efficiency: string;
  recommendation: string;
}

export function ROICalculator() {
  const [outfits, setOutfits] = useState(2);
  const [bundles, setBundles] = useState(1);
  const [kits, setKits] = useState(2);
  const [bauxUltimate, setBauxUltimate] = useState(2);

  const calculateROI = (): ROIResult => {
    const outfitCost = outfits * 2200 * 0.7; // 30% discount on first 2
    const bundleCost = bundles * 3564 * 0.8; // 20% discount
    const kitsCost = kits * (579 + 462); // Journey + Adventure kits
    const bauxCost = bauxUltimate * 585;

    const totalPearls = outfitCost + bundleCost + kitsCost + bauxCost;
    const totalCrons = (outfits * 993) + (bundles * 500) + (kits * 200) + (bauxUltimate * 100);
    const costPerCron = totalPearls / totalCrons;

    let efficiency = "Excelente";
    let recommendation = "Estratégia otimizada para máximo ROI";

    if (costPerCron > 0.15) {
      efficiency = "Bom";
      recommendation = "Considere aumentar outfits premium";
    } else if (costPerCron < 0.10) {
      efficiency = "Extremo";
      recommendation = "ROI excepcional - estratégia perfeita";
    }

    return {
      totalPearls: Math.round(totalPearls),
      totalCrons,
      costPerCron: parseFloat(costPerCron.toFixed(4)),
      efficiency,
      recommendation
    };
  };

  const roi = calculateROI();
  const budget = 9080;
  const remaining = budget - roi.totalPearls;

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case "Extremo":
        return "bg-purple-900 text-purple-100";
      case "Excelente":
        return "bg-green-900 text-green-100";
      case "Bom":
        return "bg-blue-900 text-blue-100";
      default:
        return "bg-yellow-900 text-yellow-100";
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent" />
          Calculadora de ROI Interativa
        </CardTitle>
        <CardDescription>
          Ajuste as quantidades e veja o ROI em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Outfits Premium
              </label>
              <span className="text-accent font-semibold">{outfits}x</span>
            </div>
            <Slider
              value={[outfits]}
              onValueChange={(value) => setOutfits(value[0])}
              min={0}
              max={5}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ~{outfits * 993} crons | R$ {(outfits * 2200 * 0.7).toLocaleString('pt-BR')}
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Bundles Enhancement
              </label>
              <span className="text-accent font-semibold">{bundles}x</span>
            </div>
            <Slider
              value={[bundles]}
              onValueChange={(value) => setBundles(value[0])}
              min={0}
              max={3}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ~{bundles * 500} crons | R$ {(bundles * 3564 * 0.8).toLocaleString('pt-BR')}
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Kits (Jornada + Aventura)
              </label>
              <span className="text-accent font-semibold">{kits}x</span>
            </div>
            <Slider
              value={[kits]}
              onValueChange={(value) => setKits(value[0])}
              min={0}
              max={4}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ~{kits * 200} crons | R$ {(kits * (579 + 462)).toLocaleString('pt-BR')}
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Baús Ultimate
              </label>
              <span className="text-accent font-semibold">{bauxUltimate}x</span>
            </div>
            <Slider
              value={[bauxUltimate]}
              onValueChange={(value) => setBauxUltimate(value[0])}
              min={0}
              max={5}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ~{bauxUltimate * 100} crons | R$ {(bauxUltimate * 585).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Gasto</div>
            <div className="text-2xl font-bold text-accent">
              {roi.totalPearls.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              de {budget.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Restante</div>
            <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {remaining >= 0 ? '+' : ''}{remaining.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">pérolas</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Crons</div>
            <div className="text-2xl font-bold text-accent">
              ~{roi.totalCrons.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">estimados</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Custo/Cron</div>
            <div className="text-2xl font-bold text-accent">
              R$ {roi.costPerCron.toFixed(3)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">por cron</div>
          </div>
        </div>

        {/* Efficiency Badge and Recommendation */}
        <div className="bg-background border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Eficiência:</span>
            <Badge className={getEfficiencyColor(roi.efficiency)}>
              {roi.efficiency}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {roi.recommendation}
          </p>
          {roi.costPerCron < 0.117 && (
            <p className="text-xs text-green-400 font-semibold">
              ✓ Abaixo do padrão BDO (R$ 0,117 por cron) - Excelente ROI!
            </p>
          )}
          {roi.costPerCron > 0.117 && roi.costPerCron < 0.15 && (
            <p className="text-xs text-yellow-400">
              ⚠ Acima do padrão BDO - Considere aumentar outfits
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
