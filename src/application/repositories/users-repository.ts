import type { User } from '@/domain/entities/user.entity.ts'

export interface UpdateUserRequest {
  about?: string
  profileUrl?: string
  semester: number
}

export interface UsersRepository {
  create(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  findByName(name: string): Promise<User[]>
  update(id: string, request: UpdateUserRequest): Promise<void>
  delete(id: string): Promise<void>
}
