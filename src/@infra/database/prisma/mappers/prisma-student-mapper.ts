import type { Prisma, User as UserRaw } from '@prisma/client'

import { StudentProfile } from '@/@core/domain/authentication/enterprise/entities/student-profile'
import { User } from '@/@core/domain/authentication/enterprise/entities/user'
import { Email } from '@/@core/domain/authentication/enterprise/value-objects/email'
import { Semester } from '@/@core/domain/authentication/enterprise/value-objects/semester'
import type { UserRole } from '@/@core/domain/authentication/enterprise/value-objects/user-role'
import type { UserStatus } from '@/@core/domain/authentication/enterprise/value-objects/user-status'
import { Username } from '@/@core/domain/authentication/enterprise/value-objects/username'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'

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

    const emailResult = Email.create(raw.email)
    if (emailResult.isLeft()) {
      throw emailResult.value
    }

    const email = emailResult.value

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
