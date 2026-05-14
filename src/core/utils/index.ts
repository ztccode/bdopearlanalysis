/**
 * Utilitários Puros - Funções sem efeitos colaterais
 */

import type { ROICalculation, OptimalPurchasePlan } from '../types';

// ============================================================================
// FORMATAÇÃO
// ============================================================================

/**
 * Formata número como moeda brasileira
 */
export function formatCurrency(value: number, currency: 'BRL' | 'USD' = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formata número com separadores de milhares
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formata data em formato brasileiro
 */
export function formatDate(date: Date | string, withTime = false): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  if (withTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('pt-BR', options).format(d);
}

/**
 * Formata tempo em formato legível (ex: "2 horas atrás")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60) return 'agora';
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m atrás`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h atrás`;
  if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)}d atrás`;

  return formatDate(d);
}

/**
 * Formata percentual
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ============================================================================
// CÁLCULOS
// ============================================================================

/**
 * Calcula ROI (Return on Investment)
 */
export function calculateROI(
  totalPearls: number,
  totalCrons: number,
  standardCronPrice = 0.117
): ROICalculation {
  const costPerCron = totalPearls / totalCrons;
  const savings = (1 - costPerCron / standardCronPrice) * 100;

  let efficiency: 'Extremo' | 'Excelente' | 'Bom' | 'Médio' = 'Médio';
  let recommendation = 'Estratégia padrão';

  if (savings > 50) {
    efficiency = 'Extremo';
    recommendation = 'ROI excepcional - estratégia perfeita!';
  } else if (savings > 30) {
    efficiency = 'Excelente';
    recommendation = 'Excelente retorno - recomendado!';
  } else if (savings > 10) {
    efficiency = 'Bom';
    recommendation = 'Bom retorno - considere esta estratégia';
  }

  return {
    totalPearls,
    totalCrons,
    costPerCron: parseFloat(costPerCron.toFixed(4)),
    efficiency,
    recommendation,
  };
}

/**
 * Calcula desconto em percentual
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  return ((originalPrice - discountedPrice) / originalPrice) * 100;
}

/**
 * Calcula preço com desconto
 */
export function applyDiscount(price: number, discountPercent: number): number {
  return price * (1 - discountPercent / 100);
}

/**
 * Calcula valor total de um plano de compra
 */
export function calculatePlanTotal(plans: OptimalPurchasePlan[]): number {
  return plans.reduce((total, plan) => total + plan.finalPrice, 0);
}

/**
 * Calcula crons totais de um plano
 */
export function calculateTotalCrons(plans: OptimalPurchasePlan[]): number {
  return plans.reduce((total, plan) => total + (plan.quantity * 100), 0); // Estimativa
}

// ============================================================================
// VALIDAÇÃO
// ============================================================================

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida Garmoth URL
 */
export function isValidGarmothUrl(url: string): boolean {
  return /garmoth\.com\/character\/[a-zA-Z0-9]+\/screenshot/.test(url);
}

/**
 * Extrai ID do personagem de URL Garmoth
 */
export function extractCharacterIdFromGarmothUrl(url: string): string | null {
  const match = url.match(/garmoth\.com\/character\/([a-zA-Z0-9]+)\/screenshot/);
  return match ? match[1] : null;
}

/**
 * Valida se número está em range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

// ============================================================================
// STRING
// ============================================================================

/**
 * Capitaliza primeira letra
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converte string para slug
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Trunca string com ellipsis
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Remove espaços em branco extras
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

// ============================================================================
// ARRAY
// ============================================================================

/**
 * Remove duplicatas de array
 */
export function removeDuplicates<T>(arr: T[], key?: (item: T) => unknown): T[] {
  if (!key) {
    return [...new Set(arr)];
  }

  const seen = new Set();
  return arr.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * Agrupa array por chave
 */
export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = key(item);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Ordena array
 */
export function sortBy<T>(arr: T[], key: (item: T) => unknown, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...arr].sort((a, b) => {
    const aVal = key(a) as any;
    const bVal = key(b) as any;

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filtra array por múltiplas condições
 */
export function filterBy<T>(arr: T[], conditions: Record<keyof T, unknown>): T[] {
  return arr.filter((item) =>
    Object.entries(conditions).every(([key, value]) => item[key as keyof T] === value)
  );
}

// ============================================================================
// OBJECT
// ============================================================================

/**
 * Cria cópia profunda de objeto
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Mescla objetos
 */
export function mergeObjects<T extends Record<string, unknown>>(
  ...objects: Partial<T>[]
): T {
  return Object.assign({}, ...objects) as T;
}

/**
 * Extrai chaves específicas de objeto
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>
  );
}

/**
 * Omite chaves de objeto
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, K>;
}

// ============================================================================
// ASYNC
// ============================================================================

/**
 * Delay assíncrono
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry com backoff exponencial
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delayMs = initialDelayMs * Math.pow(2, i);
        await delay(delayMs);
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Timeout para Promise
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    ),
  ]);
}

// ============================================================================
// STORAGE
// ============================================================================

/**
 * Salva item no localStorage com serialização
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set localStorage key "${key}":`, error);
  }
}

/**
 * Recupera item do localStorage com desserialização
 */
export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue ?? null;
  } catch (error) {
    console.error(`Failed to get localStorage key "${key}":`, error);
    return defaultValue ?? null;
  }
}

/**
 * Remove item do localStorage
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}":`, error);
  }
}

/**
 * Limpa todo localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
