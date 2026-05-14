/**
 * useHistoricalComparison Hook
 * Gerencia comparação histórica de promoções
 */

import { useState, useCallback } from 'react';
import type { PearlShopSnapshot, HistoricalComparison, LoadingState } from '@/core/types';
import { pearlShopService } from '../services/PearlShopService';

interface UseHistoricalComparisonReturn {
  comparison: HistoricalComparison | null;
  loading: LoadingState;
  error: Error | null;
  compare: (current: PearlShopSnapshot, previous: PearlShopSnapshot) => Promise<void>;
  clear: () => void;
}

export function useHistoricalComparison(): UseHistoricalComparisonReturn {
  const [comparison, setComparison] = useState<HistoricalComparison | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    retryCount: 0,
  });
  const [error, setError] = useState<Error | null>(null);

  /**
   * Compara dois snapshots
   */
  const compare = useCallback(
    async (current: PearlShopSnapshot, previous: PearlShopSnapshot) => {
      try {
        setLoading((prev) => ({ ...prev, isLoading: true }));
        setError(null);

        const result = await pearlShopService.comparePromotions(current, previous);
        setComparison(result);
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
    },
    []
  );

  /**
   * Limpa comparação
   */
  const clear = useCallback(() => {
    setComparison(null);
    setError(null);
  }, []);

  return {
    comparison,
    loading,
    error,
    compare,
    clear,
  };
}
