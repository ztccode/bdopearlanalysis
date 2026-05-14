/**
 * useLocalStorage Hook
 * Gerencia estado sincronizado com localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/core/utils';

interface UseLocalStorageReturn<T> {
  value: T | null;
  setValue: (value: T | null) => void;
  removeValue: () => void;
  isLoading: boolean;
}

export function useLocalStorage<T>(key: string, defaultValue?: T): UseLocalStorageReturn<T> {
  const [value, setValueState] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Inicializa valor do localStorage
   */
  useEffect(() => {
    try {
      const stored = getLocalStorage<T>(key);
      setValueState(stored || defaultValue || null);
    } catch (error) {
      console.error(`Erro ao ler localStorage[${key}]:`, error);
      setValueState(defaultValue || null);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  /**
   * Atualiza valor
   */
  const setValue = useCallback(
    (newValue: T | null) => {
      try {
        if (newValue === null) {
          removeLocalStorage(key);
        } else {
          setLocalStorage(key, newValue);
        }
        setValueState(newValue);
      } catch (error) {
        console.error(`Erro ao escrever localStorage[${key}]:`, error);
      }
    },
    [key]
  );

  /**
   * Remove valor
   */
  const removeValue = useCallback(() => {
    setValue(null);
  }, [setValue]);

  return {
    value,
    setValue,
    removeValue,
    isLoading,
  };
}
