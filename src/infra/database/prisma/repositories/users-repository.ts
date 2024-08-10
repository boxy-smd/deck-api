import type {
  UpdateUserRequest,
  UsersRepository,
} from '@/application/repositories/users-repository.ts'
import type { User } from '@/domain/entities/user.entity.ts'
import { prisma } from '../client.ts'
import { UserMapper } from '../mappers/user-mapper.ts'

export class PrismaUsersRepository implements UsersRepository {
  async create(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: UserMapper.toPersistence(user),
    })

    return UserMapper.toDomain(createdUser)
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) return null

    return UserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) return null

    return UserMapper.toDomain(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) return null

    return UserMapper.toDomain(user)
  }

  async findByName(name: string): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    })

    return users.map(UserMapper.toDomain)
  }

  async update(id: string, request: UpdateUserRequest): Promise<void> {
    await prisma.user.update({
      where: {
        id,
      },
      data: request,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }
}
