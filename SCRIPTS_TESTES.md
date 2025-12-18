# 📚 Guia de Scripts de Testes - Deck API

## 🎯 **Scripts Disponíveis**

### **Testes Unitários (Unit Tests)**

#### **Rodar testes unitários:**
```bash
pnpm test                # Roda apenas testes unitários (padrão)
pnpm test:unit           # Mesmo que acima (explícito)
```

**O que roda:**
- ✅ 236 testes unitários
- ✅ Arquivos: `**/*.spec.ts`
- ❌ Exclui: `**/*.integration.spec.ts`, `**/*.e2e-spec.ts`
- ⚡ Rápido (~4s)

---

#### **Watch mode (desenvolvimento):**
```bash
pnpm test:watch          # Assiste mudanças e re-roda testes
pnpm test:unit:watch     # Mesmo que acima (alias)
```

**Quando usar:**
- 🔧 Durante desenvolvimento
- 🐛 Debugging de testes
- ✍️ Escrevendo novos testes

---

#### **Com cobertura de código:**
```bash
pnpm test:unit:coverage  # Gera relatório de coverage
```

**O que gera:**
- 📊 Relatório HTML em `coverage/`
- 📈 Estatísticas no terminal
- 🎯 Identifica código não testado

---

### **Testes de Integração (Integration Tests)**

#### **Rodar testes de integração:**
```bash
pnpm test:integration    # Roda testes de integração com DB real
```

**Pré-requisitos:**
```bash
pnpm docker:dev          # Subir PostgreSQL antes!
```

**O que roda:**
- ✅ 46 testes de integração
- ✅ Arquivos: `**/*.integration.spec.ts`
- 🗄️ PostgreSQL real (Docker)
- ⏱️ Moderado (~2s com setup)

---

#### **Watch mode:**
```bash
pnpm test:integration:watch  # Assiste mudanças
```

**Atenção:**
- ⚠️ Requer banco rodando
- ⚠️ Mais lento que unit tests
- ⚠️ Setup/teardown automático

---

### **Testes E2E (End-to-End Tests)**

#### **Rodar testes E2E:**
```bash
pnpm test:e2e            # Roda testes E2E completos
```

**Pré-requisitos:**
```bash
pnpm docker:up           # Subir PostgreSQL E aplicação!
```

**O que roda:**
- ✅ 14 testes E2E (happy path)
- ✅ Arquivos: `**/*.e2e-spec.ts`
- 🌐 Aplicação completa rodando
- 🐌 Lento (~10-30s)

---

#### **Watch mode:**
```bash
pnpm test:e2e:watch      # Assiste mudanças
```

#### **UI interativa:**
```bash
pnpm test:e2e:ui         # Vitest UI para E2E
```

---

### **Rodar Todos os Testes**

#### **Sequencial (recomendado):**
```bash
pnpm test:all            # Unit → Integration → E2E
```

**Execução:**
1. ✅ 236 testes unitários
2. ✅ 46 testes integração
3. ✅ 14 testes E2E
4. **Total:** 296 testes

**Tempo estimado:** ~15-20s

---

#### **CI/CD (completo):**
```bash
pnpm test:ci             # Typecheck + Lint + Tests + Coverage
```

**Execução:**
1. ✅ TypeScript check
2. ✅ Biome lint
3. ✅ Unit tests com coverage
4. ✅ Integration tests
5. ✅ E2E tests

**Uso:** GitHub Actions, GitLab CI, etc.

---

## 🏗️ **Setup do Ambiente**

### **Primeira vez (setup completo):**
```bash
pnpm setup               # Instala deps + Docker + Migrations + Seed
```

**Equivalente a:**
```bash
pnpm install
pnpm docker:dev
pnpm db:migrate
pnpm db:seed
```

---

### **Apenas banco de dados:**

#### **Subir PostgreSQL (testes de integração):**
```bash
pnpm docker:dev          # Apenas PostgreSQL
```

#### **Subir tudo (testes E2E):**
```bash
pnpm docker:up           # PostgreSQL + Aplicação
```

#### **Parar containers:**
```bash
pnpm docker:down         # Para containers
pnpm docker:clean        # Para E remove volumes (reset completo)
```

---

## 📋 **Workflows Comuns**

### **1. Desenvolvimento de Feature:**
```bash
# Terminal 1 - Aplicação
pnpm dev

# Terminal 2 - Testes em watch
pnpm test:watch
```

---

### **2. Debugging de Teste:**
```bash
# Rodar teste específico
pnpm vitest run src/@core/domain/users/entities/user.spec.ts

# Watch mode para arquivo
pnpm vitest src/@core/domain/users/entities/user.spec.ts
```

---

### **3. Antes de Commit:**
```bash
# Checagens rápidas
pnpm typecheck           # TypeScript OK?
pnpm lint:check          # Biome OK?
pnpm test:unit           # Unit tests OK?

# OU tudo junto:
pnpm prebuild            # Roda typecheck + lint + test:unit
```

---

### **4. Antes de Push:**
```bash
# Garantir que tudo funciona
pnpm test:all            # Todos os testes
# OU
pnpm test:ci             # Simula CI completo
```

---

### **5. Testando Integração com DB:**
```bash
# 1. Subir banco
pnpm docker:dev

# 2. Rodar migrations (se necessário)
pnpm db:migrate

# 3. Rodar testes de integração
pnpm test:integration

# 4. Parar banco
pnpm docker:down
```

---

### **6. Reset Completo do Banco:**
```bash
pnpm db:reset            # Limpa + Migra + Seed
```

**Equivalente a:**
```bash
pnpm docker:clean
pnpm docker:dev
pnpm db:migrate
pnpm db:seed
```

---

## 🎨 **Configurações**

### **vitest.config.mjs (Unit Tests)**
```javascript
{
  include: ['**/*.spec.ts'],
  exclude: ['**/*.integration.spec.ts', '**/*.e2e-spec.ts'],
  globals: true,
  root: './',
}
```

### **vitest.config.integration.mjs**
```javascript
{
  include: ['**/*.integration.spec.ts'],
  setupFiles: ['./test/integration/setup-integration.ts'],
  fileParallelism: false,        // Sequencial
  testTimeout: 30000,            // 30s
}
```

### **vitest.config.e2e.mjs**
```javascript
{
  include: ['**/*.e2e-spec.ts'],
  setupFiles: ['./test/e2e/setup-e2e.ts'],
  fileParallelism: false,        // Sequencial
}
```

---

## 🚀 **Performance**

### **Tempos médios:**
| Tipo | Testes | Tempo | Requer DB? |
|------|--------|-------|------------|
| Unit | 236 | ~4s | ❌ Não |
| Integration | 46 | ~2s | ✅ Sim |
| E2E | 14 | ~10-30s | ✅ Sim + App |
| **Total** | **296** | **~15-20s** | ✅ Sim |

---

## 🐛 **Troubleshooting**

### **Problema: Testes de integração falhando**
```bash
# Verificar se banco está rodando
docker ps | grep postgres

# Se não estiver:
pnpm docker:dev

# Verificar conexão
pnpm db:studio
```

---

### **Problema: E2E falhando**
```bash
# Verificar se app está rodando
curl http://localhost:3000/api/health

# Se não estiver:
pnpm docker:up

# Logs da aplicação
pnpm docker:logs
```

---

### **Problema: Testes lentos**
```bash
# Limpar cache do Vitest
rm -rf node_modules/.vitest

# Re-instalar deps
pnpm install

# Rodar novamente
pnpm test
```

---

### **Problema: "Database already exists"**
```bash
# Reset completo
pnpm docker:clean
pnpm docker:dev
pnpm db:migrate
```

---

## 📊 **Estatísticas Atuais**

```
✅ 236 testes unitários (84%)
✅ 46 testes integração (16%)
✅ 14 testes E2E (5%)
━━━━━━━━━━━━━━━━━━━━━━━━
✅ 296 testes TOTAL
```

**Pirâmide de Testes:**
```
         ▲
        ▕▔▏   E2E (14) - 5%   ✅
       ▕▔▔▔▏
      ▕▔▔▔▔▔▏  Integration (46) - 16%
     ▕▔▔▔▔▔▔▔▏
    ▕▔▔▔▔▔▔▔▔▔▏
   ▕▔▔▔▔▔▔▔▔▔▔▔▏ Unit (236) - 84%
  ▕▔▔▔▔▔▔▔▔▔▔▔▔▔▏
```

---

## 💡 **Dicas**

### ✅ **Boas Práticas:**
1. **Sempre rode unit tests antes de commit** (`pnpm test:unit`)
2. **Use watch mode durante desenvolvimento** (`pnpm test:watch`)
3. **Rode test:all antes de push** (`pnpm test:all`)
4. **Use test:ci para validar build completo** (`pnpm test:ci`)

### ❌ **Evite:**
1. ❌ Rodar E2E sem necessidade (muito lentos)
2. ❌ Commitar sem rodar testes
3. ❌ Esquecer de subir o banco para integration tests
4. ❌ Rodar integration/e2e em watch mode (muito lento)

---

## 🔗 **Comandos Relacionados**

### **Qualidade de Código:**
```bash
pnpm typecheck           # Verificar tipos TypeScript
pnpm lint                # Corrigir problemas de lint
pnpm lint:check          # Apenas verificar (sem corrigir)
pnpm format              # Formatar código
pnpm check               # Lint + Format (corrige tudo)
```

### **Build:**
```bash
pnpm build               # Build de produção
pnpm prebuild            # Validações antes do build
```

### **Banco de Dados:**
```bash
pnpm db:generate         # Gerar migrations
pnpm db:migrate          # Aplicar migrations
pnpm db:push             # Push schema (dev only)
pnpm db:studio           # UI do Drizzle Studio
pnpm db:seed             # Popular banco com dados
pnpm db:setup            # Migra + Seed
pnpm db:reset            # Reset completo
```

---

## 📚 **Referências**

- [Vitest Docs](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)

---

**Última atualização:** 18 de Dezembro de 2024  
**Versão:** 1.0.0  
**Status:** ✅ Produção
