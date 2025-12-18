# 📋 Plano de Simplificação de Testes E2E

**Objetivo:** Reduzir testes E2E de 1047 linhas para ~270 linhas (~75% redução)  
**Estratégia:** Manter apenas happy paths e casos críticos de autenticação/autorização

---

## 📊 Estado Atual

| Arquivo | Linhas | Testes | Status |
|---------|--------|--------|--------|
| `students.e2e-spec.ts` | 379 | 13 | ❌ Over-tested |
| `comments.e2e-spec.ts` | 296 | 11 | ❌ Over-tested |
| `projects.e2e-spec.ts` | 283 | 10 | ❌ Over-tested |
| `professors.e2e-spec.ts` | 35 | 1 | ✅ OK |
| `subjects.e2e-spec.ts` | 27 | 1 | ✅ OK |
| `trails.e2e-spec.ts` | 27 | 1 | ✅ OK |
| **TOTAL** | **1047** | **37** | |

---

## 🎯 Plano de Redução

### 1️⃣ **students.e2e-spec.ts** (379 → ~80 linhas)

#### ❌ **REMOVER** (9 testes - já cobertos por unit/integration):
- ❌ Email duplicado (integration test já cobre)
- ❌ Username duplicado (integration test já cobre)
- ❌ Validação de email acadêmico (unit test já cobre)
- ❌ Validação de senha curta (unit test já cobre)
- ❌ Validação de username inválido (unit test já cobre)
- ❌ Validação de semestre fora do range (unit test já cobre)
- ❌ Tentativa de editar perfil de outro usuário (pode manter 1 teste de autorização)
- ❌ Upload com arquivo inválido (unit test já cobre)
- ❌ Listar estudantes sem autenticação (pode consolidar em 1 teste de auth)

#### ✅ **MANTER** (4 testes essenciais):
- ✅ Criar estudante completo (happy path)
- ✅ Login com sucesso (happy path)
- ✅ Obter perfil autenticado (happy path)
- ✅ Editar perfil autenticado (happy path)

**Redução:** 13 → 4 testes (~70% menos)

---

### 2️⃣ **comments.e2e-spec.ts** (296 → ~60 linhas)

#### ❌ **REMOVER** (8 testes):
- ❌ Comentar sem autenticação (consolidar em 1 teste de auth)
- ❌ Comentar em projeto inexistente (integration já cobre)
- ❌ Comentar em projeto que não permite comentários (integration já cobre)
- ❌ Deletar comentário de outro usuário (pode manter 1 teste de autorização)
- ❌ Validação de conteúdo vazio (unit test já cobre)
- ❌ Validação de conteúdo muito longo (unit test já cobre)
- ❌ Listar comentários de projeto inexistente (integration já cobre)
- ❌ Reportar comentário sem autenticação (consolidar em auth)

#### ✅ **MANTER** (3 testes):
- ✅ Criar comentário autenticado (happy path)
- ✅ Listar comentários de projeto (happy path)
- ✅ Deletar próprio comentário (happy path)

**Redução:** 11 → 3 testes (~73% menos)

---

### 3️⃣ **projects.e2e-spec.ts** (283 → ~70 linhas)

#### ❌ **REMOVER** (7 testes):
- ❌ Criar projeto sem autenticação (consolidar em auth)
- ❌ Validação de título vazio (unit test já cobre)
- ❌ Validação de ano inválido (unit test já cobre)
- ❌ Validação de semestre inválido (unit test já cobre)
- ❌ Buscar projeto inexistente (integration já cobre)
- ❌ Deletar projeto de outro usuário (pode manter 1 teste de autorização)
- ❌ Editar projeto sem autenticação (consolidar em auth)

#### ✅ **MANTER** (3 testes):
- ✅ Criar projeto completo autenticado (happy path)
- ✅ Listar projetos (happy path)
- ✅ Buscar projeto por ID (happy path)

**Redução:** 10 → 3 testes (~70% menos)

---

### 4️⃣ **professors.e2e-spec.ts** (35 linhas - MANTER)
- ✅ Listar professores (happy path)

### 5️⃣ **subjects.e2e-spec.ts** (27 linhas - MANTER)
- ✅ Listar disciplinas (happy path)

### 6️⃣ **trails.e2e-spec.ts** (27 linhas - MANTER)
- ✅ Listar trilhas (happy path)

---

## 📊 Resultado Esperado

| Métrica | Antes | Depois | Redução |
|---------|-------|--------|---------|
| **Linhas totais** | 1047 | ~270 | **-74%** |
| **Testes totais** | 37 | 14 | **-62%** |
| **Tempo execução** | ~15s | ~6s | **-60%** |
| **Manutenção** | Alta | Baixa | ✅ |

---

## 🎯 Princípios da Simplificação

### ✅ **O QUE MANTER EM E2E:**
1. **Happy paths completos** - Fluxos principais funcionando end-to-end
2. **Autenticação/Autorização crítica** - 1-2 testes de segurança por recurso
3. **Integração entre módulos** - Ex: criar projeto → criar comentário

### ❌ **O QUE REMOVER DE E2E:**
1. **Validações de input** - Já cobertas por unit tests
2. **Regras de negócio** - Já cobertas por integration tests
3. **Edge cases** - Já cobertos por unit/integration
4. **Testes de erro detalhados** - Um teste genérico de auth é suficiente

---

## 🚀 Ordem de Implementação

1. **Fase 1:** Simplificar `students.e2e-spec.ts` (maior impacto)
2. **Fase 2:** Simplificar `comments.e2e-spec.ts`
3. **Fase 3:** Simplificar `projects.e2e-spec.ts`
4. **Fase 4:** Validar que todos os testes passam

**Tempo estimado:** ~1h30min  
**Impacto:** Alto (reduz tempo de CI/CD significativamente)

---

## 💡 Benefícios

✅ **Testes mais rápidos** - CI/CD ~60% mais rápido  
✅ **Menos falsos positivos** - Testes E2E são mais estáveis  
✅ **Manutenção mais fácil** - Menos código para manter  
✅ **Melhor pirâmide de testes** - Segue best practices  
✅ **Foco no que importa** - E2E testa integração real, não validações

---

## 📝 Checklist de Validação

Após simplificação, validar:
- [ ] Todos os E2E simplificados passam
- [ ] Coverage de integration tests permanece alto
- [ ] Tempo de execução foi reduzido
- [ ] Documentação atualizada (README)
