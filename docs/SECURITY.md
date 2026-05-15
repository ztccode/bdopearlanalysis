# 🔐 GUIA DE SEGURANÇA PROFISSIONAL

## Checklist de Segurança

### ✅ Implementação Obrigatória (Antes do Deploy)

- [ ] JWT Secret configurado com mínimo 32 caracteres
- [ ] HTTPS/TLS ativado em produção
- [ ] CORS corretamente configurado (não wildcard `*`)
- [ ] Helmet.js instalado e configurado
- [ ] Rate limiting ativado
- [ ] Database user com permissões mínimas
- [ ] Variáveis sensíveis em `.env` (nunca no código)
- [ ] Git secrets scanning habilitado

### 🔐 Autenticação & Autorização

#### JWT Implementation
```typescript
// src/server/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

export const authMiddleware = async ({
  ctx,
  next,
}: {
  ctx: any;
  next: () => Promise<any>;
}) => {
  const token = ctx.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    ctx.user = decoded;
    return next();
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
};
```

#### Role-Based Access Control (RBAC)
```typescript
// src/server/middleware/rbac.ts
export function requireRole(...roles: string[]) {
  return async ({ ctx, next }: any) => {
    if (!roles.includes(ctx.user?.role)) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return next();
  };
}

// Usage
export const adminProcedure = publicProcedure
  .use(authMiddleware)
  .use(requireRole('admin'));
```

### 🛡️ Input Validation & Sanitization

```typescript
// src/shared/schemas.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const sanitizeHtml = (html: string) => DOMPurify.sanitize(html);

export const CreateCommentSchema = z.object({
  text: z
    .string()
    .min(1)
    .max(500)
    .transform(sanitizeHtml),
  userId: z.string().uuid(),
});

// Server-side validation (don't trust client)
export const validateComment = (data: unknown) => {
  return CreateCommentSchema.parse(data);
};
```

### 🔒 SQL Injection Prevention

```typescript
// Use Drizzle ORM (parameterized queries automatically)
// ✅ SEGURO - Parameterized
export const getUser = async (id: string) => {
  return db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
};

// ❌ INSEGURO - Never do this
// db.query(`SELECT * FROM users WHERE id = '${id}'`);
```

### 🚫 XSS Prevention

```typescript
// React automatically escapes text content
// ✅ SEGURO
export function Comment({ text }: { text: string }) {
  return <div>{text}</div>; // Escaped automatically
}

// ❌ INSEGURO
export function UnsafeComment({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// ✅ SEGURO if you must use HTML
import DOMPurify from 'isomorphic-dompurify';
export function SafeHtml({ html }: { html: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html),
      }}
    />
  );
}
```

### 🔐 CSRF Protection

```typescript
// src/server/middleware/csrf.ts
import { doubleCsrfProtection } from 'csrf-csrf';

const { doubleCsrfMiddleware } = doubleCsrfProtection({
  getSecret: () => process.env.CSRF_SECRET!,
});

export const csrfMiddleware = doubleCsrfMiddleware;

// Client: Include CSRF token in form
<form action="/api/update" method="POST">
  <input type="hidden" name="_csrf" value={csrfToken} />
  {/* ... */}
</form>
```

### 🚀 Content Security Policy

```typescript
// src/server/middleware/csp.ts
import helmet from 'helmet';

export const cspMiddleware = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.example.com'],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
});
```

### 🔑 Secure Password Handling

```typescript
// src/server/utils/crypto.ts
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Usage in registration
export const register = publicProcedure
  .input(RegisterSchema)
  .mutation(async ({ input }) => {
    const hashedPassword = await hashPassword(input.password);
    return db.insert(users).values({
      email: input.email,
      passwordHash: hashedPassword,
    });
  });
```

### 🛑 Rate Limiting

```typescript
// src/server/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Muitas requisições desta IP, tente novamente mais tarde.'
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Strict limit on auth endpoints
  skipSuccessfulRequests: true,
});

// Usage
app.use('/api/', globalLimiter);
app.post('/api/auth/login', authLimiter, loginHandler);
```

### 📝 Secure Logging

```typescript
// src/core/logging/logger.ts
import pino from 'pino';

// Never log sensitive data
export const logger = pino({
  redact: {
    paths: [
      'password',
      'passwordHash',
      'token',
      'jwtToken',
      'creditCard',
      'ssn',
      'api_key',
      'req.headers.authorization',
    ],
    remove: true,
  },
});

// Usage
logger.info(
  { user: { id, email, password: 'REDACTED' } },
  'Usuário criado' // password field will be redacted
);
```

### 🔍 Dependency Vulnerability Scanning

```bash
# Check for known vulnerabilities
pnpm audit

# Update packages safely
pnpm update --interactive --latest

# GitHub automatic scanning
# Settings > Security > Dependabot
```

### 🌐 HTTPS/TLS Configuration

```typescript
// src/server/index.ts
if (process.env.NODE_ENV === 'production') {
  const https = require('https');
  const fs = require('fs');

  const httpsOptions = {
    key: fs.readFileSync('/etc/ssl/private/key.pem'),
    cert: fs.readFileSync('/etc/ssl/certs/cert.pem'),
  };

  https.createServer(httpsOptions, app).listen(443);
} else {
  app.listen(3000);
}
```

### 📋 Security Headers

```typescript
// src/server/middleware/headers.ts
import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});
```

---

## Práticas de Segurança em Desenvolvimento

### 1. Code Review
- Revisar mudanças de segurança com care
- Usar GitHub branch protection rules
- Require approval antes de merge

### 2. Environment Management
```bash
# ✅ CORRETO
export JWT_SECRET="$(openssl rand -base64 32)"

# ❌ ERRADO
const JWT_SECRET = 'my-secret-key'; // Commitado!

# ✅ CORRETO
// .env (gitignored)
JWT_SECRET=value_from_secret_manager
```

### 3. Secrets Management
```bash
# Use GitHub Secrets for CI/CD
# Settings > Secrets and Variables > Actions

# In workflow
env:
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### 4. Dependency Updates
```bash
# Regular updates
pnpm update --latest

# Audit before committing
pnpm audit --audit-level=moderate
```

---

## Incident Response Plan

### If credentials compromised:
1. Rotate immediately
2. Revoke affected tokens
3. Check audit logs for unauthorized access
4. Update all connected systems
5. Document incident

### If data breach:
1. Identify affected records
2. Notify users immediately
3. Enable 2FA requirement
4. Force password reset
5. Monitor for unusual activity

---

## Compliance & Standards

- ✅ OWASP Top 10
- ✅ CWE Top 25
- ✅ GDPR (data protection)
- ✅ SOC 2 principles

---

*Segurança é responsabilidade de todos. Code review, audit logs, and continuous monitoring são essenciais.*
