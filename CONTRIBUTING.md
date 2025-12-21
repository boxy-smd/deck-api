# 🤝 Contributing to Deck API

Obrigado por considerar contribuir com o Deck API! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)

## 📜 Código de Conduta

Este projeto segue o [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, espera-se que você mantenha este código.

## 🚀 Como Contribuir

### Reportando Bugs

- Use o template de issue para bugs
- Descreva o comportamento esperado vs. atual
- Inclua screenshots se aplicável
- Forneça passos para reproduzir

### Sugerindo Features

- Use o template de issue para features
- Descreva claramente o caso de uso
- Explique por que essa feature seria útil

### Contribuindo com Código

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças seguindo as convenções
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 🛠️ Configuração do Ambiente

### Requisitos

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Git

### Setup Rápido

```bash
# Clone o repositório
git clone https://github.com/boxy-smd/deck-api.git
cd deck-api

# Execute o script de setup (Linux/Mac)
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Ou manualmente
pnpm install
pnpm docker:dev
pnpm db:setup
pnpm dev
```

## 🔄 Workflow de Desenvolvimento

### Estrutura de Branches

- `main` - Código de produção
- `develop` - Desenvolvimento ativo
- `feature/*` - Novas features
- `fix/*` - Bug fixes
- `refactor/*` - Refatorações
- `docs/*` - Apenas documentação

### Processo de Desenvolvimento

1. **Criar Issue**: Sempre crie uma issue antes de começar
2. **Branch**: Crie uma branch a partir de `develop`
3. **Desenvolver**: Implemente suas mudanças
4. **Testar**: Execute todos os testes
5. **Lint**: Verifique code style
6. **Commit**: Use conventional commits
7. **Push**: Envie suas mudanças
8. **PR**: Abra um Pull Request

### Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Servidor de desenvolvimento
pnpm build                  # Build de produção

# Testes
pnpm test                   # Unit tests
pnpm test:e2e               # E2E tests
pnpm test:all               # Todos os testes
pnpm test:watch             # Watch mode

# Code Quality
pnpm check                  # Lint + format
pnpm lint:check             # Apenas lint
pnpm format:check           # Apenas format check
pnpm typecheck              # Type checking

# Database
pnpm db:generate            # Gerar migrations
pnpm db:migrate             # Aplicar migrations
pnpm db:seed                # Popular banco
pnpm db:studio              # Drizzle Studio

# Docker
pnpm docker:dev             # Subir apenas Postgres
pnpm docker:up              # Subir todos os serviços
pnpm docker:down            # Parar serviços
pnpm docker:logs            # Ver logs
```

## 📐 Padrões de Código

### Arquitetura

- **Clean Architecture**: Separação de camadas
- **DDD**: Domain-Driven Design
- **SOLID**: Princípios SOLID
- **Repository Pattern**: Abstração de dados
- **Use Case Pattern**: Lógica de negócio isolada

### Estrutura de Arquivos

```
src/
├── @core/                  # Domain + Application
│   ├── domain/            # Entidades, VOs
│   └── application/       # Use cases, interfaces
├── @infra/                # Implementações
│   ├── database/          # Drizzle ORM
│   └── cryptography/      # Crypto
└── @presentation/         # Controllers, DTOs
    ├── modules/           # NestJS modules
    └── presenters/        # Response transformers
```

### Convenções de Nome

- **Use Cases**: `{Verbo}UseCase` (ex: `CreateProjectUseCase`)
- **Repositories**: `{Entity}Repository` (ex: `UsersRepository`)
- **Controllers**: `{Resource}Controller` (ex: `ProjectsController`)
- **DTOs**: `{Action}{Resource}Dto` (ex: `CreateProjectDto`)
- **Entities**: PascalCase (ex: `Project`, `User`)
- **Value Objects**: PascalCase (ex: `Email`, `Username`)

### TypeScript

- Use tipos explícitos sempre que possível
- Evite `any` - use `unknown` se necessário
- Use `readonly` para imutabilidade
- Prefira `interface` para objetos públicos
- Use `type` para unions e intersections

### Testes

- **Unit Tests**: Teste lógica de negócio isoladamente
- **E2E Tests**: Teste fluxos completos
- **Coverage**: Mantenha > 80% de cobertura
- **Nomenclatura**: `describe` e `it` em português
- **Arrange-Act-Assert**: Estruture testes claramente

Exemplo:
```typescript
describe('CreateProjectUseCase', () => {
  it('deve criar um projeto com sucesso', async () => {
    // Arrange
    const input = makeCreateProjectInput()
    
    // Act
    const result = await useCase.execute(input)
    
    // Assert
    expect(result.isRight()).toBe(true)
  })
})
```

## 💬 Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Nova feature
- `fix`: Bug fix
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção/configuração
- `perf`: Performance

### Exemplos

```bash
feat(projects): adicionar filtro por trilha

Implementa filtro de projetos por trilha acadêmica.
Adiciona teste E2E para validar filtros.

Closes #42
```

```bash
fix(auth): corrigir validação de token expirado

O middleware não estava validando corretamente tokens expirados.
Agora retorna 401 com mensagem apropriada.

Fixes #156
```

## 📝 Pull Requests

### Checklist

- [ ] Título segue conventional commits
- [ ] Descrição clara das mudanças
- [ ] Testes adicionados/atualizados
- [ ] Todos os testes passam
- [ ] Lint/format verificado
- [ ] Documentação atualizada
- [ ] Screenshots (se aplicável)
- [ ] Breaking changes documentadas

### Template

Use o template de PR fornecido. Inclua:

1. **Descrição**: O que foi mudado e por quê
2. **Tipo de Mudança**: Feature, bug fix, etc
3. **Issues Relacionadas**: Link para issues
4. **Como Testar**: Passos para validar
5. **Screenshots**: Se aplicável
6. **Breaking Changes**: Se houver

### Review Process

1. **CI/CD**: Todos os checks devem passar
2. **Code Review**: Pelo menos 1 aprovação
3. **Discussão**: Responda comentários
4. **Merge**: Squash commits ao mergear

## 🎯 Boas Práticas

### DOs ✅

- Escreva código limpo e legível
- Documente código complexo
- Escreva testes para novas features
- Mantenha PRs pequenos e focados
- Atualize documentação relevante
- Use tipos TypeScript adequados

### DON'Ts ❌

- Não commit código comentado
- Não deixe console.log em produção
- Não ignore erros de lint/typecheck
- Não faça PRs grandes demais
- Não ignore testes falhando
- Não use `any` sem justificativa

## 📚 Recursos

- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Vitest Documentation](https://vitest.dev)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [DDD Overview](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## 🆘 Ajuda

- Dúvidas? Abra uma [Discussion](https://github.com/boxy-smd/deck-api/discussions)
- Bugs? Abra uma [Issue](https://github.com/boxy-smd/deck-api/issues)
- Chat? Entre no Discord (se houver)

---

**Obrigado por contribuir! 💙**
