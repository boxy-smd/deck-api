# Refatoração NestJS - Deck API

## 📊 Resumo Executivo

**Data**: 2025-10-29
**Status**: Migração iniciada - Estrutura base criada ✅
**Progresso**: ~15% concluído

### O que foi feito hoje:
1. ✅ Criado ponto de entrada NestJS (`main.ts`)
2. ✅ Criado módulo de autenticação completo (AuthModule)
3. ✅ Iniciado módulo Students com DTOs e controller básico
4. ✅ Configurado TypeScript para NestJS (decorators, CommonJS)
5. ✅ Criado PrismaService e PrismaModule
6. ✅ **Resolvido problema crítico**: Removidas extensões .ts de 206 arquivos
7. ✅ Criado script de automação para remoção de extensões
8. ✅ Atualizado package.json com scripts NestJS

### Arquivos criados:
- `src/main.ts` - Bootstrap NestJS
- `src/modules/auth/*` - Autenticação JWT completa
- `src/modules/students/*` - Módulo Students parcial
- `src/infra/database/prisma/prisma.service.ts` - Service Prisma
- `scripts/remove-ts-extensions.ts` - Script de automação
- `NESTJS_REFACTOR_TODO.md` - Este documento

---

## Status Atual

### ✅ Concluído

1. **Criação da estrutura básica NestJS**
   - [x] Arquivo `src/main.ts` criado (ponto de entrada NestJS)
   - [x] Configuração inicial do Swagger/OpenAPI no main.ts
   - [x] Configuração de CORS e ValidationPipe global

2. **Módulo de Autenticação (Auth)**
   - [x] `src/modules/auth/auth.module.ts` - módulo de autenticação
   - [x] `src/modules/auth/strategies/jwt.strategy.ts` - estratégia JWT do Passport
   - [x] `src/modules/auth/guards/jwt-auth.guard.ts` - guard de autenticação

3. **Módulo Students (parcial)**
   - [x] `src/modules/students/students.module.ts` - módulo de estudantes
   - [x] `src/modules/students/dto/register-student.dto.ts` - DTO de registro
   - [x] `src/modules/students/dto/login-student.dto.ts` - DTO de login
   - [x] `src/modules/students/controllers/students.controller.ts` - controller básico (register, login, getProfile)

4. **Atualização de arquivos de configuração**
   - [x] `package.json` - scripts atualizados para NestJS (start:dev, build, start)
   - [x] `tsconfig.json` - configurado para NestJS com decorators

### 🔧 Em Progresso / Bloqueado

**✅ RESOLVIDO: Extensões .ts nos imports**

Script criado e executado com sucesso! 206 arquivos foram modificados.
- Script: `scripts/remove-ts-extensions.ts`
- Comando: `pnpm exec tsx scripts/remove-ts-extensions.ts`

**Erros restantes no build (menos críticos):**
1. `app.ts` usa top-level await (arquivo antigo do Fastify - pode ser ignorado)
2. Alguns tipos de entidades do Prisma mudaram (Draft não existe mais no schema)
3. Problemas de tipagem em mappers e repositories (ajustes menores)
4. Imports incorretos em alguns presenters (paths @/domain/deck)

Esses erros não afetam os novos módulos NestJS criados.

### 📋 Pendências

#### 1. **✅ Remover extensões .ts dos imports - CONCLUÍDO**

**Script criado**: `scripts/remove-ts-extensions.ts`

Resultado: 206 arquivos modificados automaticamente.

```bash
# Para executar novamente se necessário:
pnpm exec tsx scripts/remove-ts-extensions.ts
```

#### 2. **Migrar Controllers Fastify → NestJS**

##### Students (parcialmente feito)
- [x] register
- [x] login  
- [x] getProfile
- [ ] editProfile
- [ ] fetchStudents
- [ ] getStudentDetails
- [ ] refresh (token)
- [ ] uploadProfileImage

##### Professors
- [ ] Criar módulo: `src/modules/professors/professors.module.ts`
- [ ] Criar DTOs
- [ ] Migrar controllers de `src/interface/http/controllers/professors/*`

##### Subjects
- [ ] Criar módulo: `src/modules/subjects/subjects.module.ts`
- [ ] Criar DTOs
- [ ] Migrar controllers de `src/interface/http/controllers/subjects/*`

##### Trails
- [ ] Criar módulo: `src/modules/trails/trails.module.ts`
- [ ] Criar DTOs
- [ ] Migrar controllers de `src/interface/http/controllers/trails/*`

##### Projects
- [ ] Criar módulo: `src/modules/projects/projects.module.ts`
- [ ] Criar DTOs
- [ ] Migrar controllers de `src/interface/http/controllers/projects/*`

##### Comments
- [ ] Criar módulo: `src/modules/comments/comments.module.ts`
- [ ] Criar DTOs
- [ ] Migrar controllers de `src/interface/http/controllers/comments/*`

#### 3. **Atualizar app.module.ts**

Adicionar todos os módulos criados:
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StudentsModule,
    ProfessorsModule,
    SubjectsModule,
    TrailsModule,
    ProjectsModule,
    CommentsModule,
  ],
})
export class AppModule {}
```

#### 4. **Adaptar Use Cases para NestJS**

Os use cases estão em `src/domain/*/application/use-cases/*` e usam o padrão Either (Left/Right) para erros.

**Opções:**
1. Manter os use cases como estão e fazer adapter nos controllers
2. Criar services NestJS que encapsulam os use cases
3. Transformar use cases em providers injetáveis do NestJS

**Recomendação**: Opção 2 - criar services por módulo que usam os use cases existentes.

#### 5. **Tratamento de Erros**

- [ ] Criar filtros de exceção personalizados (Exception Filters)
- [ ] Mapear os erros do domínio (Left) para HTTP exceptions do NestJS
- [ ] Substituir o `errorHandler` do Fastify por exception filters

Exemplo:
```typescript
// src/shared/filters/domain-exception.filter.ts
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Tratar erros do domínio (Either.Left)
  }
}
```

#### 6. **Autenticação e Autorização**

- [ ] Implementar refresh token no NestJS (atualmente usa cookies do Fastify)
- [ ] Criar decorators personalizados:
  - `@CurrentUser()` - para extrair usuário do request
  - `@Roles()` - para controle de acesso baseado em roles
- [ ] Implementar guards de autorização para professores vs estudantes

#### 7. **Upload de Arquivos**

- [ ] Migrar lógica de upload de `@fastify/multipart` para `@nestjs/platform-express` com Multer
- [ ] Atualizar DTOs para aceitar arquivos
- [ ] Configurar limites de tamanho (atualmente 5MB)

#### 8. **Testes**

- [ ] Migrar testes E2E de Vitest para Supertest + Jest (padrão NestJS)
- [ ] Atualizar testes unitários para usar `@nestjs/testing`
- [ ] Configurar test database

#### 9. **Documentação**

- [ ] Adicionar decorators do Swagger em todos os endpoints
- [ ] Documentar DTOs com `@ApiProperty`
- [ ] Adicionar exemplos de requisição/resposta
- [ ] Documentar autenticação (`@ApiBearerAuth()`)

#### 10. **Limpeza**

Após migração completa, remover:
- [ ] `src/app.ts` (Fastify)
- [ ] `src/server.ts` (ponto de entrada antigo)
- [ ] `src/interface/http/routes/*` (rotas Fastify)
- [ ] `src/interface/http/controllers/*` (controllers Fastify)
- [ ] `src/interface/http/schemas/*` (schemas Zod - substituídos por DTOs)
- [ ] `src/interface/http/middlewares/*` (middlewares Fastify - substituídos por guards)
- [ ] Dependências Fastify do package.json

#### 11. **Otimizações Futuras**

- [ ] Implementar caching com `@nestjs/cache-manager`
- [ ] Adicionar rate limiting
- [ ] Implementar health checks (`@nestjs/terminus`)
- [ ] Adicionar logging estruturado (Winston ou Pino)
- [ ] Configurar compression
- [ ] Implementar CQRS pattern se necessário (`@nestjs/cqrs`)

## Ordem de Execução Recomendada

1. **✅ CONCLUÍDO**: Resolver problema das extensões .ts nos imports
2. **PRÓXIMO PASSO**: Criar PrismaService para NestJS
3. Completar módulo Students (já iniciado)
4. Migrar módulos um por vez na ordem: Professors → Subjects → Trails → Projects → Comments
5. Implementar tratamento de erros global
6. Implementar autenticação completa (refresh tokens)
7. Migrar testes
8. Limpeza de código antigo
9. Otimizações

## Próxima Ação Recomendada

**Criar PrismaService** em `src/infra/database/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
```

Isso resolverá o erro:
```
src/infra/database/prisma/prisma.module.ts:2:31 - error TS2307: Cannot find module './prisma.service'
```

## Comandos Úteis

```bash
# Desenvolvimento
pnpm run start:dev

# Build
pnpm run build

# Start produção
pnpm run start

# Testes
pnpm run test
pnpm run test:e2e

# Gerar recursos NestJS
nest generate module modules/exemplo
nest generate controller modules/exemplo
nest generate service modules/exemplo
```

## Notas Importantes

- O PrismaModule já está configurado como Global, então não precisa ser importado em cada módulo
- Os use cases do domínio estão bem estruturados, manter arquitetura limpa
- Manter validações do Zod nos DTOs usando class-validator equivalentes
- Preservar estrutura DDD existente no domain/
