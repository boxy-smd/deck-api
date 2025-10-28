import type { DomainRepository } from '@/shared/kernel/domain-repository.ts'
import type { User } from '../../enterprise/entities/user.ts'

export interface UsersRepository extends DomainRepository<User> {
  findByEmail(email: string): Promise<User | null>

  findByUsername(username: string): Promise<User | null>

  findManyByName(name: string): Promise<User[]>
}
