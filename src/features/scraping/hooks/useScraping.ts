/**
 * useScraping Hook
 * Gerencia estado de scraping
 */

import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import type { PearlShopPromotion } from '@shared/types';

export function useScraping() {
  const [isScraped, setIsScraped] = useState(false);
  const [scrapedData, setScrapedData] = useState<PearlShopPromotion | null>(null);

  const scrapeMutation = trpc.scraping.scrapeShop.useMutation({
    onSuccess: (data) => {
      setScrapedData(data.promotion);
      setIsScraped(true);
    },
    onError: (error) => {
      console.error('Scraping error:', error);
    },
  });

  const statusQuery = trpc.scraping.getStatus.useQuery();

  const startScraping = useCallback(
    async (url: string) => {
      try {
        await scrapeMutation.mutateAsync({
          url,
          saveSnapshot: true,
        });
      } catch (error) {
        console.error('Failed to start scraping:', error);
      }
    },
    [scrapeMutation]
  );

  const reset = useCallback(() => {
    setIsScraped(false);
    setScrapedData(null);
  }, []);

  return {
    // State
    isScraped,
    scrapedData,

    // Loading/Error
    isLoading: scrapeMutation.isPending,
    error: scrapeMutation.error,
    status: statusQuery.data,

    // Actions
    startScraping,
    reset,
  };
}
