## 🐳 Docker Setup Completo

Arquivos criados:
- ✅ Dockerfile (aplicação Node.js)
- ✅ docker-compose.yml (app + PostgreSQL)
- ✅ .dockerignore (otimizado)
- ✅ tsup.config.ts (build configurado)

### Como usar:

1️⃣ **Iniciar aplicação e banco:**
```bash
docker compose up --build
```

2️⃣ **Acessar aplicação:**
- API: http://localhost:3333
- Postgres: localhost:5432

3️⃣ **Parar:**
```bash
docker compose down
```

4️⃣ **Limpar dados:**
```bash
docker compose down -v
```

### Variáveis de ambiente (opcional):

Edite as variáveis no docker-compose.yml ou use arquivo .env:
- JWT_SECRET
- DATABASE_URL
- Configurações Firebase

**Status:** ✅ Build testado e funcionando!
