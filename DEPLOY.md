# 🚀 Deploy no Render

Este documento descreve como fazer o deploy da Deck API no Render.

## 📋 Configuração do Health Check

### Endpoint de Health Check
A aplicação expõe dois endpoints de health check:

- `GET /health` - Endpoint simples de health check
- `GET /health-check` - Endpoint configurado no Render

Ambos retornam:
```json
{
  "status": "ok",
  "timestamp": "2025-12-22T13:29:26.701Z"
}
```

### Configuração no render.yaml

O arquivo `render.yaml` está configurado com:

```yaml
healthCheckPath: /health-check
```

### Como Funciona

Segundo a [documentação do Render](https://render.com/docs/health-checks):

1. **Porta**: O Render automaticamente injeta a variável `PORT` (10000 por padrão)
2. **Protocol**: O health check usa HTTP GET por padrão
3. **Expected Status**: Espera status 200 OK
4. **Interval**: Verifica a cada 30 segundos
5. **Timeout**: 10 segundos de timeout por check
6. **Healthy Threshold**: 2 checks consecutivos bem-sucedidos
7. **Unhealthy Threshold**: 3 checks consecutivos falhados

### Troubleshooting

Se o health check falhar:

1. **Verifique os logs**: `render logs tail`
2. **Confirme que a aplicação está escutando na porta correta**:
   - A aplicação DEVE escutar em `0.0.0.0` (já configurado)
   - A aplicação DEVE usar a variável `PORT` do ambiente
3. **Teste o endpoint localmente**:
   ```bash
   curl http://localhost:PORT/health-check
   ```
4. **Verifique se a aplicação iniciou corretamente**:
   - O build deve completar sem erros
   - As variáveis de ambiente devem estar configuradas
   - O banco de dados deve estar acessível

## 🔧 Variáveis de Ambiente Necessárias

Configure estas variáveis no Render Dashboard:

- `NODE_ENV=production` (já configurado)
- `PORT=10000` (já configurado, injeta automaticamente)
- `DATABASE_URL` (obrigatório) - String de conexão PostgreSQL
- `JWT_SECRET` (gerado automaticamente)
- `JWT_EXPIRES_IN=7d` (já configurado)
- `FIREBASE_API_KEY` (obrigatório se usar upload)
- `FIREBASE_APP_ID` (obrigatório se usar upload)
- `FIREBASE_AUTH_DOMAIN` (obrigatório se usar upload)
- `FIREBASE_MESSAGING_SENDER_ID` (obrigatório se usar upload)
- `FIREBASE_PROJECT_ID` (obrigatório se usar upload)
- `FIREBASE_STORAGE_BUCKET` (obrigatório se usar upload)

## 📦 Processo de Deploy

1. **Push para o branch `production`**:
   ```bash
   git push origin production
   ```

2. **O Render automaticamente**:
   - Executa `pnpm install`
   - Executa `pnpm test:unit` (validação)
   - Executa `pnpm build:prod`
   - Inicia com `pnpm start`

3. **Aguarde o health check**:
   - O serviço ficará "Building" durante o build
   - Mudará para "Live" após 2 health checks bem-sucedidos

## 🔍 Monitoramento

Acesse o dashboard do Render para:
- Ver logs em tempo real
- Monitorar métricas de CPU/memória
- Verificar status dos health checks
- Configurar alertas

## 📚 Referências

- [Render Health Checks Documentation](https://render.com/docs/health-checks)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [NestJS Production Best Practices](https://docs.nestjs.com/techniques/performance)
