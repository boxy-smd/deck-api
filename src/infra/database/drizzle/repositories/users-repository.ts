import { sql } from 'drizzle-orm'

import type {
  UpdateUserRequest,
  UsersRepository,
} from '@/application/repositories/users-repository.ts'
import type { User } from '@/domain/entities/user.entity.ts'
import { db } from '../client.ts'
import { UserMapper } from '../mappers/user-mapper.ts'
import { users } from '../schema.ts'

export class DrizzleUsersRepository implements UsersRepository {
  async create(user: User): Promise<User> {
    const [createdUser] = await db
      .insert(users)
      .values({
        ...UserMapper.toPersistence(user),
      })
      .returning()

    return UserMapper.toDomain(createdUser)
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(sql`${users.id} = ${id}`)

    if (!user) return null

    return UserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email}`)

    if (!user) return null

    return UserMapper.toDomain(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.username} = ${username}`)

    if (!user) return null

    return UserMapper.toDomain(user)
  }

  async findByName(name: string): Promise<User[]> {
    const queriedUsers = await db
      .select()
      .from(users)
      .where(sql`${users.name} ILIKE ${`%${name}%`}`)

    return queriedUsers.map(UserMapper.toDomain)
  }

  async update(id: string, request: UpdateUserRequest): Promise<void> {
    await db
      .update(users)
      .set({
        ...request,
      })
      .where(sql`${users.id} = ${id}`)
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(sql`${users.id} = ${id}`)
  }
}
