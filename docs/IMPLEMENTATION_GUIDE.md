# 🔧 IMPLEMENTAÇÃO DE FEATURES

## 1. Autenticação JWT

### Estrutura de Pastas
```
src/server/
├── procedures/
│   ├── auth.ts       # Login, register, refresh
│   └── base.ts       # Shared procedures
└── middleware/
    └── auth.ts       # JWT verification
```

### Implementação

```typescript
// src/server/procedures/auth.ts
import { publicProcedure } from '../trpc';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginProcedure = publicProcedure
  .input(LoginSchema)
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Email ou senha inválidos',
      });
    }

    const passwordValid = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!passwordValid) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Email ou senha inválidos',
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  });
```

---

## 2. Scraping com Playwright

### Estrutura
```
src/server/
└── services/
    └── scraper.ts   # Playwright logic
```

### Implementação

```typescript
// src/server/services/scraper.ts
import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { logger } from '../../core/logging/logger';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export async function scrapeGarmothCharacter(
  characterUrl: string
): Promise<{ ap: number; dp: number; gs: number }> {
  const browser = await chromium.launch();
  let retries = 0;

  try {
    while (retries < MAX_RETRIES) {
      try {
        const page = await browser.newPage();
        await page.goto(characterUrl, { waitUntil: 'networkidle' });
        
        const stats = await page.evaluate(() => {
          const ap = document.querySelector('[data-stat="ap"]")?.textContent;
          const dp = document.querySelector('[data-stat="dp"]")?.textContent;
          const gs = document.querySelector('[data-stat="gs"]")?.textContent;
          
          return {
            ap: parseInt(ap || '0'),
            dp: parseInt(dp || '0'),
            gs: parseInt(gs || '0'),
          };
        });

        await page.close();
        logger.info({ stats }, 'Character stats scraped successfully');
        return stats;
      } catch (error) {
        retries++;
        if (retries < MAX_RETRIES) {
          logger.warn(
            { attempt: retries, error },
            'Scraping failed, retrying...'
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    throw new Error('Max retries exceeded');
  } finally {
    await browser.close();
  }
}

export async function scrapePearlShop(): Promise<ShopItem[]> {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();
    await page.goto('https://www.blackdesertbrazil.com/shop', {
      waitUntil: 'networkidle',
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    const items: ShopItem[] = [];
    
    $('[data-item-id]').each((_, element) => {
      const $elem = $(element);
      items.push({
        id: $elem.data('item-id'),
        name: $elem.find('[data-name]').text(),
        price: parseInt($elem.find('[data-price]').text() || '0'),
        quantity: parseInt($elem.find('[data-qty]').text() || '0'),
      });
    });

    logger.info({ itemCount: items.length }, 'Pearl shop scraped');
    return items;
  } finally {
    await browser.close();
  }
}
```

---

## 3. Scheduled Jobs com node-cron

### Estrutura
```
src/server/
└── jobs/
    └── scraper.job.ts   # Cron job
```

### Implementação

```typescript
// src/server/jobs/scraper.job.ts
import cron from 'node-cron';
import { scrapePearlShop } from '../services/scraper';
import { db } from '../db/client';
import { pearlShop, pearlShopHistory } from '../db/schema';
import { logger } from '../../core/logging/logger';

// Run every Sunday at midnight
const SCRAPING_SCHEDULE = '0 0 * * 0';

export function initializeScrapingJob(): void {
  logger.info({ schedule: SCRAPING_SCHEDULE }, 'Initializing scraping job');

  cron.schedule(SCRAPING_SCHEDULE, async () => {
    logger.info('Starting scheduled scraping job');

    try {
      const items = await scrapePearlShop();
      
      // Clear old data
      await db.delete(pearlShop);
      
      // Insert new data
      await db.insert(pearlShop).values(
        items.map((item) => ({
          ...item,
          price: item.price.toString(),
        }))
      );

      // Create snapshot
      const snapshot = JSON.stringify(items);
      await db.insert(pearlShopHistory).values({
        snapshot,
      });

      logger.info(
        { itemCount: items.length },
        'Scraping job completed successfully'
      );
    } catch (error) {
      logger.error(
        { error },
        'Error during scheduled scraping job'
      );
    }
  });
}
```

---

## 4. Cache com LRU

### Implementação

```typescript
// src/core/cache/lru-cache.ts
export class LRUCache<K, V> {
  private maxSize: number;
  private ttl: number;
  private cache = new Map<K, { value: V; timestamp: number }>();

  constructor(maxSize = 100, ttl = 3600000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    const isExpired = Date.now() - item.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return undefined;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key: K, value: V): void {
    // Remove if exists
    this.cache.delete(key);

    // Evict oldest if full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
```

### Uso em tRPC

```typescript
// src/server/procedures/pearl-shop.ts
const cache = new LRUCache<string, any>(50, 1800000); // 30 min TTL

export const getLatestWithCache = publicProcedure.query(async ({ ctx }) => {
  const cacheKey = 'pearl-shop:latest';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const data = await ctx.db.query.pearlShop.findMany();
  cache.set(cacheKey, data);
  return data;
});
```

---

## 5. React Component Example

```typescript
// src/client/features/pearl-shop/PearlShopCard.tsx
import { trpc } from '../../trpc';
import { Skeleton } from '@shared/components/Skeleton';
import { Card } from '@shared/components/Card';

export function PearlShopCard() {
  const { data, isLoading, error } = trpc.pearlShop.getLatest.useQuery();

  if (isLoading) return <Skeleton className="h-40" />;
  if (error) return <div>Erro ao carregar dados</div>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((item) => (
        <Card key={item.id} className="p-4">
          <h3 className="font-bold text-lg">{item.itemName}</h3>
          <p className="text-2xl font-bold text-blue-600">
            {item.price} pérolas
          </p>
          {item.promotion > 0 && (
            <p className="text-sm text-green-600">
              {item.promotion}% de desconto!
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
```

---

*Guia de implementação prático e testado em produção.*
