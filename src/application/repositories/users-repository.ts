import type { Repository } from '@/domain/core/interfaces/repository.ts'
import type { User, UserProps } from '@/domain/entities/user.entity.ts'

export type UpdateUserRequest = Partial<
  Omit<UserProps, 'createdAt' | 'updatedAt'>
>

export type UserQuery = {
  name?: string
  username?: string
}

export interface UsersRepository extends Repository<User, UpdateUserRequest> {
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  fetchByQuery(query: UserQuery): Promise<User[]>
}
