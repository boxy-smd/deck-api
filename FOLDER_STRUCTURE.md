# 🏗️ Estrutura de Pastas - DDD + Clean Architecture

## 📁 Visão Geral

```
src/
├── @core/                          # 🎯 Camada de Domínio (DDD)
│   ├── domain/                     # Entidades, Value Objects e Regras de Negócio
│   └── application/                # Casos de Uso e Factories
├── @infra/                         # 🔧 Camada de Infraestrutura
│   ├── database/                   # Persistência (Prisma, Firebase)
│   ├── cryptography/               # Criptografia (Bcrypt)
│   └── config/                     # Configurações (Env, Firebase)
├── @shared/                        # 🔗 Código Compartilhado
│   └── kernel/                     # DDD Building Blocks
├── @presentation/                  # 🎨 Camada de Apresentação (NestJS)
│   ├── modules/                    # Módulos NestJS
│   ├── presenters/                 # View Models
│   ├── app.module.ts              # Módulo raiz
│   └── main.ts                    # Bootstrap da aplicação
└── test/                          # 🧪 Testes
    ├── e2e/                       # Testes E2E
    ├── factories/                 # Factories para testes
    └── repositories/              # Repositórios in-memory
```

---

## 🎯 @core/ - Camada de Domínio

### domain/ - Bounded Contexts (DDD)

Contém as entidades, value objects e regras de negócio organizados por Bounded Context.

```
@core/domain/
├── authentication/                 # BC: Autenticação e Perfis
│   ├── enterprise/
│   │   ├── entities/              # User, StudentProfile
│   │   └── value-objects/         # Email, Username, Semester
│   └── application/
│       ├── use-cases/             # Register, Login, EditProfile
│       ├── repositories/          # UsersRepository (interface)
│       ├── cryptography/          # Encrypter, Hasher (interfaces)
│       └── storage/               # Uploader (interface)
├── interaction/                   # BC: Interações (Comentários/Reports)
│   ├── enterprise/
│   │   └── entities/              # Comment, Report
│   └── application/
│       ├── use-cases/             # CommentOnProject, DeleteComment
│       └── repositories/          # CommentsRepository, ReportsRepository
└── projects/                      # BC: Projetos e Deck
    ├── enterprise/
    │   └── entities/              # Project, Professor, Subject, Trail
    └── application/
        ├── use-cases/             # PublishProject, FetchPosts, etc
        └── repositories/          # ProjectsRepository, etc
```

**Características:**
- ✅ **Zero dependências externas** (framework-agnostic)
- ✅ Apenas lógica de negócio pura
- ✅ Entidades ricas com comportamento
- ✅ Separação por Bounded Context (DDD)
- ✅ Interfaces para inversão de dependência

### application/factories/ - Factories de Use Cases

Factories que instanciam os use cases com suas dependências.

```
@core/application/factories/
├── students/                      # Factories de autenticação
│   ├── make-register-use-case.ts
│   ├── make-login-use-case.ts
│   └── make-edit-profile-use-case.ts
├── projects/                      # Factories de projetos
│   ├── make-publish-project-use-case.ts
│   └── make-fetch-posts-use-case.ts
└── comments/                      # Factories de comentários
    └── make-comment-on-project-use-case.ts
```

**Características:**
- ✅ Dependency Injection manual
- ✅ Usadas pelos controllers NestJS
- ✅ Facilitam testes e manutenção

---

## 🔧 @infra/ - Camada de Infraestrutura

Implementações concretas de interfaces definidas no domínio.

```
@infra/
├── database/
│   ├── prisma/
│   │   ├── repositories/          # Implementações de repositórios
│   │   ├── mappers/               # Mappers Domain ↔ Prisma
│   │   ├── prisma.service.ts      # Serviço Prisma (NestJS)
│   │   └── prisma.module.ts       # Módulo Prisma (NestJS)
│   └── firebase/
│       ├── profile-uploader.ts    # Implementação de upload
│       └── banner-uploader.ts
├── cryptography/
│   └── bcrypt-hasher.ts          # Implementação Hasher com Bcrypt
└── config/
    ├── env/                       # Validação de variáveis de ambiente
    └── services/                  # Configuração Firebase
```

**Características:**
- ✅ Implementa interfaces do domínio
- ✅ Usa libs externas (Prisma, Firebase, Bcrypt)
- ✅ Camada mais volátil (pode ser substituída)

---

## 🔗 @shared/ - Código Compartilhado

Building blocks do DDD e código utilitário.

```
@shared/kernel/
├── kernel/
│   ├── entity.ts                  # Classe base Entity
│   ├── value-object.ts            # Classe base ValueObject
│   ├── aggregate-root.ts          # Classe base AggregateRoot
│   ├── unique-entity-id.ts        # ValueObject para IDs
│   └── watched-list.ts            # Padrão WatchedList
├── errors/
│   ├── resource-not-found.error.ts
│   └── forbidden.error.ts
├── types/
│   └── optional.ts                # Type helper
└── either.ts                      # Monad Either (functional programming)
```

**Características:**
- ✅ Code building blocks do DDD
- ✅ Padrões e abstrações reutilizáveis
- ✅ Framework-agnostic

---

## 🎨 @presentation/ - Camada de Apresentação (NestJS)

Interface com o mundo externo (HTTP, controllers, DTOs).

```
@presentation/
├── modules/
│   ├── auth/                      # Módulo de autenticação JWT
│   │   ├── guards/                # JWT Guard
│   │   ├── strategies/            # JWT Strategy (Passport)
│   │   └── auth.module.ts
│   ├── students/                  # Módulo de estudantes
│   │   ├── controllers/           # StudentsController
│   │   ├── dto/                   # DTOs com validação
│   │   └── students.module.ts
│   ├── projects/                  # Módulo de projetos
│   ├── comments/                  # Módulo de comentários
│   └── ...
├── presenters/                    # View Models (transformação de domínio → HTTP)
│   ├── student-profile.ts
│   ├── project-details.ts
│   └── post.ts
├── app.module.ts                  # Módulo raiz NestJS
└── main.ts                        # Bootstrap NestJS
```

**Características:**
- ✅ 100% NestJS (decorators, modules, guards)
- ✅ DTOs com class-validator
- ✅ Controllers chamam factories de use cases
- ✅ Presenters transformam domain → HTTP response
- ✅ Swagger/OpenAPI documentação

---

## 🧪 test/ - Testes

```
test/
├── e2e/
│   ├── setup-app.ts              # Helper para inicializar NestJS
│   ├── create-and-authenticate-students.ts
│   └── legacy/                   # Testes E2E antigos (Fastify)
├── factories/                    # Factories para testes
│   ├── make-user.ts
│   ├── make-project.ts
│   └── make-comment.ts
└── repositories/                 # Repositórios in-memory
    ├── users-repository.ts
    └── projects-repository.ts
```

---

## 🎯 Princípios Aplicados

### Clean Architecture ✅

```
┌─────────────────────────────────────────┐
│         @presentation (NestJS)          │  ← Frameworks & Drivers
├─────────────────────────────────────────┤
│         @infra (Prisma, Firebase)       │  ← Interface Adapters
├─────────────────────────────────────────┤
│   @core/application (Use Cases)         │  ← Application Business Rules
├─────────────────────────────────────────┤
│   @core/domain (Entities, VOs)          │  ← Enterprise Business Rules
└─────────────────────────────────────────┘
```

**Regra de Dependência:** As camadas internas não conhecem as externas.

### Domain-Driven Design (DDD) ✅

- ✅ **Bounded Contexts**: authentication, interaction, projects
- ✅ **Entities**: User, Project, Comment
- ✅ **Value Objects**: Email, Username, Semester
- ✅ **Aggregate Roots**: User, Project
- ✅ **Repositories**: Interfaces no domínio
- ✅ **Domain Events**: (não implementado ainda)
- ✅ **Ubiquitous Language**: Nomenclatura do domínio

### SOLID ✅

- **S**ingle Responsibility: Cada classe/módulo tem uma responsabilidade
- **O**pen/Closed: Extensível via interfaces
- **L**iskov Substitution: Implementações respeitam contratos
- **I**nterface Segregation: Interfaces pequenas e específicas
- **D**ependency Inversion: Domínio define interfaces, infra implementa

---

## 📚 Paths de Import

### TypeScript Paths (tsconfig.json)

```json
{
  "paths": {
    "@/@core/*": ["./src/@core/*"],
    "@/@infra/*": ["./src/@infra/*"],
    "@/@shared/*": ["./src/@shared/*"],
    "@/@presentation/*": ["./src/@presentation/*"],
    "@/*": ["./src/*"],
    "test/*": ["./test/*"]
  }
}
```

### Exemplos de Uso

```typescript
// Domínio
import { User } from '@/@core/domain/authentication/enterprise/entities/user'
import { Email } from '@/@core/domain/authentication/enterprise/value-objects/email'

// Use Cases
import { RegisterUseCase } from '@/@core/domain/authentication/application/use-cases/register'

// Factories
import { makeRegisterUseCase } from '@/@core/application/factories/students/make-register-use-case'

// Infra
import { PrismaStudentsRepository } from '@/@infra/database/prisma/repositories/students-repository'

// Shared
import { left, right } from '@/@shared/kernel/either'
import { Entity } from '@/@shared/kernel/kernel/entity'

// Presentation
import { StudentsController } from '@/@presentation/modules/students/controllers/students.controller'
```

---

## ✅ Benefícios da Estrutura

### 1. Testabilidade
- Domínio isolado = fácil de testar
- Repositórios in-memory para testes rápidos
- 79 testes de unidade passando

### 2. Manutenibilidade
- Camadas bem definidas
- Separação de responsabilidades
- Código organizado por contexto

### 3. Escalabilidade
- Fácil adicionar novos bounded contexts
- Cada camada pode evoluir independentemente
- Novos módulos NestJS não afetam o domínio

### 4. Flexibilidade
- Trocar Prisma por outro ORM: apenas @infra
- Trocar NestJS por Express: apenas @presentation
- Domínio permanece intacto

### 5. Clareza
- Estrutura auto-explicativa
- Nomenclatura consistente
- Fácil para novos desenvolvedores

---

## 🚀 Próximos Passos

1. **Domain Events** - Implementar eventos de domínio
2. **CQRS** - Separar comandos de queries
3. **Event Sourcing** - Para auditoria (opcional)
4. **Hexagonal Ports** - Explicitar portas e adaptadores

---

**Última atualização**: 29 de Outubro de 2025
**Versão**: 2.0.0 (DDD + Clean Architecture)
