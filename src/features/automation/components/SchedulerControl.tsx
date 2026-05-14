/**
 * SchedulerControl Component
 * Controla o scheduler de automação
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Play, Pause, RefreshCw, Clock } from 'lucide-react';
import { formatDate } from '@/core/utils';

interface SchedulerControlProps {
  enabled?: boolean;
  isRunning?: boolean;
  lastRun?: Date;
  cronExpression?: string;
  lastError?: string | null;
  onStart?: () => void;
  onStop?: () => void;
  onRunManually?: () => void;
}

export function SchedulerControl({
  enabled = false,
  isRunning = false,
  lastRun,
  cronExpression = '0 0 * * *',
  lastError,
  onStart,
  onStop,
  onRunManually,
}: SchedulerControlProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Automação de Scraping</span>
          <Badge variant={enabled ? 'success' : 'secondary'}>
            {enabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-neutral-50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Cron Expression</p>
            <p className="text-sm font-mono">{cronExpression}</p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Último Scraping</p>
            <p className="text-sm">{lastRun ? formatDate(lastRun) : 'Nunca'}</p>
          </div>
        </div>

        {/* Error Alert */}
        {lastError && (
          <div className="flex gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{lastError}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {enabled ? (
            <Button
              onClick={onStop}
              variant="outline"
              className="flex-1"
            >
              <Pause className="w-4 h-4 mr-2" />
              Parar
            </Button>
          ) : (
            <Button
              onClick={onStart}
              variant="outline"
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar
            </Button>
          )}

          <Button
            onClick={onRunManually}
            variant="default"
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Executar Agora
          </Button>
        </div>

        {/* Info */}
        <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            O scraping automático é executado diariamente à meia-noite. Você pode forçar uma execução manual.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
