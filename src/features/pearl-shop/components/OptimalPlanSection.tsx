/**
 * OptimalPlanSection Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PearlShopPromotion } from '@/core/types';
import { analysisService } from '../services/AnalysisService';
import { formatCurrency, formatNumber } from '@/core/utils';

interface OptimalPlanSectionProps {
  promotion: PearlShopPromotion | null;
}

export function OptimalPlanSection({ promotion }: OptimalPlanSectionProps) {
  if (!promotion || promotion.items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Nenhum item disponível</p>
        </CardContent>
      </Card>
    );
  }

  // Gerar plano otimizado (9080 pérolas padrão)
  const plan = analysisService.generateOptimalPlan(promotion.items, 9080);
  const roi = analysisService.calculatePlanROI(plan);
  const savings = analysisService.calculateSavings(plan);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total de Pérolas</p>
            <p className="text-2xl font-bold text-accent">{formatNumber(roi.totalPearls)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Crons Estimados</p>
            <p className="text-2xl font-bold text-primary">{formatNumber(roi.totalCrons)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Custo por Cron</p>
            <p className="text-2xl font-bold">R$ {roi.costPerCron.toFixed(3)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Eficiência</p>
            <Badge className="text-lg mt-2">{roi.efficiency}</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Plan Table */}
      <Card>
        <CardHeader>
          <CardTitle>Plano Ótimo de Compra</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Preço Unit.</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Cupom</TableHead>
                <TableHead>Final</TableHead>
                <TableHead>ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.map((item) => (
                <TableRow key={`${item.order}-${item.item}`}>
                  <TableCell className="font-bold">{item.order}</TableCell>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.pricePerUnit)}</TableCell>
                  <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                  <TableCell>{item.coupon}</TableCell>
                  <TableCell className="font-bold text-accent">
                    {formatCurrency(item.finalPrice)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.roi}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Savings */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Economia Total:</strong> {formatCurrency(savings)} (
              {analysisService.calculateSavingsPercent(plan).toFixed(1)}% de desconto)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="pt-6">
          <p className="text-sm font-semibold text-accent mb-2">Recomendação:</p>
          <p className="text-sm text-foreground">{roi.recommendation}</p>
        </CardContent>
      </Card>
    </div>
  );
}
