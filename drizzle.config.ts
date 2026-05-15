import type { Config } from 'drizzle-kit';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL não está configurada');
}

export default {
  schema: './src/server/db/schema.ts',
  out: './src/server/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: dbUrl,
  },
  migrations: {
    prefix: 'timestamp',
  },
} satisfies Config;
