# 🎯 Próximos Passos - Deck API

**Data**: 30 de Outubro de 2025  
**Status Atual**: Migração NestJS completa, camada de domínio melhorada

---

## ✅ Status Atual

### Concluído
- ✅ **Migração NestJS**: 100% (21 endpoints)
- ✅ **Limpeza de código legacy**: 100%
- ✅ **Melhorias da camada de domínio**: 100%
- ✅ **Value Objects padronizados**: CommentWithAuthor, StudentProfileWithDetails
- ✅ **DTOs validados**: FilterPostsDto, RegisterStudentDto, etc
- ✅ **Testes unitários**: 56 testes passando
- ✅ **Infraestrutura Prisma**: Tipada sem uso de `any`

### Problemas Atuais
- ⚠️ **Testes E2E com erros de importação**: Necessitam ajustes
- ⚠️ **Falta padronização de paginação**: Cada endpoint implementa diferente
- ⚠️ **Strategy Pattern pendente**: Busca de projetos ainda não usa

---

## 📋 Próximos Passos Prioritários

### 1. Criar Paginação Padronizada no @shared ⭐ ALTA PRIORIDADE

**Objetivo**: Criar classes/tipos reutilizáveis para paginação em todo o projeto.

**Arquivos a criar**:
```
src/@shared/kernel/pagination/
├── page-info.ts          # Informações da página
├── paginated-result.ts   # Resultado paginado genérico
└── pagination-params.ts  # Parâmetros de paginação
```

**Estrutura sugerida**:

```typescript
// pagination-params.ts
export interface PaginationParams {
  page: number
  limit: number
}

export class PaginationParamsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20
}

// page-info.ts
export interface PageInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// paginated-result.ts
export class PaginatedResult<T> extends ValueObject {
  private constructor(
    private readonly _items: T[],
    private readonly _pageInfo: PageInfo,
  ) {
    super()
  }

  static create<T>(items: T[], pageInfo: PageInfo): PaginatedResult<T> {
    return new PaginatedResult(items, pageInfo)
  }

  get items(): T[] {
    return this._items
  }

  get pageInfo(): PageInfo {
    return this._pageInfo
  }

  toDTO() {
    return {
      items: this._items,
      pageInfo: this._pageInfo,
    }
  }
}
```

**Impacto**:
- Padroniza paginação em todos os endpoints
- Facilita manutenção futura
- Melhora documentação Swagger
- **Estimativa**: 2-3 horas

---

### 2. Implementar Strategy Pattern para Busca de Projetos ⭐ ALTA PRIORIDADE

**Objetivo**: Refatorar `FetchPostsUseCase` para usar Strategy Pattern e remover lógica condicional complexa.

**Arquivos a criar**:
```
src/@core/domain/projects/application/use-cases/fetch-posts/
├── fetch-posts.ts                    # Use case principal
├── search-strategy.interface.ts      # Interface da estratégia
└── strategies/
    ├── search-by-title.strategy.ts
    ├── search-by-professor.strategy.ts
    ├── search-by-tag.strategy.ts
    └── search-by-filters.strategy.ts
```

**Estrutura sugerida**:

```typescript
// search-strategy.interface.ts
export interface SearchStrategy {
  canHandle(query: SearchQuery): boolean
  execute(query: SearchQuery): Promise<ProjectDTO[]>
}

// fetch-posts.ts
export class FetchPostsUseCase {
  private strategies: SearchStrategy[]

  constructor(
    private projectsRepository: ProjectsRepository,
  ) {
    this.strategies = [
      new SearchByTitleStrategy(projectsRepository),
      new SearchByProfessorStrategy(projectsRepository),
      new SearchByTagStrategy(projectsRepository),
      new SearchByFiltersStrategy(projectsRepository),
    ]
  }

  async execute(query: SearchQuery): Promise<Either<Error, ProjectDTO[]>> {
    const strategy = this.strategies.find(s => s.canHandle(query))
    
    if (!strategy) {
      return left(new InvalidSearchQueryError())
    }

    const results = await strategy.execute(query)
    return right(results)
  }
}
```

**Benefícios**:
- Código mais limpo e testável
- Fácil adicionar novos tipos de busca
- Separação clara de responsabilidades
- **Estimativa**: 3-4 horas

---

### 3. Ajustar Testes E2E 🔧 MÉDIA PRIORIDADE

**Problema**: Testes E2E com erros de importação e tipos.

**Erros comuns**:
- `Cannot find module 'test/**/**'`
- `Cannot find name 'describe'`

**Solução**:

1. **Ajustar tsconfig para testes**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

2. **Atualizar imports nos testes**:
```typescript
// Antes
import { describe, it, expect } from 'vitest'

// Depois (com globals)
// Remover imports, usar globals do vitest
```

3. **Corrigir paths de importação**:
```typescript
// Usar paths absolutos configurados no tsconfig
import { makeStudent } from '@/test/factories/make-student'
```

**Arquivos afetados**: ~19 arquivos `*.e2e-spec.ts`

**Estimativa**: 2-3 horas

---

### 4. Melhorar Value Objects Existentes 📦 MÉDIA PRIORIDADE

**Objetivo**: Revisar e melhorar Value Objects existentes.

**Análise atual**:
- ✅ `CommentWithAuthor` - Padronizado
- ✅ `StudentProfileWithDetails` - Padronizado
- ⚠️ `Email` - Revisar validações
- ⚠️ `Username` - Revisar validações
- ⚠️ `Semester` - Revisar regras de negócio
- ⚠️ `ProjectStatus` - Considerar criar classe ao invés de type

**Melhorias sugeridas**:

1. **Padronizar estrutura**:
```typescript
export class Email extends ValueObject {
  private constructor(private readonly _value: string) {
    super()
  }

  static create(value: string): Either<InvalidEmailError, Email> {
    if (!this.isValid(value)) {
      return left(new InvalidEmailError(value))
    }
    return right(new Email(value))
  }

  private static isValid(value: string): boolean {
    // Validação robusta
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  get value(): string {
    return this._value
  }

  toDTO(): string {
    return this._value
  }
}
```

2. **Criar ProjectStatus como classe**:
```typescript
export class ProjectStatus extends ValueObject {
  private constructor(private readonly _value: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
    super()
  }

  static create(value: string): Either<InvalidProjectStatusError, ProjectStatus> {
    if (!this.isValidStatus(value)) {
      return left(new InvalidProjectStatusError(value))
    }
    return right(new ProjectStatus(value as any))
  }

  static draft(): ProjectStatus {
    return new ProjectStatus('DRAFT')
  }

  static published(): ProjectStatus {
    return new ProjectStatus('PUBLISHED')
  }

  static archived(): ProjectStatus {
    return new ProjectStatus('ARCHIVED')
  }

  isDraft(): boolean {
    return this._value === 'DRAFT'
  }

  isPublished(): boolean {
    return this._value === 'PUBLISHED'
  }

  get value(): string {
    return this._value
  }
}
```

**Estimativa**: 3-4 horas

---

### 5. Criar DTO de Resposta Paginada 📄 BAIXA PRIORIDADE

**Objetivo**: Criar DTOs para respostas paginadas no Swagger.

```typescript
// src/@shared/dtos/paginated-response.dto.ts
export class PaginatedResponseDto<T> {
  items: T[]
  
  @ApiProperty()
  page: number
  
  @ApiProperty()
  limit: number
  
  @ApiProperty()
  totalItems: number
  
  @ApiProperty()
  totalPages: number
  
  @ApiProperty()
  hasNextPage: boolean
  
  @ApiProperty()
  hasPreviousPage: boolean
}
```

**Uso nos controllers**:
```typescript
@Get('/projects')
@ApiOkResponse({ type: PaginatedResponseDto<ProjectDTO> })
async fetchProjects(@Query() params: PaginationParamsDto) {
  // ...
}
```

**Estimativa**: 1-2 horas

---

### 6. Documentar Padrões Arquiteturais 📚 BAIXA PRIORIDADE

**Objetivo**: Criar documentação sobre os padrões usados no projeto.

**Documentos a criar**:
- `docs/ARCHITECTURE.md` - Visão geral da arquitetura
- `docs/DOMAIN_PATTERNS.md` - Padrões de domínio (Entities, VOs, etc)
- `docs/TESTING_GUIDE.md` - Guia de testes
- `docs/API_PATTERNS.md` - Padrões de API (DTOs, validações, etc)

**Estimativa**: 3-4 horas

---

## 🎯 Ordem de Execução Recomendada

### Sprint 1 (1-2 dias)
1. ✅ Criar paginação padronizada
2. ✅ Implementar Strategy Pattern para busca
3. ✅ Atualizar endpoints para usar nova paginação

### Sprint 2 (1 dia)
4. ✅ Ajustar testes E2E
5. ✅ Melhorar Value Objects existentes

### Sprint 3 (Opcional)
6. ✅ Criar DTOs de resposta paginada
7. ✅ Documentar padrões arquiteturais

---

## 📊 Métricas de Qualidade Esperadas

### Após Sprint 1
- ✅ 100% dos endpoints com paginação padronizada
- ✅ Redução de 50% de código duplicado em buscas
- ✅ Cobertura de testes mantida em >80%

### Após Sprint 2
- ✅ 100% dos testes E2E passando
- ✅ Value Objects com validações robustas
- ✅ Zero uso de `any` no código

### Após Sprint 3
- ✅ Documentação completa dos padrões
- ✅ Swagger 100% documentado
- ✅ Guias de desenvolvimento criados

---

## 🔧 Comandos Úteis

```bash
# Verificar erros de TypeScript
pnpm run build

# Rodar testes unitários
pnpm test

# Rodar testes E2E
pnpm test:e2e

# Verificar coverage
pnpm test:cov

# Lint
pnpm run lint
```

---

## 📝 Notas Importantes

1. **Não alterar entidades por enquanto** - Foco em Value Objects e Use Cases
2. **Manter testes passando** - Sempre garantir que mudanças não quebram testes
3. **Commits pequenos e frequentes** - Facilita rollback se necessário
4. **Documentar decisões** - Atualizar este documento conforme progresso

---

**Última atualização**: 30 de Outubro de 2025  
**Próxima revisão**: Após conclusão da Sprint 1
