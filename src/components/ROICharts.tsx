import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp } from "lucide-react";

interface ROIData {
  name: string;
  roi: number;
  cronsPerPearl: number;
  efficiency: number;
}

interface ROIChartsProps {
  data?: ROIData[];
}

export function ROICharts({ data }: ROIChartsProps) {
  // Dados padrão se não fornecidos
  const defaultData: ROIData[] = [
    { name: "Baú Especial III", roi: 250, cronsPerPearl: 0.85, efficiency: 95 },
    { name: "Outfit Premium", roi: 210, cronsPerPearl: 0.78, efficiency: 88 },
    { name: "Bundle Enhancement", roi: 180, cronsPerPearl: 0.72, efficiency: 82 },
    { name: "Spend Reward", roi: 150, cronsPerPearl: 0.65, efficiency: 75 },
    { name: "Ferreiro Premium", roi: 120, cronsPerPearl: 0.58, efficiency: 68 }
  ];

  const chartData = data || defaultData;

  // Dados para gráfico de pizza (distribuição de ROI)
  const pieData = chartData.map((item, idx) => ({
    name: item.name,
    value: item.roi,
    color: ["#D4AF37", "#FFD700", "#FFA500", "#FF8C00", "#FF6347"][idx]
  }));

  // Dados para gráfico de comparação de eficiência
  const efficiencyData = chartData.map(item => ({
    name: item.name.split(" ")[0],
    "ROI (%)": item.roi,
    "Eficiência": item.efficiency,
    "Crons/Pérola": item.cronsPerPearl * 100
  }));

  return (
    <div className="space-y-6">
      {/* Gráfico de Barras - ROI Comparativo */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Comparação de ROI por Pacote
          </CardTitle>
          <CardDescription>
            Visualização do retorno sobre investimento (ROI) para cada pacote disponível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                label={{ value: "ROI (%)", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #D4AF37" }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="roi" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Linha - Eficiência Acumulada */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Eficiência de Pérolas por Pacote</CardTitle>
          <CardDescription>
            Análise de quantos Crons você obtém por pérola gasta em cada pacote
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: "ROI (%)", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: "Eficiência", angle: 90, position: "insideRight" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #D4AF37" }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="ROI (%)" 
                stroke="#D4AF37" 
                strokeWidth={2}
                dot={{ fill: "#D4AF37", r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="Eficiência" 
                stroke="#FFD700" 
                strokeWidth={2}
                dot={{ fill: "#FFD700", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Distribuição de ROI */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Distribuição de ROI Total</CardTitle>
          <CardDescription>
            Proporção do ROI gerado por cada pacote no plano otimizado
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #D4AF37" }}
                formatter={(value) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Comparação Detalhada */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Análise Detalhada de ROI</CardTitle>
          <CardDescription>
            Métricas completas para cada pacote
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-accent font-semibold">Pacote</th>
                  <th className="text-center py-3 px-4 text-accent font-semibold">ROI (%)</th>
                  <th className="text-center py-3 px-4 text-accent font-semibold">Crons/Pérola</th>
                  <th className="text-center py-3 px-4 text-accent font-semibold">Eficiência (%)</th>
                  <th className="text-center py-3 px-4 text-accent font-semibold">Ranking</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, idx) => (
                  <tr key={`roi-table-${item.name}-${idx}`} className="border-b border-border hover:bg-card/50 transition-colors">
                    <td className="py-3 px-4 text-foreground">{item.name}</td>
                    <td className="text-center py-3 px-4">
                      <span className="bg-green-900/30 text-green-100 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.roi}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-muted-foreground">
                      {item.cronsPerPearl.toFixed(2)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-card border border-border rounded-full h-2">
                          <div 
                            className="bg-accent h-full rounded-full" 
                            style={{ width: `${item.efficiency}%` }}
                          />
                        </div>
                        <span className="ml-2 text-xs text-muted-foreground">{item.efficiency}%</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-accent font-bold">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights Estratégicos */}
      <Card className="border-border bg-blue-900/20 border-blue-900/50">
        <CardHeader>
          <CardTitle className="text-blue-100">💡 Insights dos Gráficos</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-100 space-y-3 text-sm">
          <p>
            <strong>Maior ROI:</strong> {chartData[0].name} oferece {chartData[0].roi}% de retorno, sendo a melhor opção para maximizar valor.
          </p>
          <p>
            <strong>Melhor Eficiência:</strong> Você obtém em média {(chartData.reduce((a, b) => a + b.cronsPerPearl, 0) / chartData.length).toFixed(2)} Crons por Pérola gasta.
          </p>
          <p>
            <strong>Recomendação:</strong> Priorize os 3 primeiros pacotes que concentram {(chartData.slice(0, 3).reduce((a, b) => a + b.roi, 0))}% do ROI total.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
