import type { DomainRepository } from '@/@shared/kernel/kernel/domain-repository'
import type { Trail } from '../../enterprise/entities/trail'

export interface TrailsRepository extends DomainRepository<Trail> {
  findByName(name: string): Promise<Trail | null>

  findManyByName(name: string): Promise<Trail[]>
}
