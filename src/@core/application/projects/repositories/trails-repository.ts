import type { Trail } from '@/@core/domain/projects/entities/trail'
import type { DomainRepository } from '@/@shared/kernel/kernel/domain-repository'

export abstract class TrailsRepository implements DomainRepository<Trail> {
  abstract findById(id: string): Promise<Trail | null>

  abstract findAll(): Promise<Trail[]>

  abstract create(entity: Trail): Promise<void>

  abstract save(entity: Trail): Promise<void>

  abstract delete(entity: Trail): Promise<void>

  abstract deleteById(id: string): Promise<void>

  abstract existsById(id: string): Promise<boolean>

  abstract findByName(name: string): Promise<Trail | null>

  abstract findManyByName(name: string): Promise<Trail[]>
}
