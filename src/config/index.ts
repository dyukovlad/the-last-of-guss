/* eslint-disable @typescript-eslint/no-explicit-any */
export const APP_CONFIG = {
  API_BASE_URL: 'http://v2991160.hosted-by-vdsina.ru',
  DEFAULT_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  CACHE_TTL_MS: 300000, // 5 minutes
  DEBUG_MODE: import.meta.env.DEV,
  DEFAULT_PAGE_SIZE: 10,
} as const;

export const LOG_LEVELS = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
} as const;

export type LogLevel = keyof typeof LOG_LEVELS;

interface Logger {
  log: (level: LogLevel, message: string, meta?: any) => void;
  error: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  info: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;
}

export const logger: Logger = {
  log: (level: LogLevel, message: string, meta?: any) => {
    if (APP_CONFIG.DEBUG_MODE || level === 'error' || level === 'warn') {
      console[level](
        `[${level.toUpperCase()}] ${new Date().toISOString()} - ${message}`,
        meta
      );
    }
  },
  error: (message: string, meta?: any) => logger.log('error', message, meta),
  warn: (message: string, meta?: any) => logger.log('warn', message, meta),
  info: (message: string, meta?: any) => logger.log('info', message, meta),
  debug: (message: string, meta?: any) => logger.log('debug', message, meta),
};
