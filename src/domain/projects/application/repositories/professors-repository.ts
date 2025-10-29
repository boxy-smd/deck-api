import type { DomainRepository } from '@/shared/kernel/domain-repository'
import type { Professor } from '../../enterprise/entities/professor'

export interface ProfessorsRepository extends DomainRepository<Professor> {
  findManyByName(name: string): Promise<Professor[]>
}
