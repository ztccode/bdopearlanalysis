/**
 * CacheProvider
 * Context global para gerenciamento de cache
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { CacheEntry, CacheConfig } from '@/core/types';

interface CacheContextType {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T, ttl?: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

interface CacheProviderProps {
  children: ReactNode;
  config?: CacheConfig;
}

/**
 * Provider component
 */
export function CacheProvider({ children, config = { ttl: 3600000 } }: CacheProviderProps) {
  const [cache, setCache] = useState<Map<string, CacheEntry<unknown>>>(new Map());

  /**
   * Obtém valor do cache
   */
  const get = useCallback(
    <T,>(key: string): T | null => {
      const entry = cache.get(key);

      if (!entry) {
        return null;
      }

      // Verificar se expirou
      if (new Date() > entry.expiresAt) {
        setCache((prev) => {
          const newCache = new Map(prev);
          newCache.delete(key);
          return newCache;
        });
        return null;
      }

      return entry.value as T;
    },
    [cache]
  );

  /**
   * Define valor no cache
   */
  const set = useCallback(
    <T,>(key: string, value: T, ttl = config.ttl) => {
      const expiresAt = new Date(Date.now() + ttl);

      setCache((prev) => {
        const newCache = new Map(prev);
        newCache.set(key, {
          key,
          value,
          expiresAt,
          createdAt: new Date(),
        });

        // Limitar tamanho do cache
        if (config.maxSize && newCache.size > config.maxSize) {
          const firstKey = newCache.keys().next().value;
          if (firstKey) {
            newCache.delete(firstKey);
          }
        }

        return newCache;
      });
    },
    [config]
  );

  /**
   * Remove valor do cache
   */
  const remove = useCallback((key: string) => {
    setCache((prev) => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  /**
   * Limpa todo o cache
   */
  const clear = useCallback(() => {
    setCache(new Map());
  }, []);

  /**
   * Verifica se chave existe
   */
  const has = useCallback(
    (key: string) => {
      return get(key) !== null;
    },
    [get]
  );

  const value: CacheContextType = {
    get,
    set,
    remove,
    clear,
    has,
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
}

/**
 * Hook para usar o contexto
 */
export function useCache(): CacheContextType {
  const context = useContext(CacheContext);

  if (!context) {
    throw new Error('useCache deve ser usado dentro de CacheProvider');
  }

  return context;
}
