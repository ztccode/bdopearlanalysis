/**
 * useHistoricalData Hook
 * Gerencia dados históricos de promoções
 */

import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import type { HistoricalComparison, PriceTrend } from '@shared/types';

export function useHistoricalData() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);

  // Queries
  const recentSnapshotsQuery = trpc.history.getRecentSnapshots.useQuery(
    { promotionId: 'current', limit: 10 },
    { enabled: false }
  );

  const priceHistoryQuery = trpc.history.getPriceHistory.useQuery(
    { itemId: selectedItemId || '', days: 30 },
    { enabled: !!selectedItemId }
  );

  const priceTrendQuery = trpc.history.getPriceTrend.useQuery(
    { itemId: selectedItemId || '' },
    { enabled: !!selectedItemId }
  );

  // Handlers
  const selectItem = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
  }, []);

  const toggleComparisonMode = useCallback(() => {
    setComparisonMode((prev) => !prev);
  }, []);

  return {
    // State
    selectedItemId,
    comparisonMode,

    // Data
    recentSnapshots: recentSnapshotsQuery.data,
    priceHistory: priceHistoryQuery.data,
    priceTrend: priceTrendQuery.data,

    // Loading states
    isLoadingSnapshots: recentSnapshotsQuery.isLoading,
    isLoadingHistory: priceHistoryQuery.isLoading,
    isLoadingTrend: priceTrendQuery.isLoading,

    // Errors
    snapshotsError: recentSnapshotsQuery.error,
    historyError: priceHistoryQuery.error,
    trendError: priceTrendQuery.error,

    // Actions
    selectItem,
    toggleComparisonMode,
    refetchSnapshots: recentSnapshotsQuery.refetch,
    refetchHistory: priceHistoryQuery.refetch,
    refetchTrend: priceTrendQuery.refetch,
  };
}
