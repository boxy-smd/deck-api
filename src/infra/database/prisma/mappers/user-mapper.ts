import { User } from '@/domain/entities/user.entity.ts'
import type { Prisma, User as RawUser } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserMapper {
  static toDomain(raw: RawUser): User {
    const userOrError = User.create(
      {
        name: raw.name,
        username: raw.username,
        email: raw.email,
        passwordHash: raw.passwordHash,
        about: raw.about || undefined,
        profileUrl: raw.profileUrl || undefined,
        semester: raw.semester,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    )

    if (userOrError.isLeft()) {
      throw new Error(userOrError.value.toString())
    }

    const user: User = userOrError.value

    return user
  }

  static toPersistence(user: User): Prisma.UserCreateInput {
    const raw: Prisma.UserCreateInput = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      semester: user.semester,
      about: user.about || undefined,
      profileUrl: user.profileUrl || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return raw
  }
}
