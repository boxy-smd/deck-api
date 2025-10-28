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
> - **`POST` /banners/:projectId** _Realiza o upload do banner do projeto._

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
- [Fastify](https://fastify.dev)
- [@fastify/jwt](https://github.com/fastify/fastify-jwt)
- [@fastify/cookie](https://github.com/fastify/fastify-cookie)
- [@fastify/swagger](https://github.com/fastify/fastify-swagger)
- [@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui)
- [Node.js](https://nodejs.org/en)
- [Zod](https://zod.dev)
- [BCrypt](https://www.npmjs.com/package/bcrypt)

### **Banco de Dados**

- [Prisma](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Firebase Storage](https://firebase.google.com/docs/storage)

### **Testes**

- [Vitest](https://vitest.dev)
- [Supertest](https://www.npmjs.com/package/supertest)

### **IDE, Versionamento e Deploy**

- [Visual Studio Code](https://code.visualstudio.com)
- [Git](https://git-scm.com)
- [GitHub](https://github.com)

## :rocket: **Configurações e Instalação**

### Requisitos

- [Node](https://nodejs.org/) e [pnpm](https://pnpm.io/pt/).
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/).

```sh
# Caso não tenha o pnpm, execute:
npm install -g pnpm
```

Recomendo que veja a [documentação de configuração do Fastify](https://fastify.dev/docs/latest/Reference/).

```sh
# Clonando o projeto
git clone https://github.com/boxy-smd/deck-api.git
cd deck-api

# Instalando as dependências
pnpm install

# Configurando o banco de dados (desenvolvimento)
# Opção 1: Usando Docker (recomendado)
docker compose -f docker-compose.dev.yml up -d

# Opção 2: Usando PostgreSQL local
# Certifique-se de ter o PostgreSQL instalado e rodando

# Configurar variáveis de ambiente
# Copie o arquivo de exemplo e preencha os valores
cp .env.example .development.env
# Edite o arquivo .development.env com suas configurações

# Fazendo as migrações para o banco de dados
pnpm db:migrate

# Popular o banco de dados com as informações necessárias do sistema
pnpm db:seed

# Rodar o servidor em desenvolvimento
pnpm start:dev

# Acessar a documentação da API
# Abra http://localhost:3333/docs no navegador
```

### Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.development.env`:

```env
# Ambiente
NODE_ENV=development

# JWT (gere uma chave secreta forte)
JWT_SECRET=sua-chave-secreta-aqui

# Servidor
PORT=3333

# Banco de Dados PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=deck_dev
POSTGRES_HOST=localhost
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deck_dev

# Firebase (obtenha no Console do Firebase)
FIREBASE_API_KEY=sua-api-key
FIREBASE_APP_ID=seu-app-id
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
```

### Testes

```sh
# Iniciar testes gerais
pnpm test

# Iniciar testes E2E (requer banco de dados rodando)
pnpm test:e2e

# Testes com cobertura
pnpm test:coverage
```

### Build e Produção

```sh
# Compilar e minificar para produção
pnpm build

# Rodar em produção (após build)
pnpm start

# Ou usando Docker Compose
docker compose up -d
```

---

Feito com 💙 e ☕ por Boxy.
