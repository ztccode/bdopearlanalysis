/**
 * usePearlShopData Hook
 * Gerencia dados da Loja de Pérolas com cache e sincronização
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { PearlShopPromotion, PearlShopSnapshot, LoadingState } from '@/core/types';
import { pearlShopService } from '../services/PearlShopService';
import { CACHE_CONFIG } from '@/core/constants';
import { getLocalStorage, setLocalStorage, delay } from '@/core/utils';

interface UsePearlShopDataReturn {
  promotion: PearlShopPromotion | null;
  snapshots: PearlShopSnapshot[];
  loading: LoadingState;
  error: Error | null;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
}

export function usePearlShopData(): UsePearlShopDataReturn {
  const [promotion, setPromotion] = useState<PearlShopPromotion | null>(null);
  const [snapshots, setSnapshots] = useState<PearlShopSnapshot[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    retryCount: 0,
  });
  const [error, setError] = useState<Error | null>(null);
  const cacheTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Carrega dados da Loja de Pérolas
   */
  const loadData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, isLoading: true }));
      setError(null);

      // Tentar obter do cache primeiro
      const cachedPromotion = getLocalStorage<PearlShopPromotion>('pearl_shop_promotion');
      const cacheTime = getLocalStorage<number>('pearl_shop_cache_time');

      if (
        cachedPromotion &&
        cacheTime &&
        Date.now() - cacheTime < CACHE_CONFIG.PEARL_SHOP_DATA
      ) {
        setPromotion(cachedPromotion);
        setLoading((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Buscar dados reais
      const response = await pearlShopService.getLatestPromotion();

      if (response.success && response.data) {
        setPromotion(response.data);
        setLocalStorage('pearl_shop_promotion', response.data);
        setLocalStorage('pearl_shop_cache_time', Date.now());
        setLoading((prev) => ({ ...prev, retryCount: 0 }));
      } else {
        throw new Error(response.error?.message || 'Falha ao carregar dados');
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
   * Carrega histórico de snapshots
   */
  const loadSnapshots = useCallback(async () => {
    try {
      const response = await pearlShopService.getPromotionHistory(10);

      if (response.success && response.data) {
        setSnapshots(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar snapshots:', err);
    }
  }, []);

  /**
   * Atualiza dados (refresh)
   */
  const refresh = useCallback(async () => {
    // Limpar cache
    setLocalStorage('pearl_shop_cache_time', 0);
    await loadData();
    await loadSnapshots();
  }, [loadData, loadSnapshots]);

  /**
   * Retry com backoff
   */
  const retry = useCallback(async () => {
    if (loading.retryCount >= 3) {
      setError(new Error('Máximo de tentativas atingido'));
      return;
    }

    const delayMs = 1000 * Math.pow(2, loading.retryCount);
    await delay(delayMs);
    await loadData();
  }, [loading.retryCount, loadData]);

  /**
   * Carrega dados ao montar
   */
  useEffect(() => {
    loadData();
    loadSnapshots();

    // Auto-refresh a cada 1 hora
    cacheTimerRef.current = setInterval(() => {
      refresh();
    }, CACHE_CONFIG.PEARL_SHOP_DATA);

    return () => {
      if (cacheTimerRef.current) {
        clearInterval(cacheTimerRef.current);
      }
    };
  }, [loadData, loadSnapshots, refresh]);

  return {
    promotion,
    snapshots,
    loading,
    error,
    refresh,
    retry,
  };
}
