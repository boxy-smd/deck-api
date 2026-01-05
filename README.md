# Deck API

## :bookmark: **Sumário**

- [Sobre o Projeto](#black_joker-sobre-o-projeto)
- [Rotas do Projeto](#file_folder-rotas-do-projeto)
- [Tecnologias](#wrench-tecnologias)
  - [Construção da API](#construção-da-api)
  - [Testes](#testes)
  - [IDE, Versionamento e Deploy](#ide-versionamento-e-deploy)
- [Configurações e Instalação](#rocket-configurações-e-instalação)
  - [Requisitos](#requisitos)
- [Licença](#balance_scale-licença)

## :black_joker: **Sobre o Projeto**

Deck é uma aplicação que servirá como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.

## :file_folder: Rotas do Projeto

## Estudantes

> - **`POST` /profile-images/:username** _Realiza o upload da imagem de perfil do estudante._
> - **`POST` /students** _Regista um estudante._
> - **`POST` /sessions** _Autentica um estudante._
> - **`GET` /students** _Lista os estudantes._
> - **`GET` /profiles** _Obtém o perfil de um estudante._
> - **`PUT` /profiles** _Edita o perfil de um estudante._

## Projetos

> - **`GET` /projects** _Lista os projetos._
> - **`GET` /projects/:id** _Obtém os detlhes de um projeto._
> - **`POST` /projects** _Publica um projeto._
> - **`PUT` /projects/:id** _Edita um projeto._
> - **`DELETE` /projects** _Exclui um projeto._
> - **`POST` /projects/:projectId/banner** _Realiza o upload do banner do projeto._

### Tags

> - **`GET` /professors** _Lista os professores._
> - **`GET` /subjects** _Lista as disciplinas._
> - **`GET` /trails** _Lista as trilhas._

### Comentários

> - **`POST` /projects/:id/comments** _Comenta em um projeto._

Encontre a documentação completa [aqui](https://deck-api.onrender.com/docs).

## :wrench: **Tecnologias**

Tecnologias utilizadas no projeto.

### **Construção da API**

- [TypeScript](https://www.typescriptlang.org)
- [NestJS](https://nestjs.com/)
- [@nestjs/jwt](https://github.com/nestjs/jwt)
- [@nestjs/swagger](https://github.com/nestjs/swagger)
- [Node.js](https://nodejs.org/en)
- [Zod](https://zod.dev)
- [BCrypt](https://www.npmjs.com/package/bcrypt)

### **Banco de Dados**

- [Drizzle ORM](https://orm.drizzle.team/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

### **Testes**

- [Vitest](https://vitest.dev)
- [Supertest](https://www.npmjs.com/package/supertest)

### **IDE, Versionamento e Deploy**

- [Visual Studio Code](https://code.visualstudio.com)
- [Git](https://git-scm.com)
- [GitHub](https://github.com)

## :rocket: **Configurações e Instalação**

### Requisitos

- [Node](https://nodejs.org/) e [pnpm](https://pnpm.io/pt/)
- [Docker](https://www.docker.com/) e Docker Compose

## 🐳 Rodar com Docker

Simples e rápido:

```bash
# 1. Clonar
git clone https://github.com/boxy-smd/deck-api.git
cd deck-api

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e configure JWT_SECRET

# 3. Iniciar
docker compose up -d

# Acessar: http://localhost:3333/docs
```

**Comandos:**
```bash
docker compose up -d      # Iniciar
docker compose down       # Parar
docker compose logs -f    # Ver logs
```
```

```sh
# Caso não tenha o pnpm:
npm install -g pnpm
```

### Setup do Projeto

```sh
# 1. Clonar o projeto
git clone https://github.com/boxy-smd/deck-api.git
cd deck-api

# 2. Instalar dependências
pnpm install

# 3. Subir PostgreSQL com Docker
docker compose up -d

# 4. Configurar variáveis de ambiente
cp .env.example .env
# O .env já vem configurado para o Docker

# 5. Rodar migrações do banco
pnpm db:migrate

# 6. Popular o banco com dados iniciais
pnpm db:seed

# 7. Iniciar servidor de desenvolvimento
pnpm start:dev
```

### Variáveis de Ambiente

O arquivo `.env` já vem configurado para usar o PostgreSQL do Docker:

```env
NODE_ENV=development
JWT_SECRET=deck-secret-key
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deck_dev
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=uploads
```

### Comandos Docker

```sh
# Subir PostgreSQL
docker compose up -d

# Ver logs
docker compose logs -f

# Parar PostgreSQL
docker compose down

# Parar e remover volumes (apaga dados)
docker compose down -v
```

### Comandos Disponíveis

```sh
# Desenvolvimento
pnpm dev                # Inicia servidor em modo watch
pnpm build              # Compila o projeto
pnpm start              # Roda versão compilada

# Testes
pnpm test               # Testes unitários
pnpm test:unit          # Testes unitários com coverage
pnpm test:e2e           # Testes E2E
pnpm test:all           # Todos os testes
pnpm test:watch         # Watch mode

# Banco de Dados
pnpm db:generate        # Gera migrations
pnpm db:migrate         # Aplica migrações
pnpm db:seed            # Popula banco
pnpm db:studio          # Abre Drizzle Studio
pnpm db:setup           # Migrate + Seed

# Qualidade de Código
pnpm check              # Lint e formatação
pnpm lint:check         # Apenas lint check
pnpm format:check       # Apenas format check
pnpm typecheck          # Type checking

# Docker
pnpm docker:dev         # Subir apenas Postgres
pnpm docker:up          # Subir todos os serviços
pnpm docker:down        # Parar serviços
pnpm docker:logs        # Ver logs

# Utilitários
pnpm setup              # Setup completo do ambiente
pnpm clean              # Limpar build artifacts
```

---

Feito com 💙 e ☕ por Boxy.
