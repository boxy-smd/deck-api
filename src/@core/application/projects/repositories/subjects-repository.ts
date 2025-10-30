import type { Subject } from '@/@core/domain/projects/entities/subject'
import type { DomainRepository } from '@/@shared/kernel/kernel/domain-repository'

export abstract class SubjectsRepository implements DomainRepository<Subject> {
  abstract findById(id: string): Promise<Subject | null>

  abstract findAll(): Promise<Subject[]>

  abstract create(entity: Subject): Promise<void>

  abstract save(entity: Subject): Promise<void>

  abstract delete(entity: Subject): Promise<void>

  abstract deleteById(id: string): Promise<void>

  abstract existsById(id: string): Promise<boolean>

  abstract findByName(name: string): Promise<Subject | null>

  abstract findManyByName(name: string): Promise<Subject[]>
}
