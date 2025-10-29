import type { DomainRepository } from '@/shared/kernel/domain-repository'
import type { Subject } from '../../enterprise/entities/subject'

export interface SubjectsRepository extends DomainRepository<Subject> {
  findByName(name: string): Promise<Subject | null>

  findManyByName(name: string): Promise<Subject[]>
}
