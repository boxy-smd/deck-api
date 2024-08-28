import type {
  UpdateUserRequest,
  UserQuery,
  UsersRepository,
} from '@/application/repositories/users-repository.ts'
import type { User } from '@/domain/entities/user.entity.ts'
import { prisma } from '../client.ts'
import { UserMapper } from '../mappers/user-mapper.ts'

export class PrismaUsersRepository implements UsersRepository {
  async create(user: User): Promise<User> {
    const raw = UserMapper.toPersistence(user)
    const createdRaw = await prisma.user.create({ data: raw })
    return UserMapper.toDomain(createdRaw)
  }

  async findById(id: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { id } })
    return raw ? UserMapper.toDomain(raw) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { email } })
    return raw ? UserMapper.toDomain(raw) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({ where: { username } })
    return raw ? UserMapper.toDomain(raw) : null
  }

  async fetchByQuery({ name, username }: UserQuery): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        name: { contains: name },
        username: { contains: username },
      },
    })

    return users.map(user => UserMapper.toDomain(user))
  }

  async update(id: string, request: UpdateUserRequest): Promise<User | null> {
    const raw = UserMapper.toPersistenceUpdate(request)
    const updatedUser = await prisma.user.update({ where: { id }, data: raw })
    return UserMapper.toDomain(updatedUser)
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
  }
}
