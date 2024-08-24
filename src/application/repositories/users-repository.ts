import type { User, UserProps } from '@/domain/entities/user.entity.ts'

export type UpdateUserRequest = Partial<
  Omit<UserProps, 'createdAt' | 'updatedAt'>
>

export interface UsersRepository {
  create(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  findByName(name: string): Promise<User[]>
  update(id: string, request: UpdateUserRequest): Promise<User | null>
  delete(id: string): Promise<void>
}
