/**
 * CacheStrategy
 * Estratégias de cache para otimização de performance
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  etag?: string;
}

export class CacheStrategy {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  /**
   * Obter valor do cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Verificar se expirou
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Armazenar valor no cache
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000, etag?: string): void {
    // Limpar se atingiu limite
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      etag,
    });
  }

  /**
   * Verificar se existe e não expirou
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Limpar cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remover entrada específica
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Obter ETag para validação
   */
  getETag(key: string): string | undefined {
    return this.cache.get(key)?.etag;
  }

  /**
   * Obter chave mais antiga
   */
  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Obter tamanho do cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Limpar entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

/**
 * Singleton instance
 */
export const cacheStrategy = new CacheStrategy();
