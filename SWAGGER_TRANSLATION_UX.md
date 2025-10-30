# Tradução e Melhorias de UX - Documentação Swagger

## Resumo das Alterações

Este documento descreve as melhorias aplicadas à documentação da API, focando em tradução para português e melhor experiência do usuário (UX).

## Princípios Aplicados

### 1. Linguagem Clara e Direta
- Mensagens em português brasileiro
- Uso de linguagem acessível e profissional
- Descrições detalhadas quando necessário

### 2. Feedback Contextual
- Mensagens de erro específicas e acionáveis
- Descrições de sucesso claras
- Explicação do que cada endpoint faz

### 3. Documentação Completa
- Summary: resumo em uma linha
- Description: detalhes adicionais quando relevante
- Status codes com descrições contextuais

## Mudanças por Controller

### 🎓 Estudantes (Students)

#### Tags
- Antes: `Students`
- Depois: `Estudantes`

#### Endpoints Atualizados

**POST /students** - Cadastrar novo estudante
- ✅ Descrição detalhada do processo de registro
- ✅ Mensagens de erro específicas:
  - 400: "Dados inválidos. Verifique os campos obrigatórios e formatos."
  - 409: "Estudante já cadastrado com este email ou nome de usuário."

**POST /sessions** - Autenticar estudante
- ✅ Explicação sobre retorno do token JWT
- ✅ Erro específico: "Credenciais inválidas. Email ou senha incorretos."

**GET /profiles/:username** - Buscar perfil por nome de usuário
- ✅ Descrição clara: informações públicas do perfil
- ✅ Erro: "Estudante não encontrado com o nome de usuário informado."

**PUT /profiles/:studentId** - Editar perfil do estudante
- ✅ Reforço de segurança: "Requer autenticação e o usuário só pode editar seu próprio perfil"
- ✅ Erro contextual: "Você não tem permissão para editar este perfil."
- ✅ Mensagem de código alterada para português

**GET /students** - Listar estudantes
- ✅ Descrição sobre filtros disponíveis

**GET /students/:studentId** - Buscar detalhes do estudante
- ✅ Descrição de informações detalhadas

**POST /profile-images/:username** - Fazer upload da foto de perfil
- ✅ Especificações técnicas: "Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB"
- ✅ Descrição do campo file no body
- ✅ Erro específico: "É necessário enviar um arquivo de imagem."
- ✅ Mensagem de sucesso: "Foto de perfil enviada com sucesso."

**PATCH /token/refresh** - Renovar token de autenticação
- ✅ Descrição do propósito: continuar usando a aplicação
- ✅ Erro: "Não autenticado. Token inválido ou expirado."

### 📚 Projetos (Projects)

#### Tags
- Antes: `Projects`
- Depois: `Projetos`

#### Endpoints Atualizados

**POST /projects** - Publicar projeto
- ✅ Descrição completa incluindo recursos (disciplina, trilhas, professores)
- ✅ Erro 404: "Recurso não encontrado. Disciplina, trilha ou professor inválido."

**GET /posts** - Listar publicações
- ✅ Descrição sobre paginação
- ✅ Erro em português: "Falha ao buscar publicações."

**GET /posts/search** - Buscar e filtrar publicações
- ✅ Lista completa de filtros disponíveis
- ✅ Erro: "Falha ao buscar projetos."

**GET /projects/:projectId** - Buscar detalhes do projeto
- ✅ Descrição de informações retornadas

**DELETE /projects/:projectId** - Excluir projeto
- ✅ Restrição de segurança: "Apenas o autor do projeto pode excluí-lo"
- ✅ Erro: "Acesso negado. Apenas o autor pode excluir o projeto."

**POST /projects/:projectId/banner** - Fazer upload do banner do projeto
- ✅ Especificações técnicas de arquivo
- ✅ Erro: "É necessário enviar um arquivo de imagem."
- ✅ Mensagem de sucesso: "Banner enviado com sucesso."

### 💬 Comentários (Comments)

#### Tags
- Antes: `Comments`
- Depois: `Comentários`

#### Endpoints Atualizados

**GET /projects/:projectId/comments** - Listar comentários do projeto
- ✅ Descrição sobre ordenação (mais recente primeiro)

**POST /projects/:projectId/comments** - Comentar em projeto
- ✅ Requisitos claros: autenticação e projeto permitir comentários
- ✅ Erro 403: "Projeto não permite comentários."

**DELETE /projects/:projectId/comments/:commentId** - Excluir comentário
- ✅ Restrição: "Apenas o autor do comentário pode excluí-lo"
- ✅ Erro: "Acesso negado. Apenas o autor pode excluir o comentário."

**POST /comments/:commentId/report** - Denunciar comentário
- ✅ Descrição de propósito: moderação de conteúdo inadequado

### 👨‍🏫 Professores (Professors)

#### Tags
- Antes: `Professors`
- Depois: `Professores`

#### Endpoints Atualizados

**GET /professors** - Listar professores
- ✅ Descrição sobre filtro por nome

### 📖 Disciplinas (Subjects)

#### Tags
- Antes: `Subjects`
- Depois: `Disciplinas`

#### Endpoints Atualizados

**GET /subjects** - Listar disciplinas
- ✅ Descrição sobre filtro por nome

### 🛤️ Trilhas (Trails)

#### Tags
- Antes: `Trails`
- Depois: `Trilhas`

#### Endpoints Atualizados

**GET /trails** - Listar trilhas
- ✅ Descrição clara: "trilhas de aprendizagem"

## Melhorias nas Mensagens de Erro

### Antes vs Depois

| Antes | Depois | Contexto |
|-------|--------|----------|
| "Bad request" | "Dados inválidos. Verifique os campos obrigatórios e formatos." | Mais acionável |
| "Student already exists" | "Estudante já cadastrado com este email ou nome de usuário." | Mais específico |
| "Invalid credentials" | "Credenciais inválidas. Email ou senha incorretos." | Mais claro |
| "Forbidden." | "Você não tem permissão para editar este perfil." | Mais humano |
| "File is required" | "É necessário enviar um arquivo de imagem." | Mais específico |
| "Student not found" | "Estudante não encontrado com o nome de usuário informado." | Mais contextual |
| "Failed to fetch posts" | "Falha ao buscar publicações." | Traduzido |
| "Profile image uploaded successfully" | "Foto de perfil enviada com sucesso." | Traduzido |
| "Banner uploaded successfully" | "Banner enviado com sucesso." | Traduzido |

## Padrões de Mensagens Estabelecidos

### Mensagens de Sucesso
- Usar verbos no particípio: "enviado", "criado", "atualizado", "excluído"
- Ser específico sobre o que foi feito
- Exemplos:
  - ✅ "Foto de perfil enviada com sucesso."
  - ✅ "Comentário criado com sucesso."
  - ✅ "Perfil atualizado com sucesso."

### Mensagens de Erro 404
- Sempre especificar o que não foi encontrado
- Exemplos:
  - ✅ "Projeto não encontrado."
  - ✅ "Estudante não encontrado com o nome de usuário informado."
  - ✅ "Comentário não encontrado."

### Mensagens de Erro 403
- Explicar o motivo da restrição
- Exemplos:
  - ✅ "Acesso negado. Apenas o autor pode excluir o projeto."
  - ✅ "Você não tem permissão para editar este perfil."
  - ✅ "Projeto não permite comentários."

### Mensagens de Erro 400
- Indicar o que está errado e como corrigir
- Exemplos:
  - ✅ "Dados inválidos. Verifique os campos obrigatórios e formatos."
  - ✅ "É necessário enviar um arquivo de imagem."

### Mensagens de Erro 401
- Explicar o problema de autenticação
- Exemplos:
  - ✅ "Credenciais inválidas. Email ou senha incorretos."
  - ✅ "Não autenticado. Token inválido ou expirado."

## Benefícios das Mudanças

### 1. Experiência do Desenvolvedor (DX)
- Documentação auto-explicativa
- Menos tempo para entender a API
- Erros mais fáceis de debugar

### 2. Acessibilidade
- Conteúdo em português para público brasileiro
- Linguagem clara e profissional
- Especialmente útil para estudantes

### 3. Manutenibilidade
- Padrões consistentes estabelecidos
- Fácil adicionar novos endpoints seguindo o padrão
- Documentação serve como guia de estilo

### 4. Profissionalismo
- API mais polida e profissional
- Atenção aos detalhes
- Melhor impressão geral do projeto

## Próximos Passos Sugeridos

### 1. DTOs
- [ ] Adicionar exemplos mais realistas nos DTOs
- [ ] Traduzir descriptions dos campos para português
- [ ] Adicionar validações customizadas em português

### 2. Swagger UI
- [ ] Configurar título em português
- [ ] Adicionar descrição geral da API
- [ ] Adicionar informações de contato e licença

### 3. Erros de Validação
- [ ] Customizar mensagens do class-validator para português
- [ ] Criar interceptor global para formatar erros
- [ ] Adicionar códigos de erro para referência

### 4. Testes
- [ ] Atualizar testes E2E com novas mensagens
- [ ] Testar validações em português
- [ ] Verificar Swagger gerado

## Checklist de Implementação

- [x] Traduzir tags dos controllers
- [x] Traduzir summaries de todos os endpoints
- [x] Adicionar descriptions detalhadas
- [x] Melhorar mensagens de erro em controllers
- [x] Padronizar mensagens de sucesso
- [x] Formatar código com Biome
- [ ] Atualizar testes E2E (se necessário)
- [ ] Validar Swagger UI gerado
- [ ] Documentar padrões para futuros endpoints

## Comandos Úteis

```bash
# Verificar Swagger gerado
npm run start:dev
# Acessar http://localhost:3000/api

# Rodar testes
pnpm test

# Formatar código
pnpm biome format --write .
```

## Referências

- [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction)
- [Swagger Best Practices](https://swagger.io/resources/articles/best-practices-in-api-documentation/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
