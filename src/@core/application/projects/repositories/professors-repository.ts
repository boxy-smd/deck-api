import type { Professor } from '@/@core/domain/projects/entities/professor'
import type { DomainRepository } from '@/@shared/kernel/kernel/domain-repository'

export abstract class ProfessorsRepository
  implements DomainRepository<Professor>
{
  abstract findById(id: string): Promise<Professor | null>

  abstract findAll(): Promise<Professor[]>

  abstract create(entity: Professor): Promise<void>

  abstract save(entity: Professor): Promise<void>

  abstract delete(entity: Professor): Promise<void>

  abstract deleteById(id: string): Promise<void>

  abstract existsById(id: string): Promise<boolean>

  abstract findManyByName(name: string): Promise<Professor[]>
}
