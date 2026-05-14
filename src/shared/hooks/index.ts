/**
 * Índice de Hooks Compartilhados
 */

export { useNotifications } from './useNotifications';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useAsync } from './useAsync';
export { useAuth } from './useAuth';
export { usePerformanceMonitor } from './usePerformanceMonitor';
export { useLazyLoad } from './useLazyLoad';

export type { UseNotificationsReturn } from './useNotifications';
export type { UseLocalStorageReturn } from './useLocalStorage';
export type { UseAsyncReturn } from './useAsync';
export type { AuthUser, UseAuthReturn } from './useAuth';
export type { PerformanceMetrics } from './usePerformanceMonitor';
