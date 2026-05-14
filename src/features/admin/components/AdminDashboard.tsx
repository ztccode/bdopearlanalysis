/**
 * AdminDashboard Component
 * Painel administrativo com logs, scraping manual e comparações
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw, Download, TrendingUp, Activity } from 'lucide-react';
import { formatDate } from '@/core/utils';

interface ScrapingLog {
  id: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
  itemsScraped: number;
  duration: number;
  error?: string;
}

interface AdminDashboardProps {
  logs?: ScrapingLog[];
  lastScrapingTime?: Date;
  totalItemsScraped?: number;
  onManualScrape?: () => Promise<void>;
  onExportLogs?: () => void;
}

export function AdminDashboard({
  logs = [],
  lastScrapingTime,
  totalItemsScraped = 0,
  onManualScrape,
  onExportLogs,
}: AdminDashboardProps) {
  const [isScraing, setIsScraping] = useState(false);

  const handleManualScrape = async () => {
    if (!onManualScrape) return;
    
    try {
      setIsScraping(true);
      await onManualScrape();
    } finally {
      setIsScraping(false);
    }
  };

  const successCount = logs.filter(l => l.status === 'success').length;
  const errorCount = logs.filter(l => l.status === 'error').length;
  const successRate = logs.length > 0 ? ((successCount / logs.length) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {successCount} de {logs.length} scrapes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Itens Coletados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsScraped}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total histórico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Últimas 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(l => {
                const now = new Date();
                const logDate = new Date(l.timestamp);
                return now.getTime() - logDate.getTime() < 24 * 60 * 60 * 1000;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Scrapes executados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Último Scrape
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono">
              {lastScrapingTime ? formatDate(lastScrapingTime) : 'Nunca'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lastScrapingTime && (
                <>
                  há {Math.floor((new Date().getTime() - new Date(lastScrapingTime).getTime()) / 60000)} min
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Controles de Scraping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleManualScrape}
              disabled={isScraing}
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isScraing ? 'animate-spin' : ''}`} />
              {isScraing ? 'Scraping...' : 'Executar Scraping Manual'}
            </Button>
            <Button
              onClick={onExportLogs}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Scraping</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum log disponível
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          log.status === 'success'
                            ? 'success'
                            : log.status === 'error'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {log.status === 'success'
                          ? '✓ Sucesso'
                          : log.status === 'error'
                          ? '✗ Erro'
                          : '⏳ Pendente'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>
                        <strong>{log.itemsScraped}</strong> itens
                      </span>
                      <span>
                        <strong>{log.duration}ms</strong> duração
                      </span>
                    </div>
                    {log.error && (
                      <div className="flex gap-2 mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-800">{log.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparação de Snapshots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Comparação de Snapshots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Gráfico de comparação de preços ao longo do tempo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
