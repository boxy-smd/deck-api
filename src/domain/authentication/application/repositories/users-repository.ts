import type { DomainRepository } from '@/shared/kernel/domain-repository'
import type { User } from '../../enterprise/entities/user'

export interface UsersRepository extends DomainRepository<User> {
  findByEmail(email: string): Promise<User | null>

  findByUsername(username: string): Promise<User | null>

  findManyByName(name: string): Promise<User[]>
}
