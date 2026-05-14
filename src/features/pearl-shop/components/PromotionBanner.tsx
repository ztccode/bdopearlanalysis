/**
 * PromotionBanner Component
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PearlShopPromotion } from '@/core/types';
import { formatDate } from '@/core/utils';

interface PromotionBannerProps {
  promotion: PearlShopPromotion | null;
}

export function PromotionBanner({ promotion }: PromotionBannerProps) {
  if (!promotion) return null;

  const endTime = promotion.endDate instanceof Date ? promotion.endDate.getTime() : new Date(promotion.endDate).getTime();
  const daysLeft = Math.ceil(
    (endTime - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="mb-8 border-accent/50 bg-gradient-to-r from-accent/10 to-accent/5">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-accent mb-2">{promotion.title}</h2>
            <p className="text-muted-foreground mb-2">{promotion.description}</p>
            <div className="flex gap-4 text-sm">
              <span>
                Início: <strong>{formatDate(promotion.startDate)}</strong>
              </span>
              <span>
                Término: <strong>{formatDate(promotion.endDate)}</strong>
              </span>
            </div>
          </div>

          <div className="text-right">
            <Badge
              variant={daysLeft > 7 ? 'default' : 'destructive'}
              className="text-lg px-4 py-2"
            >
              {daysLeft} dias restantes
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
