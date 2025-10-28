import type { Prisma, User as UserRaw } from '@prisma/client'

import { StudentProfile } from '@/domain/authentication/enterprise/entities/student-profile.ts'
import { User } from '@/domain/authentication/enterprise/entities/user.ts'
import { Email } from '@/domain/authentication/enterprise/value-objects/email.ts'
import { Semester } from '@/domain/authentication/enterprise/value-objects/semester.ts'
import type { UserRole } from '@/domain/authentication/enterprise/value-objects/user-role.ts'
import type { UserStatus } from '@/domain/authentication/enterprise/value-objects/user-status.ts'
import { Username } from '@/domain/authentication/enterprise/value-objects/username.ts'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id.ts'

// biome-ignore lint/complexity/noStaticOnlyClass: This class is a mapper and should have only static methods
export class PrismaStudentMapper {
  static toEntity(
    raw: UserRaw & {
      studentProfile?: {
        semester: number
      } | null
      trail?: {
        trail: {
          id: string
        }
      }[]
    },
  ): User {
    const usernameResult = Username.create(raw.username)
    if (usernameResult.isLeft()) {
      throw usernameResult.value
    }

    const email = Email.create(raw.email)

    let profile: StudentProfile | undefined
    if (raw.studentProfile) {
      const semesterResult = Semester.create(raw.studentProfile.semester)
      if (semesterResult.isLeft()) {
        throw semesterResult.value
      }

      profile = StudentProfile.create(
        {
          semester: semesterResult.value,
          trailsIds: new Set(
            raw.trail?.map(t => UniqueEntityID.create(t.trail.id)) || [],
          ),
        },
        UniqueEntityID.create(raw.id),
      )
    }

    return User.create(
      {
        name: raw.name,
        username: usernameResult.value,
        email,
        passwordHash: raw.passwordHash,
        about: raw.about ?? undefined,
        profileUrl: raw.profileUrl ?? undefined,
        role: raw.role as UserRole,
        status: raw.status as UserStatus,
        profile,
      },
      UniqueEntityID.create(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      username: user.username.value,
      email: user.email.value,
      passwordHash: user.passwordHash,
      about: user.about ?? undefined,
      profileUrl: user.profileUrl ?? undefined,
      role: user.role,
      status: user.status,
      studentProfile: user.profile ? {
        create: {
          semester: user.profile.semester.value,
        }
      } : undefined,
      trail: user.profile && user.profile.trailsIds.length > 0 ? {
        create: user.profile.trailsIds
          .filter(trailId => trailId != null)
          .map(trailId => ({
            trailId: trailId.toString(),
          })),
      } : undefined,
    }
  }

  static toPrismaUpdate(user: User): Prisma.UserUncheckedUpdateInput {
    return {
      name: user.name,
      username: user.username.value,
      email: user.email.value,
      passwordHash: user.passwordHash,
      about: user.about ?? undefined,
      profileUrl: user.profileUrl ?? undefined,
      role: user.role,
      status: user.status,
    }
  }
}
