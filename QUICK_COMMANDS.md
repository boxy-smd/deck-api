# Comandos Rápidos - Migração NestJS

## 🚀 Desenvolvimento

```bash
# Iniciar em modo desenvolvimento (watch mode)
pnpm run start:dev

# Build do projeto
pnpm run build

# Rodar em produção (após build)
pnpm run start
```

## 🧪 Testes

```bash
# Testes unitários
pnpm run test

# Testes E2E
pnpm run test:e2e

# Coverage
pnpm run test:coverage
```

## 🗄️ Banco de Dados

```bash
# Gerar Prisma Client
pnpm run db:generate

# Criar migration
pnpm run db:migrate

# Aplicar migrations em produção
pnpm run db:deploy

# Abrir Prisma Studio
pnpm run db:studio

# Seed do banco
pnpm run db:seed
```

## 🔧 Scripts de Migração

```bash
# Remover extensões .ts dos imports (já executado)
pnpm exec tsx scripts/remove-ts-extensions.ts
```

## 🏗️ Gerar Recursos NestJS

```bash
# Gerar módulo
nest generate module modules/nome-modulo

# Gerar controller
nest generate controller modules/nome-modulo

# Gerar service
nest generate service modules/nome-modulo

# Gerar guard
nest generate guard modules/nome-modulo/guards/nome-guard

# Gerar interceptor
nest generate interceptor shared/interceptors/nome-interceptor

# Gerar filter
nest generate filter shared/filters/nome-filter

# Gerar DTO class
nest generate class modules/nome-modulo/dto/nome.dto --no-spec
```

## 🧹 Linting e Formatação

```bash
# Formatar código
pnpm run fix

# Lint código
pnpm run lint

# Check (lint + format)
pnpm run check
```

## 📦 Dependências

```bash
# Instalar dependências
pnpm install

# Adicionar nova dependência
pnpm add nome-pacote

# Adicionar dev dependency
pnpm add -D nome-pacote

# Remover dependência
pnpm remove nome-pacote
```

## 🔍 Debugging

```bash
# Build em modo verbose
nest build --verbose

# Start com debug
nest start --debug --watch

# Verificar informações do Nest CLI
nest info
```

## 📝 Atalhos Úteis

```bash
# Ver estrutura de um módulo
ls src/modules/nome-modulo

# Buscar por imports com .ts (verificar se ainda existem)
grep -r "from.*\.ts'" src/

# Contar arquivos TypeScript
find src -name "*.ts" | wc -l

# Verificar se o build passa (apenas compilação, sem executar)
pnpm run build --dry-run
```

## 🎯 Workflow Recomendado para Migrar um Módulo

```bash
# 1. Criar estrutura do módulo
nest generate module modules/exemplo
nest generate controller modules/exemplo
mkdir src/modules/exemplo/dto

# 2. Criar DTOs manualmente
# Criar arquivo: src/modules/exemplo/dto/create-exemplo.dto.ts

# 3. Implementar controller usando use cases existentes
# Editar: src/modules/exemplo/exemplo.controller.ts

# 4. Adicionar módulo ao AppModule
# Editar: src/app.module.ts

# 5. Testar build
pnpm run build

# 6. Testar endpoints
pnpm run start:dev
# Testar com curl, Postman ou Insomnia
```

## 🐛 Solução de Problemas Comuns

```bash
# Erro de imports com .ts
pnpm exec tsx scripts/remove-ts-extensions.ts

# Erro de decorators
# Verificar tsconfig.json: experimentalDecorators e emitDecoratorMetadata

# Erro de Prisma Client
pnpm run db:generate

# Limpar build
rm -rf dist/
pnpm run build

# Limpar node_modules e reinstalar
rm -rf node_modules/
pnpm install
```

## 📚 Documentação

```bash
# Abrir documentação local (após iniciar o servidor)
# http://localhost:3333/docs

# Ver swagger.json
# http://localhost:3333/swagger.json

# Health check
# http://localhost:3333/health-check
```

## 🔑 Variáveis de Ambiente

```bash
# Copiar .env.example para .env
cp .env.example .env

# Editar variáveis de ambiente
nano .env  # ou code .env
```

Variáveis necessárias:
- `NODE_ENV` - dev | test | production
- `PORT` - Porta do servidor (default: 3333)
- `DATABASE_URL` - URL do PostgreSQL
- `JWT_SECRET` - Secret para JWT
- `FIREBASE_*` - Configurações Firebase (opcional)
