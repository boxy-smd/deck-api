import type { DomainRepository } from '@/shared/kernel/domain-repository.ts'
import type { Trail } from '../../enterprise/entities/trail.ts'

export interface TrailsRepository extends DomainRepository<Trail> {
  findByName(name: string): Promise<Trail | null>

  findManyByName(name: string): Promise<Trail[]>
}
