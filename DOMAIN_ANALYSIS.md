# 🔍 Análise da Camada de Domínio - Deck API

**Data da Análise**: 29 de Outubro de 2025  
**Versão**: 2.0.0 (DDD + Clean Architecture)

---

## 📊 Resumo Executivo

### Bounded Contexts Atuais
1. **Authentication** - Autenticação e perfis de usuários
2. **Interaction** - Comentários e denúncias
3. **Projects** - Projetos acadêmicos

### Estatísticas
- **Use Cases Implementados**: 16
- **Entidades**: 7
- **Value Objects**: 10
- **Repositórios**: 6

---

## 🎯 Bounded Context: Authentication

### ✅ Use Cases Implementados

| Use Case | Status | Responsabilidade |
|----------|--------|------------------|
| `register` | ✅ | Registrar novo estudante |
| `login` | ✅ | Autenticar usuário |
| `get-profile` | ✅ | Buscar perfil por username |
| `edit-profile` | ✅ | Editar perfil do estudante |
| `fetch-students` | ✅ | Listar estudantes por nome |
| `upload-student-profile` | ✅ | Upload de foto de perfil |

### ⚠️ Problemas Identificados

#### 1. **Falta Validação de Email no Registro**
```typescript
// register.ts - linha ~50
const isUsernameTaken = await this.usersRepository.findByUsername(request.username)
const isEmailTaken = await this.usersRepository.findByEmail(request.email)
```
**Problema**: Verifica se email já existe, mas aceita qualquer formato de email.

**Solução Recomendada**: 
```typescript
// Adicionar validação de domínio @alu.ufc.br
const emailOrError = Email.create(request.email)
if (emailOrError.isLeft()) {
  return left(emailOrError.value)
}

// Validar domínio específico
if (!emailOrError.value.value.endsWith('@alu.ufc.br')) {
  return left(new EmailDomainNotAllowedError())
}
```

#### 2. **Falta Use Case: Change Password**
**Caso de Uso Ausente**: Permitir usuário trocar senha

**Implementação Sugerida**:
```typescript
interface ChangePasswordUseCaseRequest {
  userId: string
  currentPassword: string
  newPassword: string
}

class ChangePasswordUseCase {
  // 1. Verificar senha atual
  // 2. Validar nova senha (mínimo 6 caracteres)
  // 3. Hash da nova senha
  // 4. Atualizar no repositório
}
```

#### 3. **Falta Use Case: Forgot Password / Reset Password**
**Caso de Uso Ausente**: Recuperação de senha

**Implementação Sugerida**:
```typescript
// forgot-password.ts
class ForgotPasswordUseCase {
  // 1. Verificar se email existe
  // 2. Gerar token de reset
  // 3. Enviar email com token
  // 4. Salvar token com expiração
}

// reset-password.ts
class ResetPasswordUseCase {
  // 1. Validar token
  // 2. Verificar expiração
  // 3. Atualizar senha
  // 4. Invalidar token
}
```

#### 4. **Falta Use Case: Deactivate Account**
**Caso de Uso Ausente**: Desativar conta de usuário

**Implementação Sugerida**:
```typescript
class DeactivateAccountUseCase {
  // 1. Verificar permissão (próprio usuário ou admin)
  // 2. Atualizar status para INACTIVE
  // 3. Manter dados para auditoria
}
```

#### 5. **Problema: Upload Profile sem Validação de Tipo**
```typescript
// upload-student-profile.ts
async execute({ username, filename, image }: UploadStudentProfileUseCaseRequest)
```
**Problema**: Não valida tipo de arquivo (PNG, JPG) nem tamanho máximo.

**Solução**:
```typescript
// Adicionar validações
private validateImageType(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  return validExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

private validateImageSize(buffer: Buffer): boolean {
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  return buffer.length <= MAX_SIZE
}
```

### 🆕 Use Cases Recomendados

1. **`activate-account`** - Ativação de conta via email
2. **`change-password`** - Trocar senha
3. **`forgot-password`** - Solicitar reset de senha
4. **`reset-password`** - Resetar senha com token
5. **`deactivate-account`** - Desativar conta
6. **`get-student-details`** - Detalhes completos (já implementado no controller, falta use case próprio)

---

## 🎯 Bounded Context: Projects

### ✅ Use Cases Implementados

| Use Case | Status | Responsabilidade |
|----------|--------|------------------|
| `publish-project` | ✅ | Publicar projeto |
| `delete-project` | ✅ | Deletar projeto |
| `get-project` | ✅ | Buscar projeto por ID |
| `fetch-posts` | ✅ | Listar todos os posts |
| `filter-posts-by-query` | ✅ | Filtrar posts por query |
| `search-posts-by-title` | ✅ | Buscar por título |
| `search-posts-by-tag` | ✅ | Buscar por tag |
| `search-posts-by-professor-name` | ✅ | Buscar por professor |
| `fetch-professors` | ✅ | Listar professores |
| `fetch-subjects` | ✅ | Listar disciplinas |
| `fetch-trails` | ✅ | Listar trilhas |
| `upload-project-banner` | ✅ | Upload de banner |

### ⚠️ Problemas Identificados

#### 1. **Publish Project com Complexidade Excessiva**
```typescript
// publish-project.ts - linha 45
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity
```
**Problema**: Use case faz muitas validações e lógica complexa.

**Solução**: Extrair validações para métodos privados ou Value Objects:
```typescript
class PublishProjectUseCase {
  private async validateAuthor(authorId: string) { }
  private async validateSubject(subjectId?: string) { }
  private async validateTrails(trailsIds: string[]) { }
  private async validateProfessors(professorsIds?: string[]) { }
  
  async execute(request: PublishProjectUseCaseRequest) {
    // Validações separadas
    await this.validateAuthor(request.authorId)
    await this.validateSubject(request.subjectId)
    // ...
  }
}
```

#### 2. **Falta Use Case: Edit Project**
**Caso de Uso Ausente**: Editar projeto já publicado

**Implementação Sugerida**:
```typescript
interface EditProjectUseCaseRequest {
  projectId: string
  editorId: string
  title?: string
  description?: string
  content?: string
  // ... outros campos editáveis
}

class EditProjectUseCase {
  // 1. Verificar se projeto existe
  // 2. Verificar se editor é o autor
  // 3. Atualizar campos
  // 4. Manter histórico de edições (opcional)
}
```

#### 3. **Falta Use Case: Like/Favorite Project**
**Caso de Uso Ausente**: Curtir ou favoritar projeto

**Implementação Sugerida**:
```typescript
class LikeProjectUseCase {
  // 1. Verificar se projeto existe
  // 2. Adicionar like do usuário
  // 3. Incrementar contador
}

class UnlikeProjectUseCase {
  // 1. Remover like
  // 2. Decrementar contador
}
```

#### 4. **Falta Use Case: View Counter**
**Caso de Uso Ausente**: Contador de visualizações

**Implementação Sugerida**:
```typescript
class IncrementProjectViewsUseCase {
  // 1. Verificar se projeto existe
  // 2. Incrementar contador de views
  // 3. Opcional: registrar quem visualizou
}
```

#### 5. **Problema: Múltiplos Use Cases de Busca**
**Problema**: 4 use cases diferentes para buscar posts (filter, search by title, by tag, by professor).

**Solução**: Consolidar em um único use case com Strategy Pattern:
```typescript
interface SearchProjectsUseCaseRequest {
  query?: string
  title?: string
  tags?: string[]
  professorName?: string
  trailId?: string
  subjectId?: string
  year?: number
  semester?: number
}

class SearchProjectsUseCase {
  // Busca unificada com múltiplos critérios
}
```

### 🆕 Use Cases Recomendados

1. **`edit-project`** - Editar projeto
2. **`like-project`** - Curtir projeto
3. **`unlike-project`** - Descurtir projeto
4. **`increment-views`** - Incrementar visualizações
5. **`search-projects`** - Busca unificada (consolidar os 4 atuais)
6. **`get-project-statistics`** - Estatísticas do projeto (views, likes, comments)
7. **`archive-project`** - Arquivar projeto (soft delete)

---

## 🎯 Bounded Context: Interaction

### ✅ Use Cases Implementados

| Use Case | Status | Responsabilidade |
|----------|--------|------------------|
| `comment-on-project` | ✅ | Comentar em projeto |
| `delete-comment` | ✅ | Deletar comentário |
| `report-comment` | ✅ | Denunciar comentário |

### ⚠️ Problemas Identificados

#### 1. **Falta Use Case: Edit Comment**
**Caso de Uso Ausente**: Editar comentário

**Implementação Sugerida**:
```typescript
class EditCommentUseCase {
  // 1. Verificar se comentário existe
  // 2. Verificar se editor é o autor
  // 3. Atualizar conteúdo
  // 4. Marcar como editado
}
```

#### 2. **Falta Use Case: List Comments**
**Caso de Uso Ausente**: Listar comentários de um projeto

**Implementação Sugerida**:
```typescript
interface ListProjectCommentsUseCaseRequest {
  projectId: string
  page?: number
  perPage?: number
}

class ListProjectCommentsUseCase {
  // 1. Verificar se projeto existe
  // 2. Buscar comentários paginados
  // 3. Ordenar por data (mais recentes primeiro)
}
```

#### 3. **Falta Use Case: Like Comment**
**Caso de Uso Ausente**: Curtir comentário

**Implementação Sugerida**:
```typescript
class LikeCommentUseCase {
  // Similar ao like de projeto
}
```

#### 4. **Problema: Report sem Moderação**
**Problema**: Apenas cria o report, mas não há use case de moderação.

**Solução**:
```typescript
class ModerateReportUseCase {
  // 1. Admin/Moderador visualiza report
  // 2. Pode aprovar (deleta comentário) ou rejeitar
  // 3. Notifica usuário que reportou
}

class ListReportsUseCase {
  // Listar reports pendentes para moderação
}
```

### 🆕 Use Cases Recomendados

1. **`edit-comment`** - Editar comentário
2. **`list-project-comments`** - Listar comentários de um projeto
3. **`like-comment`** - Curtir comentário
4. **`moderate-report`** - Moderar denúncia (admin)
5. **`list-reports`** - Listar denúncias (admin)
6. **`resolve-report`** - Resolver denúncia

---

## 🏗️ Problemas Arquiteturais

### 1. **Acoplamento entre Bounded Contexts**

**Problema**: Interaction depende de ProjectsRepository
```typescript
// comment-on-project.ts
import type { ProjectsRepository } from '../../../projects/application/repositories/projects-repository'
```

**Solução**: Usar Domain Events
```typescript
// Quando um projeto é criado, emite evento
class Project extends AggregateRoot {
  private addDomainEvent(event: DomainEvent) { }
}

// Interaction escuta o evento
class OnProjectCreated implements DomainEventHandler {
  // Permite comentários no projeto
}
```

### 2. **Falta Domain Events**

**Problema**: Nenhum use case emite eventos de domínio.

**Casos de Uso para Eventos**:
- `UserRegistered` - Enviar email de boas-vindas
- `ProjectPublished` - Notificar seguidores
- `CommentCreated` - Notificar autor do projeto
- `ReportCreated` - Notificar moderadores

**Implementação Sugerida**:
```typescript
// src/@core/domain/events/
export abstract class DomainEvent {
  public readonly occurredAt: Date
  constructor() {
    this.occurredAt = new Date()
  }
}

export class UserRegisteredEvent extends DomainEvent {
  constructor(public readonly userId: string) {
    super()
  }
}

// No aggregate root
class User extends AggregateRoot {
  static create(props: UserProps) {
    const user = new User(props)
    user.addDomainEvent(new UserRegisteredEvent(user.id.toString()))
    return user
  }
}
```

### 3. **Falta Value Objects para Validação**

**Problema**: Validações espalhadas nos use cases.

**Sugestão**: Criar Value Objects:
```typescript
// ProjectTitle.ts
export class ProjectTitle extends ValueObject {
  private static readonly MIN_LENGTH = 3
  private static readonly MAX_LENGTH = 200
  
  static create(title: string): Either<ValidationError, ProjectTitle> {
    if (!title || title.trim().length < this.MIN_LENGTH) {
      return left(new ValidationError('Título muito curto'))
    }
    // ...
  }
}

// No use case
const titleOrError = ProjectTitle.create(request.title)
if (titleOrError.isLeft()) {
  return left(titleOrError.value)
}
```

---

## 📋 Plano de Ação Recomendado

### Prioridade Alta 🔴

1. **Adicionar Domain Events** - Base para notificações
2. **Consolidar Busca de Projetos** - Reduzir 4 use cases para 1
3. **Edit Project Use Case** - Funcionalidade básica
4. **List Project Comments** - Necessário para UI
5. **Change Password Use Case** - Segurança básica

### Prioridade Média 🟡

6. **Like/Unlike Project** - Engajamento
7. **Edit Comment** - UX melhor
8. **Forgot/Reset Password** - UX essencial
9. **Value Objects de Validação** - Código mais limpo
10. **Increment Views** - Analytics

### Prioridade Baixa 🟢

11. **Like Comment** - Nice to have
12. **Moderate Reports** - Admin features
13. **Deactivate Account** - Compliance
14. **Archive Project** - Organização
15. **Get Project Statistics** - Dashboard

---

## 📊 Métricas de Qualidade

### Cobertura de Use Cases

| Bounded Context | Use Cases Atuais | Recomendados | Cobertura |
|----------------|------------------|--------------|-----------|
| Authentication | 6 | 11 | 55% |
| Projects | 12 | 16 | 75% |
| Interaction | 3 | 9 | 33% |
| **Total** | **21** | **36** | **58%** |

### Conformidade com DDD

| Aspecto | Status | Nota |
|---------|--------|------|
| Bounded Contexts | ✅ | Bem definidos |
| Entities | ✅ | Adequadas |
| Value Objects | ⚠️ | Podem melhorar |
| Repositories | ✅ | Bem implementados |
| Domain Events | ❌ | Não implementado |
| Aggregate Roots | ✅ | Corretos |
| Ubiquitous Language | ✅ | Consistente |

---

## 🎯 Conclusão

A camada de domínio está **bem estruturada** seguindo DDD, mas há espaço para melhorias significativas:

### ✅ Pontos Fortes
- Separação clara de bounded contexts
- Use cases bem definidos e testados
- Entities ricas com comportamento
- Repositórios seguem padrão correto

### ⚠️ Pontos de Melhoria
- Faltam use cases essenciais (edit, password management)
- Domain Events não implementados
- Acoplamento entre bounded contexts
- Validações podem ser Value Objects
- Busca de projetos fragmentada

### 🚀 Próximos Passos
1. Implementar Domain Events
2. Adicionar use cases de alta prioridade
3. Refatorar busca de projetos
4. Criar Value Objects para validações comuns
5. Desacoplar bounded contexts via eventos

**Nota Final**: 7/10 - Boa base, precisa de features essenciais e eventos de domínio.

---

**Última atualização**: 29 de Outubro de 2025  
**Próxima revisão**: Após implementação de Domain Events
