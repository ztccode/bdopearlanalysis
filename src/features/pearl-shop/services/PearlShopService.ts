/**
 * PearlShopService
 * Lógica de negócio centralizada para Loja de Pérolas
 * Implementa padrão Service com Repository Pattern
 */

import type {
  PearlShopItem,
  PearlShopPromotion,
  PearlShopSnapshot,
  HistoricalComparison,
  SnapshotChange,
  ComparisonAnalysis,
  ApiResponse,
} from '@/core/types';
import { calculateROI, removeDuplicates, sortBy, delay } from '@/core/utils';
import { SCRAPING_CONFIG } from '@/core/constants';
import { MOCK_PROMOTION } from '@/mocks/pearl-shop';

export class PearlShopService {
  private static instance: PearlShopService;

  private constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): PearlShopService {
    if (!PearlShopService.instance) {
      PearlShopService.instance = new PearlShopService();
    }
    return PearlShopService.instance;
  }

  /**
   * Obtém promoção mais recente
   */
  async getLatestPromotion(): Promise<ApiResponse<PearlShopPromotion>> {
    try {
      await delay(200);
      return {
        success: true,
        data: MOCK_PROMOTION,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Falha ao obter promoção mais recente',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Obtém histórico de promoções
   */
  async getPromotionHistory(limit = 10): Promise<ApiResponse<PearlShopSnapshot[]>> {
    try {
      // TODO: Integrar com API real
      await delay(500);
      return {
        success: true,
        data: [],
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Falha ao obter histórico de promoções',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Compara duas promoções
   */
  async comparePromotions(
    currentSnapshot: PearlShopSnapshot,
    previousSnapshot: PearlShopSnapshot
  ): Promise<HistoricalComparison> {
    const changes = this.detectChanges(currentSnapshot, previousSnapshot);
    const analysis = this.analyzeChanges(changes, currentSnapshot, previousSnapshot);

    return {
      currentSnapshot,
      previousSnapshot,
      changes,
      analysis,
    };
  }

  /**
   * Detecta mudanças entre dois snapshots
   */
  private detectChanges(
    current: PearlShopSnapshot,
    previous: PearlShopSnapshot
  ): SnapshotChange[] {
    const changes: SnapshotChange[] = [];
    const currentIds = new Set(current.items.map((item) => item.id));
    const previousIds = new Set(previous.items.map((item) => item.id));

    // Itens adicionados
    for (const item of current.items) {
      if (!previousIds.has(item.id)) {
        changes.push({
          itemId: item.id,
          changeType: 'added',
          newValue: item,
          detectedAt: new Date(),
        });
      } else {
        // Verificar mudanças de preço/desconto
        const previousItem = previous.items.find((i) => i.id === item.id);
        if (previousItem) {
          if (previousItem.price !== item.price) {
            changes.push({
              itemId: item.id,
              changeType: 'price_changed',
              oldValue: previousItem.price,
              newValue: item.price,
              detectedAt: new Date(),
            });
          }
          if (previousItem.discount !== item.discount) {
            changes.push({
              itemId: item.id,
              changeType: 'discount_changed',
              oldValue: previousItem.discount,
              newValue: item.discount,
              detectedAt: new Date(),
            });
          }
        }
      }
    }

    // Itens removidos
    for (const item of previous.items) {
      if (!currentIds.has(item.id)) {
        changes.push({
          itemId: item.id,
          changeType: 'removed',
          oldValue: item,
          detectedAt: new Date(),
        });
      }
    }

    return changes;
  }

  /**
   * Analisa mudanças detectadas
   */
  private analyzeChanges(
    changes: SnapshotChange[],
    current: PearlShopSnapshot,
    previous: PearlShopSnapshot
  ): ComparisonAnalysis {
    const itemsAdded = changes.filter((c) => c.changeType === 'added').length;
    const itemsRemoved = changes.filter((c) => c.changeType === 'removed').length;
    const priceChanges = changes.filter((c) => c.changeType === 'price_changed').length;

    // Calcular mudança média de preço
    let totalPriceChange = 0;
    let priceChangeCount = 0;

    for (const change of changes.filter((c) => c.changeType === 'price_changed')) {
      const oldPrice = change.oldValue as number;
      const newPrice = change.newValue as number;
      totalPriceChange += newPrice - oldPrice;
      priceChangeCount++;
    }

    const averagePriceChange = priceChangeCount > 0 ? totalPriceChange / priceChangeCount : 0;

    // Determinar tendência de ROI
    let roiTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (averagePriceChange < -100) {
      roiTrend = 'improving';
    } else if (averagePriceChange > 100) {
      roiTrend = 'declining';
    }

    return {
      itemsAdded,
      itemsRemoved,
      priceChanges,
      averagePriceChange,
      roiTrend,
      predictedNextPromotion: this.predictNextPromotion(current, previous),
    };
  }

  /**
   * Prediz próxima promoção baseado em histórico
   */
  private predictNextPromotion(
    current: PearlShopSnapshot,
    previous: PearlShopSnapshot
  ): Date | undefined {
    // TODO: Implementar lógica de predição
    // Por enquanto, retorna 14 dias a partir de agora
    return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  }

  /**
   * Filtra itens por categoria
   */
  filterByCategory(items: PearlShopItem[], category: string): PearlShopItem[] {
    return items.filter((item) => item.category === category);
  }

  /**
   * Filtra itens por ROI
   */
  filterByROI(items: PearlShopItem[], roi: string): PearlShopItem[] {
    return items.filter((item) => item.roi === roi);
  }

  /**
   * Ordena itens por ROI
   */
  sortByROI(items: PearlShopItem[], order: 'asc' | 'desc' = 'desc'): PearlShopItem[] {
    const roiOrder = {
      Absurdo: 5,
      Extremo: 4,
      Alto: 3,
      Médio: 2,
      Baixo: 1,
    };

    return sortBy(
      items,
      (item) => roiOrder[item.roi as keyof typeof roiOrder],
      order
    );
  }

  /**
   * Ordena itens por preço
   */
  sortByPrice(items: PearlShopItem[], order: 'asc' | 'desc' = 'asc'): PearlShopItem[] {
    return sortBy(items, (item) => item.price, order);
  }

  /**
   * Ordena itens por prioridade
   */
  sortByPriority(items: PearlShopItem[], order: 'asc' | 'desc' = 'asc'): PearlShopItem[] {
    return sortBy(items, (item) => item.priority, order);
  }

  /**
   * Remove itens duplicados
   */
  deduplicateItems(items: PearlShopItem[]): PearlShopItem[] {
    return removeDuplicates(items, (item) => item.id);
  }

  /**
   * Calcula valor total de itens
   */
  calculateTotalValue(items: PearlShopItem[]): number {
    return items.reduce((total, item) => {
      const finalPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      return total + finalPrice;
    }, 0);
  }

  /**
   * Obtém estatísticas dos itens
   */
  getItemsStatistics(items: PearlShopItem[]) {
    return {
      total: items.length,
      byCategory: items.reduce(
        (acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      byROI: items.reduce(
        (acc, item) => {
          acc[item.roi] = (acc[item.roi] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      averagePrice: items.length > 0 ? this.calculateTotalValue(items) / items.length : 0,
      totalValue: this.calculateTotalValue(items),
      itemsWithDiscount: items.filter((item) => item.discount && item.discount > 0).length,
      averageDiscount:
        items.filter((item) => item.discount).length > 0
          ? items
              .filter((item) => item.discount)
              .reduce((sum, item) => sum + (item.discount || 0), 0) /
            items.filter((item) => item.discount).length
          : 0,
    };
  }

  /**
   * Valida dados de promoção
   */
  validatePromotion(promotion: Partial<PearlShopPromotion>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!promotion.title || promotion.title.trim().length === 0) {
      errors.push('Título da promoção é obrigatório');
    }

    if (!promotion.startDate) {
      errors.push('Data de início é obrigatória');
    }

    if (!promotion.endDate) {
      errors.push('Data de término é obrigatória');
    }

    if (promotion.startDate && promotion.endDate && promotion.startDate > promotion.endDate) {
      errors.push('Data de início não pode ser maior que data de término');
    }

    if (!promotion.items || promotion.items.length === 0) {
      errors.push('Promoção deve ter pelo menos um item');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const pearlShopService = PearlShopService.getInstance();
