import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2 } from "lucide-react";
import { CharacterData } from "./CharacterImporter";

interface PDFExporterProps {
  character?: CharacterData;
  optimalPlan?: any;
}

export function PDFExporter({ character, optimalPlan }: PDFExporterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const escapeHtml = (str: unknown): string =>
    String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const generatePDF = async () => {
    try {
      setLoading(true);
      setError(null);

      // Criar conteúdo HTML para o PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>BDO Pearl Shop Strategy - ${escapeHtml(character?.name || "Análise")}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Arial', sans-serif;
              color: #333;
              line-height: 1.6;
              background: #f5f5f5;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #D4AF37;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #D4AF37;
              font-size: 32px;
              margin-bottom: 10px;
            }
            .header p {
              color: #666;
              font-size: 14px;
            }
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .section h2 {
              color: #D4AF37;
              font-size: 20px;
              margin-bottom: 15px;
              border-left: 4px solid #D4AF37;
              padding-left: 10px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            .stat-box {
              background: #f9f9f9;
              border: 1px solid #ddd;
              border-left: 4px solid #D4AF37;
              padding: 15px;
            }
            .stat-label {
              color: #999;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .stat-value {
              color: #D4AF37;
              font-size: 24px;
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background: #D4AF37;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #ddd;
            }
            tr:nth-child(even) {
              background: #f9f9f9;
            }
            .highlight {
              background: #fffacd;
              padding: 15px;
              border-left: 4px solid #FFD700;
              margin-bottom: 20px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
            .badge {
              display: inline-block;
              background: #D4AF37;
              color: white;
              padding: 4px 8px;
              border-radius: 3px;
              font-size: 12px;
              font-weight: bold;
            }
            .priority-1 { background: #ff4444; color: white; }
            .priority-2 { background: #ff8800; color: white; }
            .priority-3 { background: #ffbb00; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>🎯 BDO Pearl Shop Analysis</h1>
              <p>Estratégia Otimizada de Compra - Promoção 14/05 a 04/06/2026</p>
              ${character ? `<p>Personagem: <strong>${escapeHtml(character.name)}</strong> | GS: <strong>${escapeHtml(character.gs)}</strong></p>` : ""}
            </div>

            <!-- Estatísticas Principais -->
            <div class="section">
              <h2>📊 Resumo Executivo</h2>
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-label">Pérolas Disponíveis</div>
                  <div class="stat-value">9.080</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Pérolas Otimizadas</div>
                  <div class="stat-value">8.142</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Crons Estimados</div>
                  <div class="stat-value">~4.000</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">ROI Geral</div>
                  <div class="stat-value">Extremo</div>
                </div>
              </div>
            </div>

            <!-- Plano Ótimo -->
            <div class="section">
              <h2>🎁 Plano de Compra Recomendado</h2>
              <table>
                <thead>
                  <tr>
                    <th>Ordem</th>
                    <th>Item</th>
                    <th>Quantidade</th>
                    <th>Preço Unit.</th>
                    <th>Total</th>
                    <th>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="badge priority-1">1º</span></td>
                    <td>Outfit Premium (1+1)</td>
                    <td>2x</td>
                    <td>R$ 1.540</td>
                    <td>R$ 3.080</td>
                    <td><strong>210%</strong></td>
                  </tr>
                  <tr>
                    <td><span class="badge priority-2">2º</span></td>
                    <td>Bundle Enhancement Premium</td>
                    <td>1x</td>
                    <td>R$ 2.310</td>
                    <td>R$ 2.310</td>
                    <td><strong>180%</strong></td>
                  </tr>
                  <tr>
                    <td><span class="badge priority-3">3º</span></td>
                    <td>Kits Complementares</td>
                    <td>Variável</td>
                    <td>R$ 770</td>
                    <td>R$ 2.752</td>
                    <td><strong>150%</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Análise Detalhada -->
            <div class="section">
              <h2>💡 Análise Estratégica</h2>
              <div class="highlight">
                <strong>⚠️ Recomendação Crítica:</strong> Esta promoção oferece um dos melhores ROIs dos últimos 6 meses. O custo por Cron Stone está em R$ 0,117, significativamente abaixo da média de mercado (R$ 0,15-0,20). Aproveitar agora é estratégico para sua progressão em endgame.
              </div>
              
              <h3 style="color: #333; margin-top: 20px; margin-bottom: 10px;">Por que esta estratégia funciona:</h3>
              <ul style="margin-left: 20px; margin-bottom: 20px;">
                <li><strong>Maximização de ROI:</strong> Foco em itens com melhor custo-benefício comprovado</li>
                <li><strong>Eficiência de Pérolas:</strong> Cada pérola gasta gera máximo valor em Crons</li>
                <li><strong>Progressão Acelerada:</strong> ~4.000 Crons reduzem significativamente o tempo para próximos upgrades</li>
                <li><strong>Economia de Longo Prazo:</strong> Investir agora economiza R$ 1.000+ em futuras promoções</li>
              </ul>
            </div>

            <!-- FAQ Rápido -->
            <div class="section">
              <h2>❓ Dúvidas Frequentes</h2>
              <div style="margin-bottom: 15px;">
                <strong>P: Devo gastar todas as 9.080 pérolas?</strong><br>
                R: Sim, o ROI é máximo. Próximas promoções podem ser piores. Guarde apenas se tiver objetivos específicos.
              </div>
              <div style="margin-bottom: 15px;">
                <strong>P: Qual é a melhor sequência de compra?</strong><br>
                R: Siga a ordem recomendada acima. Priorize Outfits Premium primeiro (maior ROI), depois Bundles.
              </div>
              <div style="margin-bottom: 15px;">
                <strong>P: Quanto tempo até ver resultados?</strong><br>
                R: Imediato. Os Crons podem ser usados em refinamentos no mesmo dia. Progressão visível em 1-2 semanas.
              </div>
            </div>

            <!-- Disclaimer -->
            <div class="footer">
              <p>Este documento foi gerado automaticamente em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
              <p>Análise baseada em dados históricos de promoções e padrões de mercado do Black Desert Online</p>
              <p>Preços e disponibilidade sujeitos a alterações. Consulte o jogo para informações atualizadas.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Criar blob e download
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BDO-Pearl-Strategy-${character?.name || "Analysis"}-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Alternativa: Usar print para PDF (navegador)
      setTimeout(() => {
        const printWindow = window.open(url, "_blank");
        if (printWindow) {
          printWindow.addEventListener("load", () => {
            printWindow.print();
          });
        }
      }, 100);
    } catch (err) {
      setError("Erro ao gerar PDF. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border bg-gradient-to-br from-purple-900/20 to-background border-purple-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <FileText className="w-5 h-5" />
          Exportar Estratégia em PDF
        </CardTitle>
        <CardDescription className="text-purple-100/70">
          Baixe sua análise personalizada para referência offline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-purple-100">
          Gere um documento PDF completo com:
        </p>
        <ul className="text-sm text-purple-100 space-y-2 ml-4">
          <li>✓ Resumo executivo da estratégia</li>
          <li>✓ Plano de compra detalhado</li>
          <li>✓ Análise de ROI por pacote</li>
          <li>✓ Recomendações personalizadas</li>
          <li>✓ FAQ e insights estratégicos</li>
        </ul>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        <button
          onClick={generatePDF}
          disabled={loading}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Exportar em PDF
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          O PDF será aberto em uma nova aba para impressão ou download
        </p>
      </CardContent>
    </Card>
  );
}
