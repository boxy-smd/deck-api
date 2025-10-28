import type { DomainRepository } from '@/shared/kernel/domain-repository.ts'
import type { Subject } from '../../enterprise/entities/subject.ts'

export interface SubjectsRepository extends DomainRepository<Subject> {
  findByName(name: string): Promise<Subject | null>

  findManyByName(name: string): Promise<Subject[]>
}
