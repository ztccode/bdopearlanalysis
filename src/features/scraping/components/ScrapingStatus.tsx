/**
 * ScrapingStatus Component
 * Monitora status do scraping
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { formatDate } from '@/core/utils';

interface ScrapingStatusProps {
  lastScraped?: Date;
  nextScheduled?: Date;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function ScrapingStatus({
  lastScraped,
  nextScheduled,
  isLoading = false,
  onRefresh,
}: ScrapingStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Status do Scraping</span>
          <Badge variant={lastScraped ? 'success' : 'warning'}>
            {lastScraped ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Last Scraped */}
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Último Scraping</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {lastScraped ? formatDate(lastScraped) : 'Nunca'}
          </span>
        </div>

        {/* Next Scheduled */}
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Próximo Scraping</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {nextScheduled ? formatDate(nextScheduled) : 'Não agendado'}
          </span>
        </div>

        {/* Info */}
        <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            O scraping automático é executado diariamente. Você pode forçar uma atualização manual.
          </p>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <Button
            onClick={onRefresh}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Atualizando...' : 'Atualizar Agora'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
