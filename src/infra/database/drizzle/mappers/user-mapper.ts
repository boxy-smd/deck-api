import { User } from '@/domain/entities/user.entity.ts'
import type { NewUser, User as RawUser } from '../schema.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserMapper {
  static toDomain(raw: RawUser): User {
    const user = User.create(
      {
        name: raw.name,
        username: raw.username,
        email: raw.email,
        passwordHash: raw.passwordHash,
        about: raw.about || undefined,
        profileUrl: raw.profileUrl || undefined,
        semester: raw.semester,
        createdAt: raw.createdAt || undefined,
        updatedAt: raw.updatedAt || undefined,
      },
      raw.id,
    )

    return user
  }

  static toPersistence(user: User): NewUser {
    const raw: NewUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      semester: user.semester,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return raw
  }
}
