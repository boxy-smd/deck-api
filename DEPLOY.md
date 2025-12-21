# 🚀 Guia de Deploy - Deck API

## 📦 Banco de Dados - Neon

### ✅ Projeto Criado

Seu banco de dados PostgreSQL já foi criado no Neon:

- **Project ID:** `snowy-fog-99236498`
- **Branch:** `main` (ID: br-wild-band-af3q8ptb)
- **Database:** `neondb`
- **Region:** AWS US West 2

### 🔗 Connection String

```
postgresql://neondb_owner:npg_DR8zltgB6XKa@ep-lucky-bar-af530z8t-pooler.c-2.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

### ✨ Migrações

As migrações do banco já foram aplicadas com sucesso! O schema inclui:
- ✅ Tabelas de usuários (users, student_profiles)
- ✅ Tabelas de projetos (projects, professors, subjects, trails)
- ✅ Tabelas de interações (comments, reports)
- ✅ Relacionamentos Many-to-Many (project_professors, project_trails)
- ✅ Enums (UserRole, UserStatus, ProjectStatus, SubjectType)

## 🌐 Deploy no Render

### Opção 1: Deploy Automático (Blueprint)

1. **Push o código para o GitHub** (se ainda não fez):
   ```bash
   git add .
   git commit -m "feat: add render configuration"
   git push origin production
   ```

2. **Acesse o Render Dashboard:**
   - Vá para: https://dashboard.render.com/
   - Clique em "New" → "Blueprint"

3. **Conecte o Repositório:**
   - Selecione o repositório `deck-api`
   - Branch: `production`
   - O Render detectará automaticamente o `render.yaml`

4. **Configure as Variáveis de Ambiente:**
   - `DATABASE_URL`: Cole a connection string do Neon (acima)
   - `FIREBASE_API_KEY`: Sua chave do Firebase
   - `FIREBASE_APP_ID`: App ID do Firebase
   - `FIREBASE_AUTH_DOMAIN`: Auth domain do Firebase
   - `FIREBASE_MESSAGING_SENDER_ID`: Sender ID do Firebase
   - `FIREBASE_PROJECT_ID`: Project ID do Firebase
   - `FIREBASE_STORAGE_BUCKET`: Storage bucket do Firebase
   - O `JWT_SECRET` será gerado automaticamente

5. **Deploy!**
   - Clique em "Apply" e aguarde o build

### Opção 2: Deploy Manual

1. **Acesse o Render Dashboard:**
   - Vá para: https://dashboard.render.com/
   - Clique em "New" → "Web Service"

2. **Conecte o Repositório:**
   - Selecione o repositório `deck-api`
   - Branch: `production`

3. **Configure o Serviço:**
   - **Name:** `deck-api`
   - **Region:** Oregon (US West)
   - **Branch:** `production`
   - **Runtime:** Node
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
   - **Plan:** Free

4. **Configure as Variáveis de Ambiente:**
   ```
   NODE_ENV=production
   PORT=3333
   DATABASE_URL=postgresql://neondb_owner:npg_DR8zltgB6XKa@ep-lucky-bar-af530z8t-pooler.c-2.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
   JWT_SECRET=[será gerado automaticamente]
   JWT_EXPIRES_IN=7d
   FIREBASE_API_KEY=[sua chave]
   FIREBASE_APP_ID=[seu app id]
   FIREBASE_AUTH_DOMAIN=[seu auth domain]
   FIREBASE_MESSAGING_SENDER_ID=[seu sender id]
   FIREBASE_PROJECT_ID=[seu project id]
   FIREBASE_STORAGE_BUCKET=[seu storage bucket]
   ```

5. **Health Check:**
   - Path: `/health`

6. **Deploy!**
   - Clique em "Create Web Service"

## 🔧 Pós-Deploy

### 1. Popular o Banco (Seed)

Após o primeiro deploy, você pode precisar popular o banco com dados iniciais:

```bash
# Localmente com a connection string do Neon
DATABASE_URL="postgresql://neondb_owner:npg_DR8zltgB6XKa@ep-lucky-bar-af530z8t-pooler.c-2.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require" pnpm db:seed
```

Ou criar um script no Render Shell:
1. Vá para o seu serviço no Render
2. Clique em "Shell"
3. Execute: `pnpm db:seed`

### 2. Testar a API

Após o deploy, sua API estará disponível em:
```
https://deck-api.onrender.com
```

Teste a documentação Swagger em:
```
https://deck-api.onrender.com/docs
```

### 3. Configurar Auto-Deploy

No Render:
- Vá em Settings → Build & Deploy
- Ative "Auto-Deploy"
- Cada push na branch `production` fará deploy automático

## 📊 Monitoramento

### Logs no Render
- Acesse: Dashboard → deck-api → Logs
- Monitore erros de build e runtime

### Banco de Dados no Neon
- Acesse: https://console.neon.tech/
- Veja métricas, conexões e uso de storage

## 🔐 Segurança

### Variáveis de Ambiente Sensíveis
- ❌ **NUNCA** commite secrets no código
- ✅ Configure todas as variáveis no Render Dashboard
- ✅ Use secrets diferentes para produção e desenvolvimento

### Firewall do Neon (Opcional)
Se quiser restringir acesso ao banco:
1. Vá no Neon Console
2. Project Settings → IP Allow
3. Adicione os IPs do Render (se necessário)

## 🐛 Troubleshooting

### Build falha com "Cannot find module"
- Certifique-se que `pnpm-lock.yaml` está commitado
- O Render precisa do lockfile para instalar as dependências corretas

### "Connection refused" do banco
- Verifique se a `DATABASE_URL` está correta no Render
- Teste a conexão localmente primeiro
- Certifique-se que não há firewall bloqueando no Neon

### "Module build failed" ou TypeScript errors
- O build no Render roda `pnpm build`
- Certifique-se que o código compila localmente primeiro
- Rode `pnpm typecheck` antes de fazer push

### Timeout no Health Check
- Render espera resposta em `/health`
- O endpoint foi criado automaticamente

## 🎯 Checklist de Deploy

- ✅ Banco de dados configurado no Neon
- ✅ Migrações aplicadas
- ✅ Arquivos `render.yaml` e `.node-version` criados
- ✅ Branch corrigida para `production`
- ⏳ Fazer push do código para GitHub
- ⏳ Criar serviço no Render (Opção 1 ou 2 acima)
- ⏳ Configurar variáveis de ambiente no Render
- ⏳ Popular banco com seed data
- ⏳ Testar a API em produção

## 📚 Links Úteis

- [Neon Console](https://console.neon.tech/)
- [Render Dashboard](https://dashboard.render.com/)
- [Documentação Neon](https://neon.tech/docs/introduction)
- [Documentação Render](https://render.com/docs)

---

**Dúvidas?** Abra uma issue no repositório ou consulte a documentação oficial.
