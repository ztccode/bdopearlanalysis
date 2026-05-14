/**
 * useCharacterAnalysis Hook
 * Gerencia análise de personagem e recomendações
 */

import { useState, useCallback, useEffect } from 'react';
import type { Character, CharacterAnalysis, LoadingState } from '@/core/types';
import { characterService } from '../services/CharacterService';
import { analysisService } from '@/features/pearl-shop/services/AnalysisService';
import { getLocalStorage, setLocalStorage } from '@/core/utils';

interface UseCharacterAnalysisReturn {
  character: Character | null;
  analysis: CharacterAnalysis | null;
  loading: LoadingState;
  error: Error | null;
  importCharacter: (garmothUrl: string) => Promise<void>;
  analyzeCharacter: () => Promise<void>;
  clearAnalysis: () => void;
}

export function useCharacterAnalysis(): UseCharacterAnalysisReturn {
  const [character, setCharacter] = useState<Character | null>(null);
  const [analysis, setAnalysis] = useState<CharacterAnalysis | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    retryCount: 0,
  });
  const [error, setError] = useState<Error | null>(null);

  /**
   * Importa personagem do Garmoth
   */
  const importCharacter = useCallback(async (garmothUrl: string) => {
    try {
      setLoading((prev) => ({ ...prev, isLoading: true }));
      setError(null);

      const response = await characterService.importCharacter(garmothUrl);

      if (response.success && response.data) {
        setCharacter(response.data);
        setLocalStorage('current_character', response.data);
        setLoading((prev) => ({ ...prev, retryCount: 0 }));
      } else {
        throw new Error(response.error?.message || 'Falha ao importar personagem');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoading((prev) => ({
        ...prev,
        error,
        retryCount: prev.retryCount + 1,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  /**
   * Analisa personagem
   */
  const analyzeCharacter = useCallback(async () => {
    if (!character) {
      setError(new Error('Nenhum personagem selecionado'));
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, isLoading: true }));
      setError(null);

      // Análise local (sem API)
      const characterAnalysis = await characterService.analyzeCharacter(character);
      setAnalysis(characterAnalysis);
      setLocalStorage('character_analysis', characterAnalysis);
      setLoading((prev) => ({ ...prev, retryCount: 0 }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoading((prev) => ({
        ...prev,
        error,
        retryCount: prev.retryCount + 1,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, isLoading: false }));
    }
  }, [character]);

  /**
   * Limpa análise
   */
  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setCharacter(null);
    setError(null);
    localStorage.removeItem('current_character');
    localStorage.removeItem('character_analysis');
  }, []);

  /**
   * Carrega dados salvos ao montar
   */
  useEffect(() => {
    const savedCharacter = getLocalStorage<Character>('current_character');
    const savedAnalysis = getLocalStorage<CharacterAnalysis>('character_analysis');

    if (savedCharacter) {
      setCharacter(savedCharacter);
    }

    if (savedAnalysis) {
      setAnalysis(savedAnalysis);
    }
  }, []);

  return {
    character,
    analysis,
    loading,
    error,
    importCharacter,
    analyzeCharacter,
    clearAnalysis,
  };
}
