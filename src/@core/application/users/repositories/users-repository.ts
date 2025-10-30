import type { DomainRepository } from '@/@shared/kernel/kernel/domain-repository'
import type { User } from '../../../domain/users/entities/user'

export interface UsersRepository extends DomainRepository<User> {
  findByEmail(email: string): Promise<User | null>

  // TODO: Implement this method later
  // findByIdWithDetails(id: string): Promise<UserDTO | null>

  findByUsername(username: string): Promise<User | null>

  findManyByName(name: string): Promise<User[]>

  // findManyUsersDTOByName(name: string): Promise<UserDTO[]>
}
