# Refatoração do Domínio de Autenticação - Summaries de Estudantes

## Análise da Camada de Domínio

### Estrutura Atual

#### Entidades Principais

1. **User** (`enterprise/entities/user.ts`)
   - Aggregate Root que representa um usuário do sistema
   - Propriedades:
     - `name`: string
     - `username`: Username (value object)
     - `email`: Email (value object)
     - `passwordHash`: string
     - `about`: string opcional
     - `profileUrl`: string opcional
     - `role`: UserRole (enum)
     - `status`: UserStatus (enum)
     - `profile`: StudentProfile opcional
   - Comportamentos: gerenciamento de status, perfil de estudante, trilhas

2. **StudentProfile** (`enterprise/entities/student-profile.ts`)
   - Entity que representa o perfil de um estudante
   - Propriedades:
     - `semester`: Semester (value object)
     - `trailsIds`: Set<UniqueEntityID<Trail>>
   - O ID do StudentProfile é o mesmo do User (relacionamento 1:1)
   - Comportamentos: atualizar semestre, adicionar/remover trilhas

#### Value Objects Existentes

- **Email**: valida formato e instituição (@alu.ufc.br)
- **Username**: valida formato e tamanho (3-20 caracteres)
- **Semester**: valida intervalo (1-12)
- **UserRole**: enum (STUDENT, CURATOR, MODERATOR, ADMIN)
- **UserStatus**: enum (ACTIVE, INACTIVE, BANNED)
- **StudentProfileWithDetails**: VO existente com dados detalhados + trails (strings) + posts

### Problema Identificado

A estrutura atual separa `User` e `StudentProfile`, mas não há um VO que:
1. Una as informações de User + StudentProfile de forma completa
2. Forneça uma versão resumida para listagens

O `StudentProfileWithDetails` existente já faz algo similar, mas inclui `trails` como strings e `posts`, não sendo ideal para todos os casos de uso.

## Solução Implementada

Foram criados dois novos Value Objects para representar estudantes:

### 1. StudentDetails

**Arquivo**: `src/@core/domain/authentication/enterprise/value-objects/student-details.ts`

**Propósito**: Representa um estudante completo, unindo dados de User e StudentProfile.

**Propriedades**:
- `id`: UniqueEntityID
- `name`: string
- `username`: Username
- `email`: Email
- `about`: string opcional
- `profileUrl`: string opcional
- `role`: UserRole
- `status`: UserStatus
- `semester`: Semester
- `trailsIds`: UniqueEntityID<Trail>[]
- `createdAt`: Date
- `updatedAt`: Date

**Quando usar**:
- Detalhes de um estudante específico
- Casos de uso que precisam de informações completas
- APIs que retornam dados detalhados de um estudante

### 2. StudentSummary

**Arquivo**: `src/@core/domain/authentication/enterprise/value-objects/student-summary.ts`

**Propósito**: Versão resumida para listagens de estudantes.

**Propriedades**:
- `id`: UniqueEntityID
- `name`: string
- `username`: Username
- `profileUrl`: string opcional
- `semester`: number (primitivo para simplificar)

**Quando usar**:
- Listagens de estudantes
- Cards/previews de estudantes
- Casos onde performance é importante (menos dados)
- APIs de listagem paginada

## Diferenças entre os VOs

| Aspecto | StudentDetails | StudentSummary | StudentProfileWithDetails |
|---------|---------------|----------------|---------------------------|
| Propósito | Dados completos do estudante | Resumo para listagens | Detalhes + trails (strings) + posts |
| Email | ✅ Email (VO) | ❌ | ✅ string |
| About | ✅ | ❌ | ✅ |
| Status | ✅ UserStatus | ❌ | ✅ string |
| Role | ✅ UserRole | ❌ | ✅ string |
| Semester | ✅ Semester (VO) | ✅ number | ✅ number |
| TrailsIds | ✅ UniqueEntityID[] | ❌ | ❌ |
| Trails | ❌ | ❌ | ✅ string[] |
| Posts | ❌ | ❌ | ✅ Project[] |
| CreatedAt | ✅ | ❌ | ❌ |
| UpdatedAt | ✅ | ❌ | ❌ |

## Próximos Passos Sugeridos

### 1. Criar Use Cases de Transformação

Criar métodos estáticos ou funções auxiliares para converter `User` em `StudentDetails` ou `StudentSummary`:

```typescript
// Exemplo de implementação futura
class StudentDetails {
  static fromUser(user: User): StudentDetails | null {
    if (!user.profile) return null
    
    return StudentDetails.create({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      about: user.about,
      profileUrl: user.profileUrl,
      role: user.role,
      status: user.status,
      semester: user.profile.semester,
      trailsIds: user.profile.trailsIds,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }
}
```

### 2. Atualizar Use Cases Existentes

Modificar `FetchStudentsUseCase` para retornar `StudentSummary[]` em vez de `User[]`:

```typescript
type FetchStudentsUseCaseResponse = StudentSummary[]
```

### 3. Criar Repository Methods

Adicionar métodos no repositório que já retornem os VOs:

```typescript
interface UsersRepository {
  // Existente
  findAll(): Promise<User[]>
  
  // Novo
  findAllStudentsSummary(): Promise<StudentSummary[]>
  findStudentDetailsById(id: UniqueEntityID): Promise<StudentDetails | null>
}
```

### 4. Revisar StudentProfileWithDetails

Avaliar se `StudentProfileWithDetails` ainda é necessário ou se pode ser substituído/refatorado para usar os novos VOs como base.

## Benefícios da Refatoração

1. **Separação de Responsabilidades**: Cada VO tem um propósito claro
2. **Performance**: `StudentSummary` carrega apenas dados essenciais
3. **Type Safety**: Uso de value objects em vez de primitivos quando apropriado
4. **Flexibilidade**: Diferentes representações para diferentes casos de uso
5. **Manutenibilidade**: Código mais organizado e fácil de entender

## Checklist de Implementação

- [x] Criar `StudentDetails` value object
- [x] Criar `StudentSummary` value object
- [x] Formatar arquivos com Biome
- [ ] Criar métodos de conversão de User para StudentDetails/StudentSummary
- [ ] Atualizar `FetchStudentsUseCase` para usar `StudentSummary`
- [ ] Criar testes unitários para os novos VOs
- [ ] Atualizar documentação de API
- [ ] Revisar uso de `StudentProfileWithDetails`
