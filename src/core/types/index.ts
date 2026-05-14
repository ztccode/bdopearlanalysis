/**
 * Tipos Globais da Aplicação
 * Centraliza todas as interfaces e tipos reutilizáveis
 */

// ============================================================================
// DOMÍNIO: Pearl Shop (Loja de Pérolas)
// ============================================================================

export interface PearlShopItem {
  id: string;
  name: string;
  price: number;
  currency: 'Acoin' | 'Pérolas';
  discount?: number;
  category: 'outfit' | 'bundle' | 'kit' | 'consumable';
  description?: string;
  roi: 'Absurdo' | 'Extremo' | 'Alto' | 'Médio' | 'Baixo';
  priority: number;
  period?: {
    start: Date;
    end: Date;
  };
  imageUrl?: string;
}

export interface PearlShopPromotion {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  items: PearlShopItem[];
  bannerUrl?: string;
  isActive: boolean;
}

export interface PearlShopSnapshot {
  id: string;
  promotionId: string;
  timestamp: Date;
  items: PearlShopItem[];
  metadata: Record<string, unknown>;
}

// ============================================================================
// DOMÍNIO: Character (Personagem)
// ============================================================================

export interface CharacterStats {
  ap: number;
  dp: number;
  gs: number;
  accuracy: number;
  criticalHitDamage: number;
  evasion: number;
  damageReduction: number;
}

export interface Character {
  id: string;
  userId: string;
  characterId: string;
  name: string;
  stats: CharacterStats;
  silver: number;
  isPrimary: boolean;
  importedAt: Date;
  updatedAt: Date;
}

export interface CharacterAnalysis {
  characterId: string;
  totalPearls: number;
  optimizedPearls: number;
  estimatedCrons: number;
  overallRoi: string;
  recommendations: Recommendation[];
  focusArea: 'refinement' | 'utility' | 'balanced';
  budget: number;
  createdAt: Date;
}

export interface Recommendation {
  itemName: string;
  quantity: number;
  priority: number;
  roi: number;
  reason: string;
  estimatedValue: number;
}

// ============================================================================
// DOMÍNIO: Analysis (Análise)
// ============================================================================

export interface ROICalculation {
  totalPearls: number;
  totalCrons: number;
  costPerCron: number;
  efficiency: 'Extremo' | 'Excelente' | 'Bom' | 'Médio';
  recommendation: string;
}

export interface OptimalPurchasePlan {
  order: number;
  item: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  coupon?: string;
  finalPrice: number;
  roi: string;
  estimatedValue: number;
}

export interface HistoricalComparison {
  currentSnapshot: PearlShopSnapshot;
  previousSnapshot: PearlShopSnapshot;
  changes: SnapshotChange[];
  analysis: ComparisonAnalysis;
}

export interface SnapshotChange {
  itemId: string;
  changeType: 'added' | 'removed' | 'price_changed' | 'discount_changed';
  oldValue?: unknown;
  newValue?: unknown;
  detectedAt: Date;
}

export interface ComparisonAnalysis {
  itemsAdded: number;
  itemsRemoved: number;
  priceChanges: number;
  averagePriceChange: number;
  roiTrend: 'improving' | 'declining' | 'stable';
  predictedNextPromotion?: Date;
}

// ============================================================================
// DOMÍNIO: Scraping
// ============================================================================

export interface ScrapingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  itemsScraped: number;
  duration: number; // em ms
}

export interface ScrapingLog {
  id: string;
  jobId: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// DOMÍNIO: User & Auth
// ============================================================================

export interface User {
  id: string;
  openId: string;
  name?: string;
  email?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface AuthContext {
  user: User | null;
  loading: boolean;
  error?: string;
  login: (returnPath?: string) => void;
  logout: () => Promise<void>;
}

// ============================================================================
// DOMÍNIO: Notifications
// ============================================================================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// DOMÍNIO: Cache
// ============================================================================

export interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: Date;
  createdAt: Date;
}

export interface CacheConfig {
  ttl: number; // Time to live em ms
  maxSize?: number;
}

// ============================================================================
// DOMÍNIO: API Response
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// DOMÍNIO: UI State
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  error?: Error;
  retryCount: number;
}

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// ============================================================================
// DOMÍNIO: Admin
// ============================================================================

export interface AdminDashboardMetrics {
  lastScrapingTime: Date;
  nextScrapingTime: Date;
  successRate: number;
  failureRate: number;
  averageScrapingDuration: number;
  totalSnapshots: number;
  totalUsers: number;
}

export interface AdminAuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: Record<string, unknown>;
  timestamp: Date;
}
