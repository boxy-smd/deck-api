import { StudentProfile } from '@/@core/domain/users/entities/student-profile'
import { User } from '@/@core/domain/users/entities/user'
import { Email } from '@/@core/domain/users/value-objects/email'
import { Semester } from '@/@core/domain/users/value-objects/semester'
import { UserRole } from '@/@core/domain/users/value-objects/user-role'
import { UserStatus } from '@/@core/domain/users/value-objects/user-status'
import { Username } from '@/@core/domain/users/value-objects/username'
import { UniqueEntityID } from '@/@shared/kernel/kernel/unique-entity-id'
import { InferSelectModel } from 'drizzle-orm'
import { studentProfiles, trails, users } from '../schema'

type UserRaw = InferSelectModel<typeof users>
type StudentProfileRaw = InferSelectModel<typeof studentProfiles>
type TrailRaw = InferSelectModel<typeof trails>

export type DrizzleUserWithProfile = UserRaw & {
  studentProfile: StudentProfileRaw | null
  trails: { trail: TrailRaw }[]
}

export class DrizzleUserMapper {
  static toEntity(raw: DrizzleUserWithProfile): User {
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
            raw.trails.map(t => UniqueEntityID.create(t.trail.id)) || [],
          ),
        },
        UniqueEntityID.create(raw.id),
      )
    }

    const user = User.create(
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

    if (raw.passwordResetToken && raw.passwordResetExpires) {
      user.setPasswordResetToken(
        raw.passwordResetToken,
        raw.passwordResetExpires,
      )
    }

    return user
  }
}
