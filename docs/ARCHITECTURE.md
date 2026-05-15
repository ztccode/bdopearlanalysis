# 🏗️ ARQUITETURA PROFISSIONAL

## Visão Geral

Esta aplicação segue **Clean Architecture** com separação clara entre camadas:

```
src/
├── client/              # Frontend React
│   ├── features/        # Domínios de negócio
│   ├── shared/          # Componentes reutilizáveis
│   ├── core/            # Lógica central
│   └── pages/           # Rotas (TanStack Router)
├── server/              # Backend Express + tRPC
│   ├── db/              # Database (Drizzle ORM)
│   ├── routers/         # tRPC routers
│   ├── procedures/      # tRPC procedures (queries/mutations)
│   ├── middleware/      # Express middleware
│   └── index.ts         # Server entry point
└── shared/              # Tipos compartilhados
    └── types.ts         # TypeScript types
```

## Stack Tecnológico Justificado

### Frontend
- **React 19**: Latest, com concurrent rendering
- **TanStack Router**: Type-safe routing
- **React Query**: Server state management
- **Tailwind 4**: Utility-first CSS (production-ready)
- **Radix UI**: Headless components (accessibility built-in)
- **Zod**: Runtime validation

### Backend
- **Express 4**: Lightweight, mature, vast ecosystem
- **tRPC 11**: End-to-end type safety
- **Drizzle ORM**: Modern, type-safe SQL
- **PostgreSQL**: Robust, ACID compliance
- **Pino**: Structured logging (performance-optimized)

### Automação
- **Playwright**: Browser automation (Garmoth scraping)
- **Cheerio**: HTML parsing (shop data)
- **node-cron**: Scheduled jobs (weekly snapshots)

### Qualidade
- **Vitest**: Unit/integration tests
- **ESLint + Prettier**: Code consistency
- **TypeScript Strict**: Type safety

---

## Padrões de Design

### 1. Dependency Injection

```typescript
// src/server/procedures/pearl-shop.ts
import { publicProcedure } from './base';

export const getPearlShop = publicProcedure
  .query(async ({ ctx }) => {
    return ctx.db.query.pearlShop.findFirst();
  });
```

### 2. Repository Pattern

```typescript
// src/server/db/repositories/pearl-shop.repo.ts
export class PearlShopRepository {
  constructor(private db: Database) {}

  async getLatest() {
    return this.db.query.pearlShop.findFirst();
  }

  async getHistory(limit: number) {
    return this.db.query.pearlShop.findMany({ limit });
  }
}
```

### 3. Custom Hooks for Composition

```typescript
// src/client/shared/hooks/usePearlShop.ts
export function usePearlShop() {
  const { data, isLoading } = trpc.pearlShop.getLatest.useQuery();
  const cache = useCache();
  const logger = useLogger();

  return { data, isLoading, cache, logger };
}
```

### 4. Middleware Pattern

```typescript
// src/server/middleware/auth.ts
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## Data Flow

### Query Flow (Client → Server)
```
React Component
  ↓
usePearlShop hook (Custom Hook)
  ↓
trpc.pearlShop.getLatest.useQuery() (React Query)
  ↓
Client-side tRPC
  ↓
HTTP POST to /trpc/pearlShop.getLatest
  ↓
Express + tRPC Server
  ↓
getLatest procedure (with auth middleware)
  ↓
Database Query (Drizzle)
  ↓
LRU Cache (if configured)
  ↓
Return JSON
  ↓
React Component re-render
```

### Mutation Flow (Create/Update/Delete)
```
React Component + Form (react-hook-form)
  ↓
Zod Validation (client-side)
  ↓
trpc.pearlShop.update.useMutation()
  ↓
Express + Auth Middleware
  ↓
Zod Validation (server-side)
  ↓
Business Logic
  ↓
Database Mutation
  ↓
Invalidate React Query cache
  ↓
Optimistic Update UI
```

---

## Segurança

### 1. Authentication (JWT)
```typescript
// src/core/security/jwt.ts
export function generateJWT(user: User) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
}
```

### 2. Authorization (Role-based)
```typescript
// src/server/procedures/base.ts
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure
  .use(async ({ next, ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  });
```

### 3. Input Validation (Zod)
```typescript
// src/shared/types.ts
export const UpdatePearlShopSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })),
});
```

### 4. Rate Limiting
```typescript
// src/server/middleware/rateLimit.ts
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per windowMs
  message: 'Muitas requisições, tente novamente mais tarde'
});
```

---

## Performance Otimizações

### 1. Caching Strategy
```typescript
// src/core/cache/cache.service.ts
class CacheService {
  private lru = new LRUCache(100, 3600000);

  async getWithCache<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = this.lru.get(key);
    if (cached) return cached;

    const data = await fetcher();
    this.lru.set(key, data);
    return data;
  }
}
```

### 2. Database Query Optimization
```typescript
// Use indexes on frequently queried columns
export const pearlShop = pgTable('pearl_shop', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // ...
}, (table) => ({
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));
```

### 3. Code Splitting (Automatic with Vite)
```typescript
// src/client/features/admin/index.ts
export const AdminPanel = lazy(() => import('./AdminPanel'));
```

### 4. Image Optimization
```tsx
// Use native lazy loading
<img 
  src="..." 
  alt="..." 
  loading="lazy" 
  width={400} 
  height={300}
/>
```

---

## Testing Strategy

### Unit Tests
```typescript
// src/core/cache/lru-cache.test.ts
describe('LRUCache', () => {
  it('should evict oldest item when full', () => {
    const cache = new LRUCache(2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    
    expect(cache.get('a')).toBeUndefined();
  });
});
```

### Integration Tests
```typescript
// src/server/routers/pearl-shop.test.ts
describe('Pearl Shop Router', () => {
  it('should fetch latest shop data', async () => {
    const caller = appRouter.createCaller(createMockContext());
    const result = await caller.pearlShop.getLatest();
    
    expect(result).toHaveProperty('items');
  });
});
```

---

## Logging Estruturado

```typescript
// src/core/logging/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    pid: false,
    hostname: false,
  },
});

// Usage
logger.info(
  { userId: user.id, action: 'login' },
  'Usuário fez login'
);

logger.error(
  { error, context: 'pearlShop' },
  'Falha ao buscar dados da loja'
);
```

---

## Monitoring & Observability

### Error Tracking
- [ ] Integrar Sentry para produção
- [ ] Implementar error boundary no React
- [ ] Log de stack traces completos

### Performance Monitoring
- [ ] Core Web Vitals tracking
- [ ] Database query performance
- [ ] API response time metrics

### Health Checks
```typescript
// src/server/routes/health.ts
export async function healthCheck(req, res) {
  const dbHealthy = await checkDatabase();
  const cacheHealthy = checkCache();
  
  res.status(dbHealthy && cacheHealthy ? 200 : 503).json({
    status: dbHealthy && cacheHealthy ? 'ok' : 'unhealthy',
    database: dbHealthy,
    cache: cacheHealthy,
  });
}
```

---

## Deployment

### Environment-specific Configuration
```typescript
// src/server/config.ts
export const config = {
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    cors: {
      origin: process.env.CORS_ORIGIN?.split(','),
      credentials: true,
    },
  },
  security: {
    jwtSecret: process.env.JWT_SECRET!,
    enableCSP: process.env.NODE_ENV === 'production',
  },
};
```

### Build Output
```bash
pnpm build
# Generates:
# - dist/client/  (React SPA)
# - dist/server/  (Express server)
# - dist/shared/  (Shared types)
```

---

*Arquitetura validada para escalabilidade, performance e manutenibilidade.*
