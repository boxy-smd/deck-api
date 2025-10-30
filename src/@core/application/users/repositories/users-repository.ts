import type { DomainRepository } from '@/@shared/kernel/kernel/domain-repository'
import type { User } from '../../../domain/users/entities/user'

export abstract class UsersRepository implements DomainRepository<User> {
  abstract findById(id: string): Promise<User | null>

  abstract findAll(): Promise<User[]>

  abstract create(entity: User): Promise<void>

  abstract save(entity: User): Promise<void>

  abstract delete(entity: User): Promise<void>

  abstract deleteById(id: string): Promise<void>

  abstract existsById(id: string): Promise<boolean>

  abstract findByEmail(email: string): Promise<User | null>

  abstract findByUsername(username: string): Promise<User | null>

  abstract findManyByName(name: string): Promise<User[]>
}
