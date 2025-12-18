# 📋 Organização do Projeto - Deck API

Este documento descreve a organização de scripts, pipelines e ambiente de desenvolvimento após a migração de Prisma para Drizzle ORM.

## 🎯 Stack Tecnológica

### Backend
- **NestJS** - Framework progressivo para Node.js
- **TypeScript** - Linguagem tipada
- **Drizzle ORM** - ORM moderno e performático
- **PostgreSQL** - Banco de dados relacional

### Testes
- **Vitest** - Framework de testes moderno e rápido
- **Supertest** - Testes E2E de APIs REST

### Code Quality
- **Biome** - Linter e formatador unificado
- **TypeScript Compiler** - Verificação de tipos

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
pnpm dev              # Servidor de desenvolvimento com hot-reload
pnpm dev:debug        # Servidor com debugger habilitado
pnpm build            # Build de produção
pnpm start            # Iniciar aplicação compilada
```

### Code Quality
```bash
pnpm typecheck        # Type checking TypeScript
pnpm check            # Lint + format (auto-fix)
pnpm lint             # Executar linter com auto-fix
pnpm lint:check       # Verificar lint sem modificar
pnpm format           # Formatar código
pnpm format:check     # Verificar formatação
```

### Testes
```bash
pnpm test             # Unit tests
pnpm test:watch       # Unit tests em watch mode
pnpm test:unit        # Unit tests com coverage
pnpm test:e2e         # E2E tests
pnpm test:e2e:watch   # E2E tests em watch mode
pnpm test:e2e:ui      # E2E tests com interface Vitest UI
pnpm test:all         # Todos os testes (unit + e2e)
pnpm test:ci          # Pipeline completa para CI/CD
```

### Database (Drizzle ORM)
```bash
pnpm db:generate      # Gerar migrations do Drizzle
pnpm db:migrate       # Aplicar migrations
pnpm db:push          # Push schema direto (dev only, não recomendado para produção)
pnpm db:seed          # Popular banco de dados
pnpm db:studio        # Abrir Drizzle Studio (GUI para explorar dados)
pnpm db:setup         # Migrate + Seed (setup completo)
pnpm db:reset         # Reset completo (limpar Docker + setup)
```

### Docker
```bash
pnpm docker:dev       # Subir apenas PostgreSQL para desenvolvimento
pnpm docker:up        # Subir todos os serviços
pnpm docker:down      # Parar serviços
pnpm docker:logs      # Ver logs dos containers
pnpm docker:clean     # Parar e remover volumes (limpar dados)
```

### Setup & Utilities
```bash
pnpm setup            # Setup completo: install + docker + database
pnpm clean            # Limpar build artifacts e node_modules
```

## 🔄 Workflow de Desenvolvimento

### Setup Inicial

#### Opção 1: Script Automático (Recomendado)
```bash
pnpm setup
```

#### Opção 2: Manual
```bash
pnpm install
pnpm docker:dev
pnpm db:setup
pnpm dev
```

### Desenvolvimento Diário

```bash
# Terminal 1: Servidor de desenvolvimento
pnpm dev

# Terminal 2: Drizzle Studio (opcional - GUI para explorar DB)
pnpm db:studio

# Terminal 3: Testes em watch mode (opcional)
pnpm test:watch
```

### Trabalhando com Database

#### Criar nova tabela ou alterar schema
```bash
# 1. Edite src/@infra/database/drizzle/schema.ts
# 2. Gere a migration
pnpm db:generate

# 3. Revise a migration em ./drizzle
# 4. Aplique a migration
pnpm db:migrate
```

#### Reset do banco de dados
```bash
pnpm db:reset
```

### Antes de Commitar

```bash
# Verificar tudo localmente
pnpm typecheck          # Verificar tipos
pnpm lint:check         # Verificar lint
pnpm test:all           # Rodar todos os testes
```

Ou use o comando CI para rodar tudo de uma vez:
```bash
pnpm test:ci
```

## 🧪 Testes

### Testes Unitários
- Localizados em `src/**/*.spec.ts`
- Testam lógica de negócio isolada
- Não dependem de banco de dados ou servidor HTTP
- Usam mocks para dependências externas

```bash
pnpm test              # Rodar uma vez
pnpm test:watch        # Watch mode
pnpm test:unit         # Com coverage
```

### Testes E2E
- Localizados em `test/e2e/**/*.e2e-spec.ts`
- Testam fluxos completos da API
- Usam banco de dados real (PostgreSQL)
- Testam autenticação, validação, persistência, etc.

```bash
pnpm test:e2e          # Rodar todos os E2E
pnpm test:e2e:watch    # Watch mode
pnpm test:e2e:ui       # Com interface Vitest UI
```

#### Estrutura dos Testes E2E
```
test/e2e/
├── setup-e2e.ts                      # Setup global (cria app NestJS)
├── database-utils.ts                 # Utilitários para limpar DB
├── helpers/
│   ├── drizzle.helper.ts            # Obter instância Drizzle
│   ├── fixtures.helper.ts           # Dados de seed para testes
│   └── test-app.helper.ts           # Criar app de teste
├── students.e2e-spec.ts             # Testes de estudantes
├── projects.e2e-spec.ts             # Testes de projetos
├── comments.e2e-spec.ts             # Testes de comentários
├── professors.e2e-spec.ts           # Testes de professores
├── subjects.e2e-spec.ts             # Testes de disciplinas
└── trails.e2e-spec.ts               # Testes de trilhas
```

## 🗂️ Estrutura do Projeto

```
deck-api/
├── src/
│   ├── @core/                       # Domain + Application (Clean Architecture)
│   │   ├── domain/                  # Entidades, Value Objects
│   │   └── application/             # Use Cases, Interfaces
│   ├── @infra/                      # Infraestrutura
│   │   ├── config/                  # Configurações
│   │   ├── cryptography/            # Implementação de hash/criptografia
│   │   └── database/
│   │       └── drizzle/             # Drizzle ORM
│   │           ├── schema.ts        # Schema do banco (tabelas, relations)
│   │           ├── migrate.ts       # Script de migrations
│   │           ├── seed.ts          # Script de seed
│   │           ├── drizzle.module.ts
│   │           ├── drizzle.provider.ts
│   │           ├── mappers/         # Mapeadores Entity ↔ DB
│   │           └── repositories/    # Implementação de repositórios
│   ├── @presentation/               # Controllers, DTOs
│   └── @shared/                     # Código compartilhado
├── test/
│   ├── e2e/                         # Testes E2E
│   ├── factories/                   # Factories para testes
│   ├── repositories/                # In-memory repositories
│   └── use-cases/                   # Helpers para testes de use cases
├── drizzle/                         # Migrations geradas
├── scripts/                         # Scripts utilitários
├── .env                             # Variáveis de ambiente (local)
├── .env.example                     # Template de variáveis
├── .env.test                        # Variáveis para testes
├── drizzle.config.ts                # Configuração do Drizzle Kit
├── vitest.config.mjs                # Config testes unitários
├── vitest.config.e2e.mjs            # Config testes E2E
└── docker-compose.yml               # Orquestração Docker
```

## 🔒 Variáveis de Ambiente

### Arquivo `.env` (Development)
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/deck"

# JWT
JWT_SECRET="seu-secret-aqui"

# Firebase (opcional)
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
```

### Arquivo `.env.test` (Tests)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/deck_test"
JWT_SECRET="test-secret"
NODE_ENV="test"
```

## 🐳 Docker

### Desenvolvimento Local
```bash
# Subir apenas PostgreSQL
pnpm docker:dev

# Ver logs
pnpm docker:logs

# Parar
pnpm docker:down

# Limpar volumes (reset completo)
pnpm docker:clean
```

### Produção
```bash
# Build e start todos os serviços
pnpm docker:up
```

## 📊 Migração de Prisma para Drizzle

### ✅ Concluído
- [x] Schema convertido para Drizzle
- [x] Migrations geradas
- [x] Repositórios migrados
- [x] Mappers atualizados
- [x] Testes E2E funcionando
- [x] Seeds atualizados
- [x] Arquivos Prisma removidos
- [x] Scripts organizados

### Principais Diferenças

#### Schema
**Prisma:**
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())
}
```

**Drizzle:**
```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').unique().notNull(),
  createdAt: timestamp('created_at').notNull(),
})
```

#### Queries
**Prisma:**
```typescript
await prisma.user.findUnique({ where: { id } })
```

**Drizzle:**
```typescript
await db.query.users.findFirst({ where: eq(users.id, id) })
```

## 🚀 CI/CD Pipeline

### Testes Automatizados
- Lint e formatação
- Type checking
- Testes unitários com coverage
- Testes E2E
- Build verification

### Comandos CI
```bash
pnpm test:ci    # Roda toda a pipeline localmente
```

## 📚 Recursos Úteis

### Documentação
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [NestJS Docs](https://docs.nestjs.com)
- [Vitest Docs](https://vitest.dev)

### Ferramentas
- **Drizzle Studio**: GUI para explorar banco de dados (`pnpm db:studio`)
- **Vitest UI**: Interface visual para testes (`pnpm test:e2e:ui`)
- **Docker Desktop**: Gerenciar containers

---

**Última atualização:** 18/12/2024  
**Status:** ✅ Migração para Drizzle completa
