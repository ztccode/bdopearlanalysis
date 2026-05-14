/**
 * SecurityUtils
 * Utilitários de segurança: sanitização, validação, XSS protection
 */

/**
 * Sanitizar HTML para prevenir XSS
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Sanitizar URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Apenas permitir http e https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Validar email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 320;
}

/**
 * Validar número inteiro
 */
export function validateInteger(value: any): boolean {
  return Number.isInteger(value) && !isNaN(value);
}

/**
 * Validar número positivo
 */
export function validatePositiveNumber(value: any): boolean {
  return typeof value === 'number' && value > 0 && !isNaN(value);
}

/**
 * Sanitizar string de entrada do usuário
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove < e > para prevenir XSS
}

/**
 * Validar estrutura de objeto
 */
export function validateObject<T>(
  obj: any,
  schema: Record<string, (val: any) => boolean>
): obj is T {
  for (const [key, validator] of Object.entries(schema)) {
    if (!(key in obj) || !validator(obj[key])) {
      return false;
    }
  }
  return true;
}

/**
 * Escapar caracteres especiais para SQL (NOTA: Use prepared statements em produção)
 */
export function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

/**
 * Gerar CSRF token (client-side)
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validar CSRF token
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  // Usar timing-safe comparison
  if (token.length !== storedToken.length) return false;

  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Hash simples para verificação (NÃO USE PARA SENHAS)
 */
export async function simpleHash(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remover tentativas fora da janela
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  clear(): void {
    this.attempts.clear();
  }
}

/**
 * Content Security Policy helper
 */
export const CSP_HEADERS = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https:'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

/**
 * Gerar CSP header string
 */
export function generateCspHeader(): string {
  return Object.entries(CSP_HEADERS)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}
