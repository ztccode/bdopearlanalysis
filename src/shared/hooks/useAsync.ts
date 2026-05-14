/**
 * useAsync Hook
 * Gerencia operações assíncronas
 */

import { useState, useEffect, useCallback } from 'react';

interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: () => Promise<void>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncReturn<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  /**
   * Executa função assíncrona
   */
  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });

    try {
      const response = await asyncFunction();
      setState({ status: 'success', data: response, error: null });
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }, [asyncFunction]);

  /**
   * Reset do estado
   */
  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  /**
   * Executa ao montar se immediate = true
   */
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}
