import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Student } from '@/domain/deck/enterprise/entities/student.ts'
import { Email } from '@/domain/deck/enterprise/entities/value-objects/email.ts'
import type { Prisma, User as UserRaw } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PrismaStudentMapper {
  static toEntity(raw: UserRaw): Student {
    return Student.create(
      {
        name: raw.name,
        username: raw.username,
        email: Email.create(raw.email),
        passwordHash: raw.passwordHash,
        semester: raw.semester,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        about: raw.about ?? undefined,
        profileUrl: raw.profileUrl ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      username: student.username,
      email: student.email.value,
      passwordHash: student.passwordHash,
      semester: student.semester,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt ?? undefined,
      about: student.about ?? undefined,
      profileUrl: student.profileUrl ?? undefined,
    }
  }
}
