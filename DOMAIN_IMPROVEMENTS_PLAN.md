# 🎯 Domain Layer Improvements Plan

**Data**: 29 de Outubro de 2025  
**Status**: Análise e Planejamento

## 📋 Análise Atual

### Estrutura Atual
```
src/@core/domain/
├── authentication/
│   ├── application/
│   │   ├── cryptography/
│   │   ├── errors/
│   │   ├── repositories/
│   │   ├── storage/
│   │   └── use-cases/ (6 use cases)
│   └── enterprise/
│       ├── entities/
│       └── value-objects/
├── interaction/
│   ├── application/
│   │   ├── errors/
│   │   ├── repositories/
│   │   └── use-cases/ (4 use cases)
│   └── enterprise/
│       ├── entities/
│       └── value-objects/
└── projects/
    ├── application/
    │   ├── dtos/
    │   ├── errors/
    │   ├── repositories/
    │   ├── search-strategies/ (Strategy Pattern)
    │   ├── use-cases/ (7 use cases)
    │   └── value-objects/
    └── enterprise/
        ├── entities/
        └── value-objects/
```

## 🔍 Melhorias Identificadas

### 1. Padronização de Paginação ✅
**Prioridade**: Alta
**Status**: A Criar

**Problema**: Paginação está no kernel mas pode ser melhorada
- Criar `PaginationParams` value object
- Criar `PaginatedResponse<T>` genérico
- Padronizar metadata de paginação

**Arquivos Afetados**:
- `src/@shared/kernel/pagination.ts` (já existe, melhorar)
- Todos os use cases que retornam listas

### 2. Value Objects para Dados Resumidos 📊
**Prioridade**: Alta
**Status**: Parcialmente Implementado

**Problema**: Usar DTOs vs Value Objects de forma consistente
- `ProjectSummaryDTO` já existe mas é DTO
- Falta `StudentSummary` 
- Falta `CommentSummary`

**Decisão**: 
- Manter DTOs para transferência de dados
- Criar Value Objects quando representam conceitos de domínio
- `ProjectSummary` deve ser renomeado para evitar confusão

**Arquivos a Criar**:
- `src/@core/domain/authentication/enterprise/value-objects/student-summary.vo.ts`
- `src/@core/domain/interaction/enterprise/value-objects/comment-summary.vo.ts`

### 3. Strategy Pattern em Search ✅
**Prioridade**: Média
**Status**: JÁ IMPLEMENTADO

**Análise**: 
- ✅ SearchContext já implementado
- ✅ 6 estratégias de busca criadas
- ✅ SearchAllStrategy, ByMetadata, ByProfessor, ByQuery, ByTags, ByTitle

**Conclusão**: Não precisa de melhorias

### 4. Repository Interfaces ⚠️
**Prioridade**: Alta
**Status**: Revisar Tipagem

**Problema**: Evitar uso de `any`
- Verificar todas as assinaturas de métodos
- Garantir type-safety
- Adicionar generics onde necessário

**Arquivos a Revisar**:
- `src/@core/domain/*/application/repositories/*.ts`

### 5. Use Cases com Erros de Tipagem 🐛
**Prioridade**: Crítica
**Status**: Corrigir

**Problema**: Erros de tipo no `publish-project.ts`
```typescript
Type 'Left<unknown, User>' is not assignable to type 'PublishProjectUseCaseResponse'
```

**Causa**: Métodos de validação retornam tipos incompatíveis
- `validateAuthor` retorna `Either<..., User>` 
- Mas deveria retornar tipo compatível com fluxo

**Solução**: Refatorar validações privadas para retornar tipos corretos

### 6. Upload Use Cases sem Testes 📝
**Prioridade**: Média
**Status**: Adicionar Testes

**Arquivos**:
- `upload-student-profile.ts` (sem spec)
- `upload-project-banner.ts` (sem spec)

### 7. E2E Tests Configuration 🧪
**Prioridade**: Crítica
**Status**: Corrigir

**Problemas**:
- `Cannot find module 'test/**/**'`
- `Cannot find name 'describe'` - faltam types do vitest

**Soluções**:
- Ajustar tsconfig paths
- Garantir tipos globais do vitest

## 📊 Use Cases - Status Atual

### Authentication (6 use cases)
- ✅ register.ts (com spec)
- ✅ login.ts (com spec)
- ✅ get-profile.ts (com spec)
- ✅ edit-profile.ts (com spec)
- ✅ fetch-students.ts (com spec)
- ⚠️ upload-student-profile.ts (SEM spec)

### Projects (7 use cases)
- ✅ publish-project.ts (com spec) ⚠️ COM ERROS DE TIPO
- ✅ get-project.ts (com spec)
- ✅ delete-project.ts (com spec)
- ✅ search-projects.ts (com spec)
- ✅ fetch-professors.ts (com spec)
- ✅ fetch-subjects.ts (com spec)
- ✅ fetch-trails.ts (com spec)
- ⚠️ upload-project-banner.ts (SEM spec)

### Interaction (4 use cases)
- ✅ comment-on-project.ts (com spec)
- ✅ delete-comment.ts (com spec)
- ✅ list-project-comments.ts (com spec)
- ✅ report-comment.ts (com spec)

## 🎯 Novos Use Cases Sugeridos

### Authentication Domain
- [ ] `change-password.ts` - Alterar senha
- [ ] `request-password-reset.ts` - Solicitar reset de senha
- [ ] `verify-email.ts` - Verificar email
- [ ] `deactivate-account.ts` - Desativar conta

### Projects Domain
- [ ] `update-project.ts` - Atualizar projeto publicado
- [ ] `draft-project.ts` - Salvar rascunho
- [ ] `like-project.ts` - Curtir projeto
- [ ] `view-project.ts` - Registrar visualização
- [ ] `share-project.ts` - Compartilhar projeto

### Interaction Domain
- [ ] `edit-comment.ts` - Editar comentário
- [ ] `like-comment.ts` - Curtir comentário
- [ ] `reply-to-comment.ts` - Responder comentário (threading)

## 🔧 Plano de Execução

### Fase 1: Correções Críticas (Agora)
1. ✅ Corrigir erros de tipagem em `publish-project.ts`
2. ✅ Corrigir configuração de testes E2E
3. ✅ Revisar repositórios removendo `any`

### Fase 2: Padronizações (Próximo)
4. ✅ Melhorar `Pagination` no shared
5. ✅ Criar Value Objects de Summary
6. ✅ Padronizar nomenclaturas (Post vs ProjectSummary)

### Fase 3: Testes (Depois)
7. ⏳ Adicionar testes para upload use cases
8. ⏳ Corrigir testes E2E existentes

### Fase 4: Novos Features (Futuro)
9. ⏳ Implementar novos use cases sugeridos
10. ⏳ Adicionar testes para novos use cases

## 📁 Branches Sugeridas

### Correções Imediatas
- `fix/domain-type-errors` - Corrigir erros de tipagem
- `fix/e2e-test-config` - Corrigir configuração de testes

### Melhorias
- `feat/shared-pagination` - Melhorar paginação
- `feat/value-objects-summary` - Criar VOs de resumo
- `refactor/remove-any-types` - Remover any dos repositórios

### Novos Features (Futuro)
- `feat/project-update` - Use case de atualização
- `feat/project-draft` - Use case de rascunho
- `feat/comment-threading` - Sistema de respostas

## ✅ Decisões Tomadas

1. **DTOs vs Value Objects**
   - DTOs para transferência entre camadas
   - Value Objects para conceitos de domínio
   - Evitar duplicação de conceitos

2. **Paginação**
   - Criar classe `PaginationParams` para entrada
   - Manter `PaginatedResult<T>` para saída
   - Adicionar metadata útil (hasNext, hasPrev, total)

3. **Nomenclatura**
   - `ProjectSummary` para VO de domínio
   - `ProjectSummaryDTO` para transferência
   - Mesma lógica para outros agregados

4. **Strategy Pattern**
   - Manter implementação atual
   - Já está bem estruturado
   - Não precisa mudanças

## 🚫 O Que NÃO Fazer (Por Enquanto)

1. ❌ Não alterar entidades (User, Project, Comment)
2. ❌ Não mudar estrutura de pastas DDD
3. ❌ Não adicionar novos use cases antes de corrigir existentes
4. ❌ Não remover código funcional

## 📈 Métricas de Sucesso

- [ ] 0 erros de compilação TypeScript
- [ ] 0 uso de `any` nos repositórios
- [ ] 100% use cases com testes
- [ ] Testes E2E configurados e passando
- [ ] Paginação padronizada em todos os endpoints
- [ ] Value Objects documentados

---

**Próximos Passos Imediatos**:
1. Criar branch `fix/domain-type-errors`
2. Corrigir tipagens do `publish-project.ts`
3. Corrigir configuração E2E
4. Revisar repositórios
