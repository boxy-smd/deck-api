# AGENTS.md - Deck API Project Context

Este documento fornece contexto para agentes de IA que trabalham com o projeto Deck API.

## 📋 Sobre o Projeto

**Deck API** é uma aplicação backend desenvolvida em **NestJS** que serve como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará. A aplicação permite gerenciamento de estudantes, projetos, comentários e tags (professores, disciplinas, trilhas).

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, com separação clara de responsabilidades:

### Estrutura de Pastas

```
src/
├── @core/                    # Lógica de negócio (Domain + Application)
│   ├── domain/              # Entidades e Value Objects do domínio
│   │   ├── users/           # Domínio de usuários
│   │   ├── projects/        # Domínio de projetos
│   │   └── interactions/    # Domínio de interações (comentários)
│   └── application/         # Casos de uso e interfaces
│       ├── users/           # Use cases de usuários
│       ├── projects/        # Use cases de projetos
│       └── interactions/    # Use cases de interações
├── @infra/                  # Infraestrutura e implementações
│   ├── config/              # Configurações (env vars)
│   ├── cryptography/        # Implementação de criptografia
│   └── database/            # Prisma ORM e Firebase Storage
│       ├── prisma/          # Repositórios, mappers e tipos
│       └── firebase/        # Upload de imagens
├── @presentation/           # Camada de apresentação (Controllers)
│   ├── modules/             # Módulos NestJS
│   │   ├── auth/            # Autenticação JWT
│   │   ├── students/        # Controllers de estudantes
│   │   ├── projects/        # Controllers de projetos
│   │   ├── comments/        # Controllers de comentários
│   │   ├── professors/      # Controllers de professores
│   │   ├── subjects/        # Controllers de disciplinas
│   │   └── trails/          # Controllers de trilhas
│   └── presenters/          # Transformação de dados para API
└── @shared/                 # Código compartilhado
    └── kernel/              # Tipos, utils, DTOs base
```

## 🎯 Domínios Principais

### 1. **Users (Usuários)**

**Aggregate Roots:**
- `User` - Usuário do sistema com autenticação, perfil e papéis

**Entidades:**
- `StudentProfile` - Perfil complementar do estudante (semestre e trilhas)

**Value Objects:**
- `Email` - Email validado
- `Username` - Nome de usuário único
- `Semester` - Semestre validado (1-12)
- `UserRole` - Enum: STUDENT, CURATOR, MODERATOR, ADMIN
- `UserStatus` - Enum: ACTIVE, INACTIVE, BANNED
- `StudentProfileWithDetails` - DTO rico com detalhes completos

**Use Cases:**
- `RegisterUseCase` - Registro de novo estudante
- `LoginUseCase` - Autenticação JWT
- `GetProfileUseCase` - Obter perfil do usuário autenticado
- `EditProfileUseCase` - Editar perfil (nome, about, semestre, trilhas)
- `FetchUsersUseCase` - Listar todos os estudantes
- `UploadStudentProfileUseCase` - Upload de foto de perfil

**Repositórios:**
- `StudentsRepository` - Interface abstrata
- `PrismaStudentsRepository` - Implementação com Prisma

**Storage:**
- `StorageUploader` - Interface para upload de arquivos
- `FirebaseStorageUploader` - Implementação com Firebase Storage

**Regras de Negócio:**
- Usuário pode ter múltiplos papéis (roles)
- Usuário pode ser ativado/inativado/banido
- StudentProfile é opcional e vinculado 1:1 com User
- Estudante pode ter múltiplas trilhas

### 2. **Projects (Projetos)**

**Aggregate Roots:**
- `Project` - Projeto acadêmico com metadados completos

**Entidades:**
- `Professor` - Professor orientador do projeto
- `Subject` - Disciplina relacionada ao projeto
- `Trail` - Trilha do curso (ex: Design Digital, Audiovisual, etc.)

**Value Objects:**
- `ProjectStatus` - Enum: DRAFT, PUBLISHED, ARCHIVED
- `SubjectType` - Enum: OBLIGATORY, ELECTIVE, OPTIONAL

**Use Cases:**
- `PublishProjectUseCase` - Criar/publicar novo projeto
- `GetProjectUseCase` - Obter detalhes de um projeto específico
- `SearchProjectsUseCase` - Buscar/filtrar projetos com estratégias
- `DeleteProjectUseCase` - Deletar projeto (apenas autor)
- `UploadProjectBannerUseCase` - Upload de imagem de banner
- `FetchProfessorsUseCase` - Listar todos os professores
- `FetchSubjectsUseCase` - Listar todas as disciplinas
- `FetchTrailsUseCase` - Listar todas as trilhas

**Repositórios:**
- `ProjectsRepository` - Interface abstrata
- `PrismaProjectsRepository` - Implementação com Prisma
- `ProfessorsRepository` - Interface para professores
- `SubjectsRepository` - Interface para disciplinas
- `TrailsRepository` - Interface para trilhas

**Search Strategies:**
- Estratégias de busca configuráveis por título, autor, disciplina, trilha, professor, ano

**Relacionamentos:**
- Project N:1 User (autor)
- Project N:1 Subject (disciplina opcional)
- Project N:M Professor (orientadores)
- Project N:M Trail (trilhas relacionadas)

**Regras de Negócio:**
- Projeto pode estar em rascunho, publicado ou arquivado
- Projeto pode permitir ou bloquear comentários
- Projeto deve ter autor (estudante)
- Projeto pode ter múltiplos professores e trilhas
- Apenas autor pode deletar o projeto

### 3. **Interactions (Interações)**

**Entidades:**
- `Comment` - Comentário em um projeto
- `Report` - Denúncia de comentário inapropriado

**Use Cases:**
- `CommentOnProjectUseCase` - Criar comentário em projeto
- `DeleteCommentUseCase` - Deletar comentário (autor ou moderador)
- `ListProjectCommentsUseCase` - Listar comentários de um projeto
- `ReportCommentUseCase` - Denunciar comentário

**Repositórios:**
- `CommentsRepository` - Interface abstrata
- `PrismaCommentsRepository` - Implementação com Prisma

**Relacionamentos:**
- Comment N:1 User (autor)
- Comment N:1 Project (projeto comentado)
- Report N:1 Comment (comentário denunciado)
- Report N:1 User (autor da denúncia)
- Report N:1 User (moderador que resolveu - opcional)

**Regras de Negócio:**
- Apenas usuários autenticados podem comentar
- Projeto precisa permitir comentários (`allowComments = true`)
- Autor do comentário ou moderador pode deletar
- Report pode ser resolvido por moderador/admin
- Um comentário pode ter múltiplas denúncias

## 🛠️ Stack Tecnológica

### Backend Framework
- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Linguagem tipada
- **Node.js 20+** - Runtime

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional
- **Prisma ORM** - ORM moderno para TypeScript
- **Firebase Storage** - Armazenamento de imagens

### Autenticação
- **JWT** - JSON Web Tokens
- **Passport.js** - Middleware de autenticação
- **BCrypt** - Hash de senhas

### Validação
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de dados
- **Zod** - Validação de schemas

### Testes
- **Vitest** - Framework de testes
- **Supertest** - Testes E2E de APIs

### Documentação
- **Swagger/OpenAPI** - Documentação interativa da API

### Qualidade de Código
- **Biome** - Linter e formatador

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração local

## 📝 Convenções de Código

### Nomenclatura
- **Use Cases:** `{Ação}UseCase` (ex: `RegisterUseCase`)
- **Entidades:** PascalCase (ex: `Student`, `Project`)
- **Value Objects:** PascalCase (ex: `Email`, `Username`)
- **Repositórios:** `{Entidade}Repository` (ex: `StudentsRepository`)
- **Controllers:** `{Recurso}Controller` (ex: `StudentsController`)
- **DTOs:** `{Ação}{Recurso}Dto` (ex: `CreateStudentDto`)

### Padrões
- **Dependency Injection:** Injeção de dependências via NestJS modules
- **Repository Pattern:** Abstração de acesso a dados (interfaces no domain, implementações na infra)
- **Use Case Pattern:** Encapsulamento de lógica de negócio em casos de uso isolados
- **DTO Pattern:** Validação e transformação de dados de entrada/saída com class-validator
- **Aggregate Pattern:** Entidades raiz que gerenciam consistência de agregados (User, Project)
- **Value Object Pattern:** Objetos imutáveis que representam valores (Email, Username, Semester)
- **Presenter Pattern:** Transformação de entidades de domínio para resposta HTTP
- **Strategy Pattern:** Estratégias de busca de projetos intercambiáveis

### Estrutura de Use Case
```typescript
export class ExemploUseCase {
  constructor(
    private readonly repository: Repository,
    // outras dependências
  ) {}

  async execute(params: Params): Promise<Result> {
    // 1. Validações
    // 2. Lógica de negócio
    // 3. Persistência
    // 4. Retorno
  }
}
```

### Estrutura de Controller
```typescript
@Controller('recurso')
export class RecursoController {
  constructor(private readonly useCase: UseCase) {}

  @Post()
  @ApiOperation({ summary: 'Descrição' })
  async handle(@Body() dto: Dto) {
    const result = await this.useCase.execute(dto);
    return RecursoPresenter.toHTTP(result);
  }
}
```

## 🔐 Autenticação e Autorização

### Sistema de Autenticação
- **Estratégia:** JWT (JSON Web Tokens) com Passport.js
- **Guard:** `JwtAuthGuard` - Protege rotas que requerem autenticação
- **Strategy:** `JwtStrategy` - Valida e decodifica tokens JWT
- **Decorator:** `@CurrentUser()` - Injeta usuário autenticado no controller
- **Token:** Enviado no header `Authorization: Bearer {token}`
- **Expiração:** Configurável via JWT_SECRET no .env

### Papéis (Roles) e Permissões

**Hierarquia de Papéis:**
1. **STUDENT** (Padrão)
   - Criar, editar e deletar próprios projetos
   - Comentar em projetos (se permitido)
   - Editar próprio perfil
   - Denunciar comentários

2. **CURATOR**
   - Todas as permissões de STUDENT
   - Gerenciar professores, disciplinas e trilhas
   - Aprovar/rejeitar projetos (futuro)

3. **MODERATOR**
   - Todas as permissões de CURATOR
   - Deletar comentários inapropriados
   - Resolver denúncias (reports)
   - Banir/desbanir usuários

4. **ADMIN**
   - Todas as permissões do sistema
   - Gerenciar papéis de usuários
   - Acesso total ao sistema

### Status de Usuário
- **ACTIVE** - Usuário ativo, pode usar o sistema normalmente
- **INACTIVE** - Usuário inativo, não pode fazer login
- **BANNED** - Usuário banido, bloqueado permanentemente

### Fluxo de Autenticação
1. Usuário faz POST em `/sessions` com email/username e senha
2. Sistema valida credenciais e retorna JWT
3. Cliente armazena token e envia em todas as requisições autenticadas
4. `JwtAuthGuard` valida token e injeta usuário no request
5. Controller acessa usuário via `@CurrentUser()` decorator

## 🗄️ Banco de Dados

### Prisma Schema Principal

**Tabelas Core:**

1. **`User`** - Usuários do sistema
   - Campos: id, name, username, email, passwordHash, about, profileUrl, role, status
   - Relacionamentos: 1:1 StudentProfile, 1:N Projects, 1:N Comments, 1:N Reports

2. **`StudentProfile`** - Perfil complementar do estudante
   - Campos: studentId (PK/FK), semester
   - Relacionamentos: 1:1 User, N:M Trail (via StudentHasTrail)

3. **`Project`** - Projetos acadêmicos
   - Campos: id, title, description, content, semester, publishedYear, status, allowComments, bannerUrl
   - Relacionamentos: N:1 User (author), N:1 Subject, N:M Professor, N:M Trail, 1:N Comments

4. **`Comment`** - Comentários em projetos
   - Campos: id, content, authorId, projectId
   - Relacionamentos: N:1 User, N:1 Project, 1:N Reports

5. **`Report`** - Denúncias de comentários
   - Campos: id, content, isResolved, resolvedAt, authorId, commentId, resolvedBy
   - Relacionamentos: N:1 User (author), N:1 Comment, N:1 User (resolver)

**Tabelas de Referência:**

6. **`Professor`** - Professores orientadores
   - Campos: id, name
   - Relacionamentos: N:M Project (via ProjectProfessor)

7. **`Subject`** - Disciplinas do curso
   - Campos: id, code, name, workload, semester, type
   - Relacionamentos: 1:N Projects

8. **`Trail`** - Trilhas do curso
   - Campos: id, name
   - Relacionamentos: N:M Student (via StudentHasTrail), N:M Project (via ProjectTrail)

**Tabelas de Relacionamento (Many-to-Many):**

9. **`StudentHasTrail`** - Estudante possui trilhas
   - PK composta: (studentId, trailId)

10. **`ProjectProfessor`** - Projeto tem orientadores
    - PK composta: (projectId, professorId)
    - Cascade delete quando projeto é deletado

11. **`ProjectTrail`** - Projeto associado a trilhas
    - PK composta: (projectId, trailId)
    - Cascade delete quando projeto é deletado

**Enums:**
- `UserRole`: STUDENT, CURATOR, MODERATOR, ADMIN
- `UserStatus`: ACTIVE, INACTIVE, BANNED
- `ProjectStatus`: DRAFT, PUBLISHED, ARCHIVED
- `SubjectType`: OBLIGATORY, ELECTIVE, OPTIONAL

### Migrações
```bash
pnpm db:migrate    # Criar e aplicar migrações
pnpm db:generate   # Gerar Prisma Client
pnpm db:seed       # Popular banco com dados iniciais
pnpm db:studio     # Interface visual do banco
pnpm db:deploy     # Deploy de migrações (produção)
```

## 🧪 Testes

### Tipos de Testes
- **Unitários:** `*.spec.ts` - Testam use cases isoladamente
- **E2E:** `test/**/*.e2e-spec.ts` - Testam endpoints completos
- **In-Memory Repositories:** Repositórios fake para testes unitários

### Comandos
```bash
pnpm test              # Testes unitários
pnpm test:watch        # Modo watch
pnpm test:e2e          # Testes E2E
pnpm test:coverage     # Cobertura
```

## 🚀 Desenvolvimento

### Setup
```bash
# 1. Instalar dependências
pnpm install

# 2. Subir banco de dados
docker compose up -d

# 3. Configurar .env
cp .env.example .env

# 4. Rodar migrações
pnpm db:migrate

# 5. Popular banco
pnpm db:seed

# 6. Iniciar servidor
pnpm start:dev
```

### Workflow
1. Criar/modificar entidades no `@core/domain`
2. Criar/modificar use cases no `@core/application`
3. Implementar repositórios no `@infra/database/prisma`
4. Criar controllers no `@presentation/modules`
5. Criar DTOs e validações
6. Escrever testes unitários
7. Escrever testes E2E
8. Documentar com Swagger

## 📚 Recursos Importantes

### Rotas da API

**Autenticação:**
- `POST /sessions` - Login (retorna JWT)

**Estudantes/Usuários:**
- `POST /students` - Registrar novo estudante
- `GET /students` - Listar todos os estudantes
- `GET /profiles` - Obter perfil do usuário autenticado 🔒
- `PUT /profiles` - Editar perfil do usuário autenticado 🔒
- `POST /profile-images/:username` - Upload de foto de perfil 🔒

**Projetos:**
- `GET /projects` - Buscar/listar projetos (com filtros)
- `GET /projects/:id` - Obter detalhes de um projeto
- `POST /projects` - Publicar novo projeto 🔒
- `PUT /projects/:id` - Editar projeto (apenas autor) 🔒
- `DELETE /projects/:id` - Deletar projeto (apenas autor) 🔒
- `POST /banners/:projectId` - Upload de banner do projeto 🔒

**Comentários:**
- `POST /projects/:id/comments` - Comentar em projeto 🔒
- `GET /projects/:id/comments` - Listar comentários de projeto
- `DELETE /comments/:id` - Deletar comentário (autor ou moderador) 🔒
- `POST /comments/:id/reports` - Denunciar comentário 🔒

**Tags/Referências:**
- `GET /professors` - Listar professores
- `GET /subjects` - Listar disciplinas
- `GET /trails` - Listar trilhas

🔒 = Requer autenticação (JWT)

### Documentação da API
- Swagger UI: `http://localhost:3333/docs`
- OpenAPI JSON: `http://localhost:3333/docs-json`

### Variáveis de Ambiente
```env
NODE_ENV=development
JWT_SECRET=deck-secret-key
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deck_dev

# Firebase (opcional - para upload de imagens)
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

## 🎯 Objetivos ao Modificar Código

1. **Manter Clean Architecture:** Respeitar as camadas e dependências (domain ← application ← infra ← presentation)
2. **Seguir DDD:** Entidades ricas com comportamento, lógica de negócio no domínio
3. **Testar:** Todo use case deve ter teste unitário com in-memory repositories
4. **Validar:** Usar DTOs com class-validator para toda entrada de dados
5. **Documentar:** Atualizar Swagger quando mudar/adicionar endpoints
6. **Tipagem:** Manter TypeScript strict mode ativo
7. **Imutabilidade:** Preferir readonly e const, value objects imutáveis
8. **Isolamento:** Use cases não devem depender de outros use cases diretamente
9. **Single Responsibility:** Cada classe/módulo deve ter uma única responsabilidade
10. **Interface Segregation:** Interfaces pequenas e específicas

## 🧩 Padrões de Código Específicos

### Criando uma Entidade de Domínio
```typescript
import { Entity } from '@/@shared/kernel/kernel/entity'
import type { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

export interface MinhaEntidadeProps {
  nome: string
  descricao?: string
}

export class MinhaEntidade extends Entity<MinhaEntidadeProps> {
  // Factory method para criar nova instância
  static create(props: MinhaEntidadeProps, id?: UniqueEntityID): MinhaEntidade {
    return new MinhaEntidade(props, id)
  }

  // Factory method para reconstituir do banco
  static reconstitute(
    props: MinhaEntidadeProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt: Date,
  ): MinhaEntidade {
    return new MinhaEntidade(props, id, createdAt, updatedAt)
  }

  // Métodos de negócio
  public mudarNome(novoNome: string) {
    this.props.nome = novoNome
    this.touch() // Atualiza updatedAt
  }

  // Getters
  get nome() {
    return this.props.nome
  }

  get descricao() {
    return this.props.descricao
  }
}
```

### Criando um Value Object
```typescript
import { Either, left, right } from '@/@shared/kernel/utils/either'

export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Either<Error, Email> {
    if (!this.isValid(email)) {
      return left(new Error('Email inválido'))
    }
    return right(new Email(email))
  }

  private static isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  toString(): string {
    return this.value
  }
}
```

### Criando um Use Case
```typescript
import { Injectable } from '@nestjs/common'
import type { Either } from '@/@shared/kernel/utils/either'
import { right, left } from '@/@shared/kernel/utils/either'

interface MeuUseCaseRequest {
  parametro: string
}

type MeuUseCaseResponse = Either<Error, ResultType>

@Injectable()
export class MeuUseCase {
  constructor(
    private readonly repository: MeuRepository,
    // outras dependências
  ) {}

  async execute(request: MeuUseCaseRequest): Promise<MeuUseCaseResponse> {
    // 1. Validações
    if (!request.parametro) {
      return left(new Error('Parâmetro obrigatório'))
    }

    // 2. Lógica de negócio
    const entidade = await this.repository.findById(request.parametro)
    
    if (!entidade) {
      return left(new Error('Entidade não encontrada'))
    }

    // 3. Operações
    entidade.fazerAlgo()

    // 4. Persistência
    await this.repository.save(entidade)

    // 5. Retorno
    return right(entidade)
  }
}
```

### Criando um Controller
```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/presentation/modules/auth/guards/jwt-auth.guard'
import { CurrentUser } from '@/presentation/modules/auth/decorators/current-user.decorator'
import { MeuUseCase } from '@/@core/application/...'
import { MeuDto } from '../dto/meu.dto'
import { MeuPresenter } from '@/presentation/presenters/meu.presenter'

@ApiTags('meu-recurso')
@Controller('meu-recurso')
export class MeuController {
  constructor(private readonly meuUseCase: MeuUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar recurso' })
  async handle(
    @Body() dto: MeuDto,
    @CurrentUser() userId: string,
  ) {
    const result = await this.meuUseCase.execute({
      ...dto,
      userId,
    })

    if (result.isLeft()) {
      throw result.value // Erro será tratado por exception filter
    }

    return MeuPresenter.toHTTP(result.value)
  }
}
```

### Criando um DTO
```typescript
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator'

export class MeuDto {
  @ApiProperty({ description: 'Nome do recurso', example: 'Meu Recurso' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nome: string

  @ApiProperty({ description: 'Descrição opcional', required: false })
  @IsString()
  @IsOptional()
  descricao?: string
}
```

### Criando um Presenter
```typescript
export class MeuPresenter {
  static toHTTP(entidade: MinhaEntidade) {
    return {
      id: entidade.id.toString(),
      nome: entidade.nome,
      descricao: entidade.descricao,
      criadoEm: entidade.createdAt,
      atualizadoEm: entidade.updatedAt,
    }
  }
}
```

## 🚨 Pontos de Atenção

### Ao Adicionar Novos Recursos
- [ ] Criar entidade no `@core/domain/{contexto}/entities`
- [ ] Criar value objects necessários em `@core/domain/{contexto}/value-objects`
- [ ] Criar use case com testes em `@core/application/{contexto}/use-cases`
- [ ] Criar interface de repositório em `@core/application/{contexto}/repositories`
- [ ] Implementar repositório Prisma em `@infra/database/prisma/repositories`
- [ ] Criar mapper em `@infra/database/prisma/mappers` (domain ↔ Prisma)
- [ ] Criar controller em `@presentation/modules/{contexto}/controllers`
- [ ] Criar DTOs com validações em `@presentation/modules/{contexto}/dto`
- [ ] Criar presenter em `@presentation/presenters`
- [ ] Adicionar validações com class-validator nos DTOs
- [ ] Documentar endpoints com decorators do Swagger
- [ ] Criar testes E2E em `test/{contexto}.e2e-spec.ts`
- [ ] Atualizar Prisma schema se necessário
- [ ] Criar e aplicar migração
- [ ] Atualizar seed se necessário

### Ao Modificar Existentes
- [ ] Verificar impacto em use cases dependentes
- [ ] Atualizar testes unitários afetados
- [ ] Atualizar testes E2E afetados
- [ ] Atualizar mappers se estrutura mudou
- [ ] Manter compatibilidade de API quando possível (versionamento)
- [ ] Atualizar documentação Swagger
- [ ] Criar migração se schema mudou
- [ ] Atualizar seed se dados iniciais mudaram

### Cuidados Especiais
- **Aggregate Roots:** Sempre modificar agregados através de métodos públicos, nunca diretamente
- **Value Objects:** São imutáveis, sempre criar novos em vez de modificar
- **Repositórios:** Sempre retornar entidades de domínio, nunca objetos Prisma
- **Mappers:** Manter sincronizados com schema do Prisma e entidades de domínio
- **Use Cases:** Devem ser independentes e testáveis isoladamente
- **DTOs:** Sempre validar entrada do usuário com class-validator
- **Presenters:** Nunca expor entidades de domínio diretamente na API
- **Migrations:** Nunca editar migrações já aplicadas, sempre criar novas

## 🔍 Comandos Úteis para Agentes

```bash
# Estrutura do projeto
tree src -I "node_modules|dist|coverage"

# Buscar por padrões
grep -r "UseCase" src/@core/application
grep -r "Repository" src/@infra/database

# Verificar código
pnpm check

# Rodar testes específicos
pnpm test -- users
pnpm test:e2e -- students

# Ver logs do Docker
docker compose logs -f
```

## 📖 Referências

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Última atualização:** 2025-01-30
**Versão do Projeto:** 1.0.0
