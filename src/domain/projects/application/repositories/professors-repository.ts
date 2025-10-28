import type { DomainRepository } from '@/shared/kernel/domain-repository.ts'
import type { Professor } from '../../enterprise/entities/professor.ts'

export interface ProfessorsRepository extends DomainRepository<Professor> {
  findManyByName(name: string): Promise<Professor[]>
}
