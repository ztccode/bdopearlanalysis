/**
 * Constantes Globais da Aplicação
 */

// ============================================================================
// CONFIGURAÇÃO DE APLICAÇÃO
// ============================================================================

export const APP_CONFIG = {
  name: 'BDO Pearl Shop Analysis',
  version: '1.0.0',
  description: 'Análise profissional de custo-benefício da Loja de Pérolas do Black Desert Online',
  environment: process.env.NODE_ENV || 'development',
} as const;

// ============================================================================
// CACHE
// ============================================================================

export const CACHE_CONFIG = {
  PEARL_SHOP_DATA: 1000 * 60 * 60, // 1 hora
  CHARACTER_DATA: 1000 * 60 * 30, // 30 minutos
  ANALYSIS_DATA: 1000 * 60 * 60 * 24, // 1 dia
  HISTORICAL_DATA: 1000 * 60 * 60 * 24 * 7, // 1 semana
} as const;

// ============================================================================
// ROI LEVELS
// ============================================================================

export const ROI_LEVELS = {
  ABSURDO: 'Absurdo',
  EXTREMO: 'Extremo',
  ALTO: 'Alto',
  MEDIO: 'Médio',
  BAIXO: 'Baixo',
} as const;

export const ROI_COLORS = {
  Absurdo: '#9333ea', // Purple
  Extremo: '#dc2626', // Red
  Alto: '#2563eb', // Blue
  Médio: '#f59e0b', // Amber
  Baixo: '#6b7280', // Gray
} as const;

// ============================================================================
// CURRENCIES
// ============================================================================

export const CURRENCIES = {
  ACOIN: 'Acoin',
  PEARLS: 'Pérolas',
  SILVER: 'Silver',
} as const;

// ============================================================================
// CATEGORIES
// ============================================================================

export const ITEM_CATEGORIES = {
  OUTFIT: 'outfit',
  BUNDLE: 'bundle',
  KIT: 'kit',
  CONSUMABLE: 'consumable',
} as const;

export const CATEGORY_LABELS = {
  outfit: 'Outfit',
  bundle: 'Bundle',
  kit: 'Kit',
  consumable: 'Consumível',
} as const;

// ============================================================================
// FOCUS AREAS
// ============================================================================

export const FOCUS_AREAS = {
  REFINEMENT: 'refinement',
  UTILITY: 'utility',
  BALANCED: 'balanced',
} as const;

export const FOCUS_AREA_LABELS = {
  refinement: 'Refinamento',
  utility: 'Utilidade',
  balanced: 'Balanceado',
} as const;

// ============================================================================
// USER ROLES
// ============================================================================

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// ============================================================================
// SCRAPING
// ============================================================================

export const SCRAPING_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000,
  BACKOFF_MULTIPLIER: 2,
  INITIAL_DELAY_MS: 1000,
} as const;

export const SCRAPING_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// ============================================================================
// VALIDATION
// ============================================================================

export const VALIDATION = {
  MIN_CHARACTER_NAME_LENGTH: 1,
  MAX_CHARACTER_NAME_LENGTH: 255,
  MIN_PRICE: 0,
  MAX_DISCOUNT: 100,
  MIN_DISCOUNT: 0,
} as const;

// ============================================================================
// DATES
// ============================================================================

export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  ISO_WITH_TIME: 'yyyy-MM-dd\'T\'HH:mm:ss',
} as const;

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  HOME: '/',
  PERSONALIZE: '/personalize',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_SCRAPING: '/admin/scraping',
  ADMIN_HISTORY: '/admin/history',
  ADMIN_COMPARISONS: '/admin/comparisons',
  ADMIN_LOGS: '/admin/logs',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  NOT_FOUND: '/404',
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // Pearl Shop
  PEARL_SHOP_LATEST: '/api/trpc/pearlShop.getLatest',
  PEARL_SHOP_HISTORY: '/api/trpc/pearlShop.getHistory',
  PEARL_SHOP_COMPARE: '/api/trpc/pearlShop.compare',

  // Character
  CHARACTER_IMPORT: '/api/trpc/character.import',
  CHARACTER_LIST: '/api/trpc/character.list',
  CHARACTER_GET: '/api/trpc/character.get',
  CHARACTER_DELETE: '/api/trpc/character.delete',

  // Analysis
  ANALYSIS_CREATE: '/api/trpc/analysis.create',
  ANALYSIS_LIST: '/api/trpc/analysis.list',
  ANALYSIS_GET: '/api/trpc/analysis.get',
  ANALYSIS_DELETE: '/api/trpc/analysis.delete',

  // Admin
  ADMIN_SCRAPE: '/api/trpc/admin.scrape',
  ADMIN_METRICS: '/api/trpc/admin.getMetrics',
  ADMIN_LOGS: '/api/trpc/admin.getLogs',
  ADMIN_USERS: '/api/trpc/admin.getUsers',

  // Auth
  AUTH_ME: '/api/trpc/auth.me',
  AUTH_LOGOUT: '/api/trpc/auth.logout',
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

// ============================================================================
// TIMING
// ============================================================================

export const TIMING = {
  ANIMATION_FAST: 150,
  ANIMATION_BASE: 300,
  ANIMATION_SLOW: 500,
  DEBOUNCE_SEARCH: 300,
  DEBOUNCE_RESIZE: 200,
} as const;

// ============================================================================
// MESSAGES
// ============================================================================

export const MESSAGES = {
  LOADING: 'Carregando...',
  ERROR_GENERIC: 'Ocorreu um erro. Tente novamente.',
  ERROR_NETWORK: 'Erro de conexão. Verifique sua internet.',
  ERROR_VALIDATION: 'Dados inválidos. Verifique os campos.',
  SUCCESS_SAVE: 'Salvo com sucesso!',
  SUCCESS_DELETE: 'Deletado com sucesso!',
  SUCCESS_IMPORT: 'Importado com sucesso!',
  CONFIRM_DELETE: 'Tem certeza que deseja deletar?',
} as const;
