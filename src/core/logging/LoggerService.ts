/**
 * LoggerService
 * Sistema de logging estruturado para produção
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  userId?: string;
  sessionId?: string;
}

export class LoggerService {
  private logs: LogEntry[] = [];
  private readonly maxLogs: number = 1000;
  private sessionId: string;
  private userId?: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId || this.generateSessionId();
  }

  /**
   * Gerar ID de sessão
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Definir ID do usuário
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Log em nível DEBUG
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  /**
   * Log em nível INFO
   */
  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  /**
   * Log em nível WARN
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  /**
   * Log em nível ERROR
   */
  error(message: string, error?: Error | string, context?: Record<string, any>): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log('error', message, context, errorObj);
  }

  /**
   * Log em nível FATAL
   */
  fatal(message: string, error?: Error | string, context?: Record<string, any>): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log('fatal', message, context, errorObj);
  }

  /**
   * Log interno
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId: this.userId,
      sessionId: this.sessionId,
    };

    if (error) {
      entry.error = {
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
      };
    }

    // Adicionar ao array
    this.logs.push(entry);

    // Manter limite
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const style = this.getConsoleStyle(level);
      console.log(`%c[${level.toUpperCase()}]`, style, message, context || '');
    }

    // Enviar para servidor em caso de erro
    if (level === 'error' || level === 'fatal') {
      this.sendToServer(entry);
    }
  }

  /**
   * Obter estilo do console
   */
  private getConsoleStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      debug: 'color: #888; font-weight: normal;',
      info: 'color: #0066cc; font-weight: bold;',
      warn: 'color: #ff9900; font-weight: bold;',
      error: 'color: #cc0000; font-weight: bold;',
      fatal: 'color: #cc0000; font-weight: bold; background: #ffcccc;',
    };
    return styles[level];
  }

  /**
   * Enviar logs para servidor
   */
  private async sendToServer(entry: LogEntry): Promise<void> {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Falha silenciosa para não quebrar a aplicação
      console.warn('Failed to send log to server:', error);
    }
  }

  /**
   * Obter todos os logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Filtrar logs por nível
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Exportar logs como JSON
   */
  exportAsJson(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Exportar logs como CSV
   */
  exportAsCsv(): string {
    const headers = ['Timestamp', 'Level', 'Message', 'Context', 'Error'];
    const rows = this.logs.map(log => [
      log.timestamp,
      log.level,
      log.message,
      JSON.stringify(log.context || {}),
      log.error ? log.error.message : '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * Limpar logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Obter estatísticas
   */
  getStats(): Record<LogLevel, number> {
    return {
      debug: this.logs.filter(l => l.level === 'debug').length,
      info: this.logs.filter(l => l.level === 'info').length,
      warn: this.logs.filter(l => l.level === 'warn').length,
      error: this.logs.filter(l => l.level === 'error').length,
      fatal: this.logs.filter(l => l.level === 'fatal').length,
    };
  }
}

/**
 * Singleton instance
 */
export const logger = new LoggerService();
