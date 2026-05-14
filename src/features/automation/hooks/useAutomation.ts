/**
 * useAutomation Hook
 * Gerencia estado de automação
 */

import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

export function useAutomation() {
  const statusQuery = trpc.automation.getStatus.useQuery();

  const runManuallyMutation = trpc.automation.runManually.useMutation({
    onSuccess: () => {
      statusQuery.refetch();
    },
  });

  const startMutation = trpc.automation.start.useMutation({
    onSuccess: () => {
      statusQuery.refetch();
    },
  });

  const stopMutation = trpc.automation.stop.useMutation({
    onSuccess: () => {
      statusQuery.refetch();
    },
  });

  const updateConfigMutation = trpc.automation.updateConfig.useMutation({
    onSuccess: () => {
      statusQuery.refetch();
    },
  });

  const runManually = useCallback(async () => {
    await runManuallyMutation.mutateAsync();
  }, [runManuallyMutation]);

  const start = useCallback(async () => {
    await startMutation.mutateAsync();
  }, [startMutation]);

  const stop = useCallback(async () => {
    await stopMutation.mutateAsync();
  }, [stopMutation]);

  const updateConfig = useCallback(
    async (config: any) => {
      await updateConfigMutation.mutateAsync(config);
    },
    [updateConfigMutation]
  );

  return {
    // State
    status: statusQuery.data,

    // Loading
    isLoading: statusQuery.isLoading,
    isRunning: runManuallyMutation.isPending || startMutation.isPending,

    // Errors
    error: statusQuery.error,

    // Actions
    runManually,
    start,
    stop,
    updateConfig,

    // Refetch
    refetch: statusQuery.refetch,
  };
}
