/**
 * AnalysisService
 * Lógica de negócio centralizada para Análises de ROI
 */

import type { Character, PearlShopItem, OptimalPurchasePlan, ROICalculation, ApiResponse } from '@/core/types';
import { calculateROI, applyDiscount, delay } from '@/core/utils';

export class AnalysisService {
  private static instance: AnalysisService;

  private constructor() {}

  public static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  /**
   * Cria análise otimizada de compra
   */
  async createOptimalPlan(
    character: Character,
    items: PearlShopItem[],
    budget: number
  ): Promise<ApiResponse<OptimalPurchasePlan[]>> {
    try {
      await delay(800);

      const plan = this.generateOptimalPlan(items, budget);

      return {
        success: true,
        data: plan,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ANALYSIS_ERROR',
          message: 'Falha ao criar plano otimizado',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Gera plano otimizado de compra
   */
  private generateOptimalPlan(items: PearlShopItem[], budget: number): OptimalPurchasePlan[] {
    // Ordenar itens por ROI (melhor primeiro)
    const sortedItems = [...items].sort((a, b) => {
      const roiOrder = { Absurdo: 5, Extremo: 4, Alto: 3, Médio: 2, Baixo: 1 };
      return (roiOrder[b.roi as keyof typeof roiOrder] || 0) - (roiOrder[a.roi as keyof typeof roiOrder] || 0);
    });

    const plan: OptimalPurchasePlan[] = [];
    let remainingBudget = budget;
    let order = 1;

    for (const item of sortedItems) {
      if (remainingBudget <= 0) break;

      const quantity = Math.floor(remainingBudget / item.price);
      if (quantity <= 0) continue;

      const pricePerUnit = item.price;
      const totalPrice = pricePerUnit * quantity;
      const coupon = item.discount ? `${item.discount}%` : 'N/A';
      const finalPrice = applyDiscount(totalPrice, item.discount || 0);
      const roi = item.roi;
      const estimatedValue = finalPrice / 0.117; // Crons estimados

      plan.push({
        order,
        item: item.name,
        quantity,
        pricePerUnit,
        totalPrice,
        coupon,
        finalPrice,
        roi,
        estimatedValue,
      });

      remainingBudget -= finalPrice;
      order++;
    }

    return plan;
  }

  /**
   * Calcula ROI de um plano
   */
  calculatePlanROI(plan: OptimalPurchasePlan[]): ROICalculation {
    const totalPearls = plan.reduce((sum, item) => sum + item.finalPrice, 0);
    const totalCrons = plan.reduce((sum, item) => sum + item.estimatedValue, 0);

    return calculateROI(totalPearls, totalCrons);
  }

  /**
   * Compara múltiplos planos
   */
  comparePlans(plans: OptimalPurchasePlan[][]): Array<{ plan: number; roi: ROICalculation }> {
    return plans.map((plan, index) => ({
      plan: index + 1,
      roi: this.calculatePlanROI(plan),
    }));
  }

  /**
   * Obtém análise salva
   */
  async getAnalysis(analysisId: string): Promise<ApiResponse<OptimalPurchasePlan[]>> {
    try {
      // TODO: Integrar com API real
      await delay(300);

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
          message: 'Falha ao obter análise',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Lista análises do usuário
   */
  async listAnalyses(): Promise<ApiResponse<OptimalPurchasePlan[][]>> {
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
          message: 'Falha ao listar análises',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Deleta análise
   */
  async deleteAnalysis(analysisId: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      // TODO: Integrar com API real
      await delay(300);

      return {
        success: true,
        data: { success: true },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Falha ao deletar análise',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Exporta análise em PDF
   */
  async exportToPDF(plan: OptimalPurchasePlan[]): Promise<Blob> {
    // TODO: Implementar exportação real
    const csv = this.generateCSV(plan);
    return new Blob([csv], { type: 'text/csv' });
  }

  /**
   * Gera CSV da análise
   */
  private generateCSV(plan: OptimalPurchasePlan[]): string {
    const headers = ['Ordem', 'Item', 'Quantidade', 'Preço Unitário', 'Preço Total', 'Cupom', 'Preço Final', 'ROI'];
    const rows = plan.map((item) => [
      item.order,
      item.item,
      item.quantity,
      item.pricePerUnit,
      item.totalPrice,
      item.coupon,
      item.finalPrice,
      item.roi,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Valida plano de compra
   */
  validatePlan(plan: OptimalPurchasePlan[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!plan || plan.length === 0) {
      errors.push('Plano deve ter pelo menos um item');
    }

    for (const item of plan) {
      if (item.quantity <= 0) {
        errors.push(`Item ${item.item} deve ter quantidade maior que 0`);
      }

      if (item.finalPrice <= 0) {
        errors.push(`Item ${item.item} deve ter preço final maior que 0`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calcula economia total do plano
   */
  calculateSavings(plan: OptimalPurchasePlan[]): number {
    const totalOriginal = plan.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalFinal = plan.reduce((sum, item) => sum + item.finalPrice, 0);
    return totalOriginal - totalFinal;
  }

  /**
   * Calcula percentual de economia
   */
  calculateSavingsPercent(plan: OptimalPurchasePlan[]): number {
    const totalOriginal = plan.reduce((sum, item) => sum + item.totalPrice, 0);
    const savings = this.calculateSavings(plan);
    return totalOriginal > 0 ? (savings / totalOriginal) * 100 : 0;
  }

  /**
   * Obtém recomendação final
   */
  getRecommendation(roi: ROICalculation): string {
    return roi.recommendation;
  }

  /**
   * Gera relatório de análise
   */
  generateReport(plan: OptimalPurchasePlan[], roi: ROICalculation) {
    return {
      summary: {
        totalItems: plan.length,
        totalPearls: roi.totalPearls,
        totalCrons: roi.totalCrons,
        costPerCron: roi.costPerCron,
        efficiency: roi.efficiency,
      },
      savings: {
        total: this.calculateSavings(plan),
        percent: this.calculateSavingsPercent(plan),
      },
      recommendation: roi.recommendation,
      items: plan,
      generatedAt: new Date(),
    };
  }
}

export const analysisService = AnalysisService.getInstance();
