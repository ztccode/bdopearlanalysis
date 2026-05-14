/**
 * PriceHistoryChart Component
 * Visualiza histórico de preços com gráfico
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PromotionItemSnapshot } from '@shared/types';
import { formatDate, formatCurrency } from '@/core/utils';

interface PriceHistoryChartProps {
  itemName: string;
  data: PromotionItemSnapshot[] | undefined;
  isLoading?: boolean;
}

export function PriceHistoryChart({ itemName, data, isLoading }: PriceHistoryChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Carregando histórico...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Sem dados históricos disponíveis</div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    date: formatDate(new Date(item.createdAt)),
    price: Number(item.price),
    roi: item.roi,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Preços - {itemName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#f59e0b"
              dot={false}
              name="Preço"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
