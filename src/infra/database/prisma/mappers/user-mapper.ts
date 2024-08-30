import type { Prisma, User as RawUser } from '@prisma/client'

import type { UpdateUserRequest } from '@/application/repositories/users-repository.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'
import { User } from '@/domain/entities/user.entity.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserMapper {
  static toDomain(raw: RawUser, trails?: Trail[]): User {
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
        trails,
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
      email: user.email.value,
      passwordHash: user.passwordHash,
      semester: user.semester,
      about: user.about || undefined,
      profileUrl: user.profileUrl || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      trails: {
        connect: user.trails.map(trail => ({ id: trail.id })),
      },
      comments: {
        connect: user.comments.map(comment => ({ id: comment.id })),
      },
      projects: {
        connect: user.projects.map(project => ({ id: project.id })),
      },
    }

    return raw
  }

  static toPersistenceUpdate(user: UpdateUserRequest): Prisma.UserUpdateInput {
    const raw: Prisma.UserUpdateInput = {
      semester: user.semester,
      about: user.about,
      profileUrl: user.profileUrl,
      updatedAt: new Date(),
      trails: user.trails && {
        connect: user.trails.map(trail => ({ id: trail.id })),
      },
    }

    return raw
  }
}
