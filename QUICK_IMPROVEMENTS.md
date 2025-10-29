# 🔧 Plano de Melhorias - Sem Alterar Entidades

**Data**: 29 de Outubro de 2025  
**Objetivo**: Melhorar camada de domínio mantendo entidades existentes

---

## 🎯 Ajustes Mais Plausíveis

### 1. ✅ Refatorar `publish-project` (Alta Complexidade)

**Problema Atual**:
```typescript
// publish-project.ts - linha 45
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity
```

**Solução - Extrair Validações**:

```typescript
// src/@core/domain/projects/application/use-cases/publish-project.ts

export class PublishProjectUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly studentsRepository: UsersRepository,
    private readonly subjectsRepository: SubjectsRepository,
    private readonly trailsRepository: TrailsRepository,
    private readonly professorsRepository: ProfessorsRepository,
  ) {}

  async execute(request: PublishProjectUseCaseRequest): Promise<PublishProjectUseCaseResponse> {
    // Validar autor
    const authorValidation = await this.validateAuthor(request.authorId)
    if (authorValidation.isLeft()) return authorValidation

    // Validar disciplina (se fornecida)
    if (request.subjectId) {
      const subjectValidation = await this.validateSubject(request.subjectId)
      if (subjectValidation.isLeft()) return subjectValidation
    }

    // Validar trilhas
    const trailsValidation = await this.validateTrails(request.trailsIds)
    if (trailsValidation.isLeft()) return trailsValidation

    // Validar professores (se fornecidos)
    if (request.professorsIds?.length) {
      const professorsValidation = await this.validateProfessors(request.professorsIds)
      if (professorsValidation.isLeft()) return professorsValidation
    }

    // Criar projeto
    const project = Project.create({
      title: request.title,
      description: request.description,
      // ... resto dos campos
    })

    await this.projectsRepository.create(project)

    return right({ projectId: project.id.toString() })
  }

  private async validateAuthor(authorId: string) {
    if (!authorId) {
      return left(new ForbiddenError('ID do autor é obrigatório'))
    }

    const author = await this.studentsRepository.findById(authorId)
    if (!author) {
      return left(new ResourceNotFoundError('Autor não encontrado'))
    }

    return right(author)
  }

  private async validateSubject(subjectId: string) {
    const subject = await this.subjectsRepository.findById(subjectId)
    if (!subject) {
      return left(new ResourceNotFoundError('Disciplina não encontrada'))
    }

    return right(subject)
  }

  private async validateTrails(trailsIds: string[]) {
    if (!trailsIds || trailsIds.length === 0) {
      return left(new ForbiddenError('Pelo menos uma trilha é obrigatória'))
    }

    const trails = await Promise.all(
      trailsIds.map(id => this.trailsRepository.findById(id))
    )

    if (trails.some(trail => !trail)) {
      return left(new ResourceNotFoundError('Uma ou mais trilhas não encontradas'))
    }

    return right(trails)
  }

  private async validateProfessors(professorsIds: string[]) {
    const professors = await Promise.all(
      professorsIds.map(id => this.professorsRepository.findById(id))
    )

    if (professors.some(prof => !prof)) {
      return left(new ResourceNotFoundError('Um ou mais professores não encontrados'))
    }

    return right(professors)
  }
}
```

**Benefícios**:
- ✅ Reduz complexidade cognitiva
- ✅ Código mais legível e testável
- ✅ Cada validação pode ser testada separadamente
- ✅ Não muda entidades ou schema

**Esforço**: 2-3 horas

---

### 2. ✅ Consolidar Buscas de Projetos

**Problema Atual**: 4 use cases diferentes para buscar projetos

**Solução - Use Case Unificado**:

```typescript
// src/@core/domain/projects/application/use-cases/search-projects.ts

interface SearchProjectsUseCaseRequest {
  // Busca textual
  query?: string          // Busca em título, descrição
  title?: string          // Busca específica por título
  
  // Filtros
  professorName?: string
  tags?: string[]
  trailId?: string
  subjectId?: string
  
  // Filtros temporais
  year?: number
  semester?: number
  
  // Paginação
  page?: number
  perPage?: number
}

type SearchProjectsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    projects: Post[]
    total: number
    page: number
    perPage: number
  }
>

export class SearchProjectsUseCase {
  constructor(
    private projectsRepository: ProjectsRepository,
  ) {}

  async execute(request: SearchProjectsUseCaseRequest): Promise<SearchProjectsUseCaseResponse> {
    const {
      query,
      title,
      professorName,
      tags,
      trailId,
      subjectId,
      year,
      semester,
      page = 1,
      perPage = 20
    } = request

    // Delegar para o repositório que já implementa as buscas
    let projects: Post[] = []

    if (query) {
      const result = await this.projectsRepository.findManyByQuery(query)
      if (result.isRight()) projects = result.value
    } else if (title) {
      const result = await this.projectsRepository.findManyByTitle(title)
      if (result.isRight()) projects = result.value
    } else if (professorName) {
      const result = await this.projectsRepository.findManyByProfessorName(professorName)
      if (result.isRight()) projects = result.value
    } else if (tags && tags.length > 0) {
      const result = await this.projectsRepository.findManyByTags(tags)
      if (result.isRight()) projects = result.value
    } else {
      const result = await this.projectsRepository.findMany(page, perPage)
      if (result.isRight()) projects = result.value
    }

    // Aplicar filtros adicionais em memória (se necessário)
    let filtered = projects

    if (trailId) {
      filtered = filtered.filter(p => 
        p.trails?.some(t => t.toString() === trailId)
      )
    }

    if (subjectId) {
      filtered = filtered.filter(p => p.subjectId?.toString() === subjectId)
    }

    if (year) {
      filtered = filtered.filter(p => p.publishedYear === year)
    }

    if (semester) {
      filtered = filtered.filter(p => p.semester === semester)
    }

    return right({
      projects: filtered,
      total: filtered.length,
      page,
      perPage
    })
  }
}
```

**Depois, depreciar os use cases antigos**:
- ~~`filter-posts-by-query`~~
- ~~`search-posts-by-title`~~
- ~~`search-posts-by-tag`~~
- ~~`search-posts-by-professor-name`~~

**Benefícios**:
- ✅ Um único endpoint de busca
- ✅ Mais flexível e extensível
- ✅ Reduz código duplicado
- ✅ Melhor para o frontend

**Esforço**: 3-4 horas

---

### 3. ✅ Adicionar Value Objects de Validação

**Criar Value Objects para Validações Comuns**:

#### a) **ProjectTitle**

```typescript
// src/@core/domain/projects/enterprise/value-objects/project-title.ts

import { Either, left, right } from '@/@shared/kernel/either'
import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface ProjectTitleProps {
  value: string
}

export class ProjectTitleTooShortError extends Error {
  constructor() {
    super('Título deve ter no mínimo 3 caracteres')
    this.name = 'ProjectTitleTooShortError'
  }
}

export class ProjectTitleTooLongError extends Error {
  constructor() {
    super('Título deve ter no máximo 200 caracteres')
    this.name = 'ProjectTitleTooLongError'
  }
}

export class ProjectTitle extends ValueObject<ProjectTitleProps> {
  private static readonly MIN_LENGTH = 3
  private static readonly MAX_LENGTH = 200

  get value(): string {
    return this.props.value
  }

  private constructor(props: ProjectTitleProps) {
    super(props)
  }

  static create(title: string): Either<
    ProjectTitleTooShortError | ProjectTitleTooLongError,
    ProjectTitle
  > {
    const trimmed = title.trim()

    if (trimmed.length < this.MIN_LENGTH) {
      return left(new ProjectTitleTooShortError())
    }

    if (trimmed.length > this.MAX_LENGTH) {
      return left(new ProjectTitleTooLongError())
    }

    return right(new ProjectTitle({ value: trimmed }))
  }
}
```

#### b) **ProfileImage**

```typescript
// src/@core/domain/authentication/enterprise/value-objects/profile-image.ts

import { Either, left, right } from '@/@shared/kernel/either'
import { ValueObject } from '@/@shared/kernel/kernel/value-object'

interface ProfileImageProps {
  filename: string
  buffer: Buffer
}

export class InvalidImageTypeError extends Error {
  constructor() {
    super('Apenas imagens PNG, JPG, JPEG e WEBP são permitidas')
    this.name = 'InvalidImageTypeError'
  }
}

export class ImageTooLargeError extends Error {
  constructor() {
    super('Imagem não pode ser maior que 5MB')
    this.name = 'ImageTooLargeError'
  }
}

export class ProfileImage extends ValueObject<ProfileImageProps> {
  private static readonly VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
  private static readonly MAX_SIZE = 5 * 1024 * 1024 // 5MB

  get filename(): string {
    return this.props.filename
  }

  get buffer(): Buffer {
    return this.props.buffer
  }

  private constructor(props: ProfileImageProps) {
    super(props)
  }

  static create(filename: string, buffer: Buffer): Either<
    InvalidImageTypeError | ImageTooLargeError,
    ProfileImage
  > {
    // Validar tipo
    const isValidType = this.VALID_EXTENSIONS.some(ext =>
      filename.toLowerCase().endsWith(ext)
    )

    if (!isValidType) {
      return left(new InvalidImageTypeError())
    }

    // Validar tamanho
    if (buffer.length > this.MAX_SIZE) {
      return left(new ImageTooLargeError())
    }

    return right(new ProfileImage({ filename, buffer }))
  }
}
```

#### c) **EmailDomain**

```typescript
// src/@core/domain/authentication/enterprise/value-objects/email-domain.ts

import { Either, left, right } from '@/@shared/kernel/either'
import { Email } from './email'

export class EmailDomainNotAllowedError extends Error {
  constructor() {
    super('Apenas emails do domínio @alu.ufc.br são permitidos')
    this.name = 'EmailDomainNotAllowedError'
  }
}

export class StudentEmail {
  private static readonly ALLOWED_DOMAIN = '@alu.ufc.br'

  static create(emailString: string): Either<
    EmailDomainNotAllowedError | Error,
    Email
  > {
    // Usar o Email existente para validação básica
    const emailOrError = Email.create(emailString)
    
    if (emailOrError.isLeft()) {
      return emailOrError
    }

    const email = emailOrError.value

    // Validar domínio específico
    if (!email.value.endsWith(this.ALLOWED_DOMAIN)) {
      return left(new EmailDomainNotAllowedError())
    }

    return right(email)
  }
}
```

**Uso nos Use Cases**:

```typescript
// register.ts
import { StudentEmail } from '../../enterprise/value-objects/email-domain'

export class RegisterUseCase {
  async execute(request: RegisterUseCaseRequest) {
    // Validar email com domínio
    const emailOrError = StudentEmail.create(request.email)
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const email = emailOrError.value
    // ... resto do código
  }
}

// upload-student-profile.ts
import { ProfileImage } from '../../enterprise/value-objects/profile-image'

export class UploadStudentProfileUseCase {
  async execute(request: UploadStudentProfileUseCaseRequest) {
    // Validar imagem
    const imageOrError = ProfileImage.create(request.filename, request.image)
    if (imageOrError.isLeft()) {
      return left(imageOrError.value)
    }

    const image = imageOrError.value
    // ... resto do código
  }
}
```

**Benefícios**:
- ✅ Validações encapsuladas e reutilizáveis
- ✅ Domínio mais rico
- ✅ Fácil de testar
- ✅ Não muda entidades

**Esforço**: 4-5 horas (3 value objects)

---

### 4. ✅ Adicionar Use Case: `list-project-comments`

**Novo Use Case Simples**:

```typescript
// src/@core/domain/interaction/application/use-cases/list-project-comments.ts

interface ListProjectCommentsUseCaseRequest {
  projectId: string
  page?: number
  perPage?: number
}

type ListProjectCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comments: CommentWithAuthor[]
    total: number
    page: number
  }
>

export class ListProjectCommentsUseCase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(request: ListProjectCommentsUseCaseRequest): Promise<ListProjectCommentsUseCaseResponse> {
    const { projectId, page = 1, perPage = 20 } = request

    // Verificar se projeto existe
    const project = await this.projectsRepository.findById(projectId)
    if (!project) {
      return left(new ResourceNotFoundError('Projeto não encontrado'))
    }

    // Buscar comentários do projeto
    const comments = await this.commentsRepository.findManyByProjectId(
      projectId,
      page,
      perPage
    )

    return right({
      comments,
      total: comments.length,
      page
    })
  }
}
```

**Adicionar método no repositório**:

```typescript
// src/@core/domain/interaction/application/repositories/comments-repository.ts

export abstract class CommentsRepository {
  abstract create(comment: Comment): Promise<void>
  abstract findById(id: string): Promise<Comment | null>
  abstract delete(comment: Comment): Promise<void>
  
  // NOVO
  abstract findManyByProjectId(
    projectId: string,
    page: number,
    perPage: number
  ): Promise<CommentWithAuthor[]>
}
```

**Implementar no Prisma**:

```typescript
// src/@infra/database/prisma/repositories/comments-repository.ts

async findManyByProjectId(
  projectId: string,
  page: number,
  perPage: number
): Promise<CommentWithAuthor[]> {
  const skip = (page - 1) * perPage

  const comments = await this.prisma.comment.findMany({
    where: { projectId },
    include: {
      author: {
        include: {
          profile: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: perPage
  })

  return comments.map(PrismaCommentMapper.toDomainWithAuthor)
}
```

**Benefícios**:
- ✅ Funcionalidade necessária para UI
- ✅ Usa entidades existentes
- ✅ Não muda schema
- ✅ Simples de implementar

**Esforço**: 2 horas

---

### 5. ✅ Melhorar Tratamento de Erros

**Adicionar Erros Específicos**:

```typescript
// src/@core/domain/authentication/application/errors/invalid-credentials.error.ts
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Email ou senha incorretos')
    this.name = 'InvalidCredentialsError'
  }
}

// src/@core/domain/projects/application/errors/project-not-editable.error.ts
export class ProjectNotEditableError extends Error {
  constructor() {
    super('Este projeto não pode ser editado')
    this.name = 'ProjectNotEditableError'
  }
}

// src/@core/domain/interaction/application/errors/comment-not-editable.error.ts
export class CommentNotEditableError extends Error {
  constructor() {
    super('Este comentário não pode ser editado')
    this.name = 'CommentNotEditableError'
  }
}
```

**Uso no Login**:

```typescript
// login.ts
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'

export class LoginUseCase {
  async execute(request: LoginUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(request.email)
    
    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hasher.compare(
      request.password,
      user.password
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    // ... resto
  }
}
```

**Benefícios**:
- ✅ Mensagens de erro mais específicas
- ✅ Melhor UX
- ✅ Código mais semântico
- ✅ Não muda entidades

**Esforço**: 1 hora

---

## 📊 Resumo dos Ajustes

| # | Ajuste | Benefício Principal | Esforço | Prioridade |
|---|--------|---------------------|---------|------------|
| 1 | Refatorar publish-project | Reduz complexidade | 2-3h | 🔴 Alta |
| 2 | Consolidar buscas | Código mais limpo | 3-4h | 🔴 Alta |
| 3 | Value Objects validação | Domínio mais rico | 4-5h | 🟡 Média |
| 4 | List project comments | Feature necessária | 2h | 🔴 Alta |
| 5 | Melhorar erros | Melhor UX | 1h | 🟡 Média |

**Total Estimado**: 12-15 horas de trabalho

---

## 🎯 Ordem de Implementação Recomendada

### Sprint 1 (6-8h)
1. ✅ Refatorar `publish-project` (reduzir complexidade)
2. ✅ Adicionar `list-project-comments` (feature necessária)
3. ✅ Melhorar tratamento de erros

### Sprint 2 (6-7h)
4. ✅ Criar Value Objects de validação
5. ✅ Consolidar use cases de busca

---

## ✅ Vantagens desta Abordagem

1. **Sem Breaking Changes**
   - Não altera entidades existentes
   - Não requer migração de banco
   - Backward compatible

2. **Melhorias Incrementais**
   - Pode ser feito aos poucos
   - Cada ajuste é independente
   - Testes continuam passando

3. **Quick Wins**
   - Resultados visíveis rapidamente
   - Melhora qualidade do código
   - Adiciona features necessárias

4. **Baixo Risco**
   - Mudanças controladas
   - Fácil de reverter
   - Impacto mínimo

---

**Próximo Passo**: Escolher qual ajuste implementar primeiro e criar branch específica.
