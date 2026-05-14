/**
 * PearlShopProvider
 * Context global para estado da Loja de Pérolas
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { usePearlShopData } from '@/features/pearl-shop/hooks/usePearlShopData';
import type { PearlShopPromotion, PearlShopSnapshot, LoadingState } from '@/core/types';

interface PearlShopContextType {
  promotion: PearlShopPromotion | null;
  snapshots: PearlShopSnapshot[];
  loading: LoadingState;
  error: Error | null;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
}

const PearlShopContext = createContext<PearlShopContextType | undefined>(undefined);

interface PearlShopProviderProps {
  children: ReactNode;
}

/**
 * Provider component
 */
export function PearlShopProvider({ children }: PearlShopProviderProps) {
  const pearlShopData = usePearlShopData();

  return (
    <PearlShopContext.Provider value={pearlShopData}>
      {children}
    </PearlShopContext.Provider>
  );
}

/**
 * Hook para usar o contexto
 */
export function usePearlShop(): PearlShopContextType {
  const context = useContext(PearlShopContext);

  if (!context) {
    throw new Error('usePearlShop deve ser usado dentro de PearlShopProvider');
  }

  return context;
}
