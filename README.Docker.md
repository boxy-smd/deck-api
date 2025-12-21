# 🐳 Docker Setup - Deck API

## Arquivos de Configuração

### Dockerfile
- **Build multi-stage** otimizado para produção
- **Stage 1 (builder)**: Compila a aplicação TypeScript
- **Stage 2 (runner)**: Imagem final enxuta apenas com produção

### docker-compose.yml
Orquestra dois serviços:
- **postgres**: PostgreSQL 16 com healthcheck
- **app**: API NestJS buildada do Dockerfile

### .dockerignore
Exclui arquivos desnecessários do build context (tests, docs, dev files)

## 🚀 Quick Start

### 1. Preparar ambiente
```bash
# Copiar env para Docker
cp .env.docker.example .env

# Editar variáveis sensíveis (JWT_SECRET, Firebase, etc)
```

### 2. Build e Start
```bash
# Build da imagem (primeira vez ou após mudanças no código)
docker compose build

# Subir serviços
docker compose up -d

# Ver logs
docker compose logs -f app
```

### 3. Verificar saúde
```bash
# Check status
docker compose ps

# Health endpoint
curl http://localhost:3333/health
```

## 📦 Comandos Úteis

```bash
# Build sem cache (força rebuild completo)
docker compose build --no-cache

# Parar serviços
docker compose down

# Parar e remover volumes (⚠️ apaga dados do banco)
docker compose down -v

# Logs específicos
docker compose logs postgres
docker compose logs app

# Executar comando dentro do container
docker compose exec app sh
docker compose exec postgres psql -U postgres -d deck_dev

# Rebuild apenas a aplicação
docker compose up --build -d app
```

## 🔧 Troubleshooting

### Build muito lento
O build inicial baixa ~900 pacotes npm e pode levar 10-15min dependendo da conexão.
**Solução**: Builds subsequentes usam cache de layers e são muito mais rápidos.

### Erro de conexão com banco
```bash
# Verificar se postgres está healthy
docker compose ps

# Se unhealthy, ver logs
docker compose logs postgres

# Reiniciar apenas o postgres
docker compose restart postgres
```

### Migrations não rodam
```bash
# Rodar migrations manualmente
docker compose exec app pnpm db:migrate

# Ver schema atual
docker compose exec app pnpm db:studio
```

### Port já em uso
```bash
# Verificar processo usando porta 3333
netstat -ano | findstr :3333  # Windows
lsof -i :3333                 # Linux/Mac

# Trocar porta no docker-compose.yml
ports:
  - "3334:3333"  # host:container
```

## 🏗️ Build Otimizações

### Cache de dependências
```dockerfile
# Copia apenas package.json primeiro
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Depois copia código (invalida cache apenas se código mudar)
COPY . .
```

### Prod vs Dev
```bash
# Produção (FROM Dockerfile)
docker compose up -d

# Desenvolvimento (bind mount do código fonte)
# Criar docker-compose.dev.yml se necessário
```

## 🔐 Segurança

- Container roda como usuário `nestjs` (não-root)
- Healthcheck monitora disponibilidade
- Secrets via `.env` (não commitados)
- Multi-stage reduz surface attack

## 📊 Monitoramento

```bash
# Stats de recursos
docker stats deck-api deck-postgres

# Inspect detalhado
docker inspect deck-api
docker inspect deck-postgres

# Ver health history
docker inspect --format='{{json .State.Health}}' deck-api | jq
```

## 🎯 CI/CD Integration

```yaml
# Exemplo GitHub Actions
- name: Build Docker
  run: docker compose build

- name: Test in Docker
  run: |
    docker compose up -d
    docker compose exec -T app pnpm test:e2e
    docker compose down
```

## 📝 Notas

- **DATABASE_URL** no `.env` deve apontar para `@postgres:5432` (nome do service)
- **Migrations** rodam automaticamente no `CMD` do container
- **Node 20 Alpine** usada para imagem menor (~150MB vs ~1GB)
- **pnpm** instalado via corepack (built-in no Node 20+)
