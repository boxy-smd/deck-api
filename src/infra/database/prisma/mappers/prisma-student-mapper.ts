import type { Prisma, User as UserRaw } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import { Student } from '@/domain/deck/enterprise/entities/student.ts'
import { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import { Email } from '@/domain/deck/enterprise/entities/value-objects/email.ts'
import type { Post } from '@/domain/deck/enterprise/entities/value-objects/post.ts'
import { StudentProfile } from '@/domain/deck/enterprise/entities/value-objects/student-profile.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaStudentMapper {
  static toEntity(
    raw: UserRaw & {
      trails: {
        id: string
        name: string
        createdAt: Date
        updatedAt: Date
      }[]
    },
  ): Student {
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
        trails: raw.trails.map(trail =>
          Trail.create(
            {
              name: trail.name,
              createdAt: trail.createdAt,
              updatedAt: trail.updatedAt,
            },
            new UniqueEntityID(trail.id),
          ),
        ),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toEntityProfile(
    raw: UserRaw & {
      trails: {
        name: string
      }[]
      posts: Post[]
    },
  ): StudentProfile {
    return StudentProfile.create({
      id: new UniqueEntityID(raw.id),
      name: raw.name,
      username: raw.username,
      about: raw.about ?? undefined,
      profileUrl: raw.profileUrl ?? undefined,
      semester: raw.semester,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      trails: raw.trails.map(trail => trail.name),
      posts: raw.posts,
    })
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
      trails: {
        connect: student.trails.map(trail => ({ id: trail.id.toString() })),
      },
    }
  }
}
