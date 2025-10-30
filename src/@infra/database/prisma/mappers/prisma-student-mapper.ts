import type { Prisma } from '@prisma/client'

import { StudentProfile } from '@/@core/domain/users/entities/student-profile'
import { User } from '@/@core/domain/users/entities/user'
import { Email } from '@/@core/domain/users/value-objects/email'
import { Semester } from '@/@core/domain/users/value-objects/semester'
import type { UserRole } from '@/@core/domain/users/value-objects/user-role'
import type { UserStatus } from '@/@core/domain/users/value-objects/user-status'
import { Username } from '@/@core/domain/users/value-objects/username'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import type { PrismaUserWithProfile } from '../types/prisma-types'

export class PrismaStudentMapper {
  static toEntity(raw: PrismaUserWithProfile): User {
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
      studentProfile: user.profile
        ? {
            create: {
              semester: user.profile.semester.value,
            },
          }
        : undefined,
      trail:
        user.profile && user.profile.trailsIds.length > 0
          ? {
              create: user.profile.trailsIds
                .filter(trailId => trailId != null)
                .map(trailId => ({
                  trailId: trailId.toString(),
                })),
            }
          : undefined,
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
