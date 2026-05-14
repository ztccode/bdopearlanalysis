/**
 * CharacterService
 * Lógica de negócio centralizada para Personagens
 */

import type { Character, CharacterStats, CharacterAnalysis, Recommendation, ApiResponse } from '@/core/types';
import { calculateROI, delay } from '@/core/utils';

export class CharacterService {
  private static instance: CharacterService;

  private constructor() {}

  public static getInstance(): CharacterService {
    if (!CharacterService.instance) {
      CharacterService.instance = new CharacterService();
    }
    return CharacterService.instance;
  }

  /**
   * Importa personagem do Garmoth
   */
  async importCharacter(garmothUrl: string): Promise<ApiResponse<Character>> {
    try {
      // TODO: Integrar com API real do Garmoth
      await delay(1000);

      return {
        success: true,
        data: {
          id: 'char-001',
          userId: 'user-001',
          characterId: 'garmoth-id',
          name: 'Personagem Importado',
          stats: {
            ap: 750,
            dp: 350,
            gs: 775,
            accuracy: 925,
            criticalHitDamage: 45.5,
            evasion: 496,
            damageReduction: 496,
          },
          silver: 328147000000,
          isPrimary: true,
          importedAt: new Date(),
          updatedAt: new Date(),
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'IMPORT_ERROR',
          message: 'Falha ao importar personagem',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Obtém lista de personagens do usuário
   */
  async listCharacters(): Promise<ApiResponse<Character[]>> {
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
          message: 'Falha ao obter personagens',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Obtém personagem específico
   */
  async getCharacter(characterId: string): Promise<ApiResponse<Character>> {
    try {
      // TODO: Integrar com API real
      await delay(300);

      return {
        success: true,
        data: {
          id: characterId,
          userId: 'user-001',
          characterId,
          name: 'Personagem',
          stats: {
            ap: 750,
            dp: 350,
            gs: 775,
            accuracy: 925,
            criticalHitDamage: 45.5,
            evasion: 496,
            damageReduction: 496,
          },
          silver: 328147000000,
          isPrimary: true,
          importedAt: new Date(),
          updatedAt: new Date(),
        },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Falha ao obter personagem',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Deleta personagem
   */
  async deleteCharacter(characterId: string): Promise<ApiResponse<{ success: boolean }>> {
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
          message: 'Falha ao deletar personagem',
          details: { error: String(error) },
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Analisa personagem para recomendações de compra
   */
  async analyzeCharacter(character: Character): Promise<CharacterAnalysis> {
    const recommendations = this.generateRecommendations(character);
    const totalPearls = recommendations.reduce((sum, r) => sum + r.estimatedValue, 0);
    const estimatedCrons = Math.floor(totalPearls / 0.117); // Padrão BDO

    return {
      characterId: character.id,
      totalPearls,
      optimizedPearls: Math.floor(totalPearls * 0.8), // 80% do valor
      estimatedCrons,
      overallRoi: this.calculateOverallROI(totalPearls, estimatedCrons),
      recommendations,
      focusArea: this.determineFocusArea(character),
      budget: 9080, // Padrão para análise
      createdAt: new Date(),
    };
  }

  /**
   * Gera recomendações baseado no personagem
   */
  private generateRecommendations(character: Character): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Recomendação 1: Outfit Premium
    if (character.stats.gs >= 700) {
      recommendations.push({
        itemName: 'Outfit Premium',
        quantity: 2,
        priority: 1,
        roi: 0.117,
        reason: 'Melhor ROI em crons para seu nível',
        estimatedValue: 4400,
      });
    }

    // Recomendação 2: Bundle de Aprimoramento
    if (character.stats.gs >= 750) {
      recommendations.push({
        itemName: 'Pacote de Aprimoramento Premium',
        quantity: 1,
        priority: 2,
        roi: 0.095,
        reason: 'Valor agregado extremo com Conselho de Valks',
        estimatedValue: 3564,
      });
    }

    // Recomendação 3: Kits Especiais
    recommendations.push({
      itemName: 'Kit de Jornada Doce',
      quantity: 1,
      priority: 3,
      roi: 0.15,
      reason: 'Complemento excelente com desconto',
      estimatedValue: 579,
    });

    return recommendations;
  }

  /**
   * Calcula ROI geral
   */
  private calculateOverallROI(totalPearls: number, estimatedCrons: number): string {
    const roi = calculateROI(totalPearls, estimatedCrons);
    return roi.efficiency;
  }

  /**
   * Determina área de foco baseado no personagem
   */
  private determineFocusArea(character: Character): 'refinement' | 'utility' | 'balanced' {
    if (character.stats.gs >= 800) {
      return 'refinement'; // Foco em refinamento para endgame
    } else if (character.stats.gs >= 700) {
      return 'balanced'; // Equilíbrio para mid-game
    }
    return 'utility'; // Utilidade para early-game
  }

  /**
   * Valida stats do personagem
   */
  validateStats(stats: Partial<CharacterStats>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!stats.ap || stats.ap <= 0) {
      errors.push('AP deve ser maior que 0');
    }

    if (!stats.dp || stats.dp <= 0) {
      errors.push('DP deve ser maior que 0');
    }

    if (!stats.gs || stats.gs <= 0) {
      errors.push('GS deve ser maior que 0');
    }

    if (!stats.accuracy || stats.accuracy <= 0) {
      errors.push('Acurácia deve ser maior que 0');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calcula poder relativo do personagem
   */
  calculatePower(stats: CharacterStats): number {
    return stats.ap + stats.dp + stats.gs * 10;
  }

  /**
   * Compara dois personagens
   */
  compareCharacters(char1: Character, char2: Character) {
    const power1 = this.calculatePower(char1.stats);
    const power2 = this.calculatePower(char2.stats);

    return {
      char1: { name: char1.name, power: power1 },
      char2: { name: char2.name, power: power2 },
      difference: Math.abs(power1 - power2),
      stronger: power1 > power2 ? char1.name : char2.name,
    };
  }

  /**
   * Formata stats para exibição
   */
  formatStats(stats: CharacterStats) {
    return {
      ap: `${stats.ap}`,
      dp: `${stats.dp}`,
      gs: `${stats.gs}`,
      accuracy: `${stats.accuracy}`,
      criticalHitDamage: `${stats.criticalHitDamage.toFixed(1)}%`,
      evasion: `${stats.evasion}`,
      damageReduction: `${stats.damageReduction}`,
    };
  }
}

export const characterService = CharacterService.getInstance();
