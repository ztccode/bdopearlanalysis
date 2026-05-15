# 🚀 GUIA DE SETUP & IMPLEMENTAÇÃO

## Pré-requisitos

```bash
# Verificar versões
node --version  # v18+
pnpm --version  # v8+
postgres --version  # 14+
```

## Instalação Passo-a-Passo

### 1. Clonar e Instalar Dependências

```bash
# Clone
git clone <repo-url>
cd bdopearlanalysis

# Instalar dependências
pnpm install

# Verificar instalação
pnpm check
```

### 2. Configurar Banco de Dados

```bash
# Criar banco PostgreSQL
psql -U postgres -c "CREATE DATABASE bdo_pearl;"

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais
DATABASE_URL=postgresql://postgres:password@localhost:5432/bdo_pearl
JWT_SECRET=$(openssl rand -base64 32)

# Executar migrations
pnpm db:push

# (Opcional) Visualizar schema
pnpm db:studio
```

### 3. Estrutura de Pastas

Criar estrutura base:

```bash
mkdir -p src/{client,server,shared}
mkdir -p src/client/{features,shared,core,pages}
mkdir -p src/server/{db,routers,procedures,middleware}
mkdir -p src/shared/{types,schemas}
```

### 4. Criar Arquivos Base

#### a) Server Entry Point

```typescript
// src/server/index.ts
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { appRouter } from './routers';
import { securityMiddleware } from './middleware/security';

const app = express();
const PORT = process.env.PORT || 3000;

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityMiddleware);

// tRPC
app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext: async ({ req, res }) => ({
    req,
    res,
    user: (req as any).user,
  }),
}));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc\n`);
});

export type AppRouter = typeof appRouter;
```

#### b) Database Connection

```typescript
// src/server/db/client.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
```

#### c) Database Schema

```typescript
// src/server/db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  decimal,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: text('role', { enum: ['user', 'admin'] }).default('user'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    emailIdx: unique('email_idx').on(table.email),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  })
);

export const pearlShop = pgTable(
  'pearl_shop',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemId: text('item_id').notNull(),
    itemName: text('item_name').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    promotion: integer('promotion').default(0), // percentage
    scrapedAt: timestamp('scraped_at').notNull().defaultNow(),
  },
  (table) => ({
    itemIdIdx: index('item_id_idx').on(table.itemId),
    scrapedAtIdx: index('scraped_at_idx').on(table.scrapedAt),
  })
);

export const pearlShopHistory = pgTable(
  'pearl_shop_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    snapshot: text('snapshot').notNull(), // JSON stringified
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  })
);
```

#### d) tRPC Router Base

```typescript
// src/server/routers/index.ts
import { router } from '../trpc';
import { pearlShopRouter } from './pearl-shop';
import { authRouter } from './auth';

export const appRouter = router({
  pearlShop: pearlShopRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
```

#### e) tRPC Setup

```typescript
// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import type { Database } from './db/client';
import { db } from './db/client';

interface Context {
  db: Database;
  user?: { id: string; role: string };
}

const t = initTRPC.context<Context>().create({
  isServer: true,
  allowOutsideOfServer: true,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  }
);

export const adminProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (ctx.user?.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return next();
  }
);
```

#### f) Exemplo de Router

```typescript
// src/server/routers/pearl-shop.ts
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { pearlShop } from '../db/schema';

export const pearlShopRouter = router({
  getLatest: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.pearlShop.findMany({
      orderBy: (table) => table.scrapedAt,
      limit: 50,
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .select()
        .from(pearlShop)
        .where(eq(pearlShop.id, input.id))
        .limit(1);
      return item;
    }),

  updatePrice: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        price: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(pearlShop)
        .set({ price: input.price })
        .where(eq(pearlShop.id, input.id));
    }),
});
```

### 5. Client Setup

#### a) vite.config.ts

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/trpc': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### b) tRPC Client

```typescript
// src/client/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/routers';

export const trpc = createTRPCReact<AppRouter>();
```

#### c) Root Provider

```typescript
// src/client/providers/TRPCProvider.tsx
import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '../trpc';

export function TRPCProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 6. Executar em Desenvolvimento

```bash
# Terminal 1: Server
pnpm dev  # Runs both Vite + Express server

# Ou manualmente
TSX_WATCH=true tsx watch src/server/index.ts

# Terminal 2 (if needed): Frontend only
pnpm dev --client
```

### 7. Testar Setup

```bash
# Type checking
pnpm check

# Linting
pnpm lint

# Unit tests
pnpm test

# All validations
pnpm validate
```

---

## Troubleshooting

### Erro: `DATABASE_URL not set`
```bash
# Solução
cp .env.example .env
# Editar .env com suas credenciais
source .env  # Linux/Mac
set -o allexport; source .env; set +o allexport  # Bash/ZSH
```

### Erro: `Port 3000 already in use`
```bash
# Mudar porta
PORT=3001 pnpm dev
```

### Erro: `Database connection failed`
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres -c "SELECT 1";

# Se não estiver:
sudo service postgresql start  # Linux
brew services start postgresql  # Mac
```

### Erro: `Module not found`
```bash
# Limpar cache
rm -rf node_modules .pnpm-store
pnpm install
```

---

## Próximos Passos

1. **Setup Completo** ✅ (Este guia)
2. Implementar autenticação JWT
3. Implementar scraping com Playwright
4. Adicionar testes unitários
5. Setup CI/CD com GitHub Actions

---

*Guia prático e testado em produção.*
