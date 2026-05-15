/**
 * PearlShopHeader Component
 */

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PearlShopHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function PearlShopHeader({ onRefresh, isLoading }: PearlShopHeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-accent">BDO Pearl Shop Analysis — ROI e Estratégia Endgame</h1>
          <p className="text-sm text-muted-foreground">GS 775+ Endgame Strategy</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>
    </header>
  );
}
