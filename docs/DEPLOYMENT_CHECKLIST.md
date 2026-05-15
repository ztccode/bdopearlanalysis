# 📋 CHECKLIST PRÉ-DEPLOY

## 📊 Validação de Código

- [ ] `pnpm type-check` passa sem erros
- [ ] `pnpm lint` passa sem warnings
- [ ] `pnpm test` com cobertura 80%+
- [ ] `pnpm build` compila sem erros
- [ ] Nenhum `console.log()` em produção
- [ ] Nenhum `TODO` não resolvido
- [ ] Nenhuma dependência vulnerável (`pnpm audit`)

## 🔐 Segurança

- [ ] JWT_SECRET configurado (min 32 chars)
- [ ] CORS corretamente restrito
- [ ] Rate limiting ativado
- [ ] Helmet.js configurado
- [ ] SQL injection prevention (Drizzle ORM)
- [ ] XSS protection (React escape)
- [ ] CSRF tokens implementados
- [ ] Password hashing com bcrypt
- [ ] Variáveis sensíveis em .env
- [ ] Git secrets scanning ativado

## 📯 Documentação

- [ ] README.md atualizado
- [ ] API documentation completa
- [ ] Database schema documentado
- [ ] Deployment guide escrito
- [ ] Contributing guide escrito
- [ ] Changelog atualizado

## 🗓️ Configuração

- [ ] .env.example sincronizado
- [ ] tsconfig.json validado
- [ ] vitest.config.ts pronto
- [ ] eslint.config.js ativo
- [ ] drizzle.config.ts configurado
- [ ] vite.config.ts otimizado

## 📍 Database

- [ ] Migrations executadas
- [ ] Backups configurados
- [ ] Connection pooling ativado
- [ ] Indexes criados
- [ ] Constraints validados
- [ ] Data sensível criptografada

## 🚀 Performance

- [ ] Core Web Vitals checados
- [ ] Bundle size otimizado
- [ ] Code splitting configurado
- [ ] Cache strategy implementada
- [ ] Database queries otimizadas
- [ ] Images comprimidas
- [ ] Lighthouse score A+

## 🌐 Infra & DevOps

- [ ] GitHub Actions workflow criado
- [ ] Secrets configurados no GitHub
- [ ] Docker image testada
- [ ] Environment variables para prod
- [ ] Logging strategy definida
- [ ] Monitoring alerts configurados
- [ ] Health check endpoint testado

## 🧖 Testes

- [ ] Unit tests escritos
- [ ] Integration tests escritos
- [ ] E2E tests em staging
- [ ] Error scenarios testados
- [ ] Load testing executado
- [ ] Security scanning feito

## 🚘 Staging Environment

- [ ] Deploy em staging testado
- [ ] Smoke tests passando
- [ ] Performance aceitável
- [ ] Nenhum error logging
- [ ] SSL/TLS funcionando
- [ ] CORS validado

## 🚀 Deployment

- [ ] Rollback plan documentado
- [ ] Database migration plan
- [ ] Canary deployment strategy
- [ ] Monitoring durante deploy
- [ ] Communication plan com usuários
- [ ] Post-deploy validation checklist

## 📄 Pós-Deploy

- [ ] Verificar logs em produção
- [ ] Testar funcionalidades críticas
- [ ] Monitorar performance
- [ ] Verificar alertas
- [ ] Validar integração
- [ ] Comunicar status aos stakeholders

---

## 🎯 Comando para Validação Completa

```bash
# Execute antes de fazer deploy
pnpm validate && pnpm test:coverage && pnpm build && npm audit

# Se tudo passar, você está pronto para deploy!
echo "✅ Projeto validado e pronto para produção!"
```

---

*Use este checklist rigorosamente. Produção exige qualidade.*
