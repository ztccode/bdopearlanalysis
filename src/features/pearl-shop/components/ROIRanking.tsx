/**
 * ROIRanking Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PearlShopPromotion } from '@/core/types';
import { ROI_COLORS } from '@/core/constants';
import { pearlShopService } from '../services/PearlShopService';

interface ROIRankingProps {
  promotion: PearlShopPromotion | null;
}

export function ROIRanking({ promotion }: ROIRankingProps) {
  if (!promotion || promotion.items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Nenhum item disponível</p>
        </CardContent>
      </Card>
    );
  }

  const sortedItems = pearlShopService.sortByROI(promotion.items, 'desc');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking de ROI</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>ROI</TableHead>
              <TableHead>Prioridade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">#{index + 1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  {item.price} {item.currency}
                </TableCell>
                <TableCell>
                  <Badge
                    style={{
                      backgroundColor: ROI_COLORS[item.roi as keyof typeof ROI_COLORS],
                    }}
                    className="text-white"
                  >
                    {item.roi}
                  </Badge>
                </TableCell>
                <TableCell>{item.priority}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
