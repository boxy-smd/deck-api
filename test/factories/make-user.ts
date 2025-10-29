import {
  User,
  type UserProps,
} from '@/domain/authentication/enterprise/entities/user'
import { StudentProfile } from '@/domain/authentication/enterprise/entities/student-profile'
import { Email } from '@/domain/authentication/enterprise/value-objects/email'
import { Semester } from '@/domain/authentication/enterprise/value-objects/semester'
import { UserRole } from '@/domain/authentication/enterprise/value-objects/user-role'
import { UserStatus } from '@/domain/authentication/enterprise/value-objects/user-status'
import { Username } from '@/domain/authentication/enterprise/value-objects/username'
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id'
import { FakeHasher } from 'test/cryptography/fake-hasher'

export async function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const hasher = new FakeHasher()

  const usernameResult = Username.create(`user_${Math.random().toString(36).substring(7)}`)
  if (usernameResult.isLeft()) {
    throw usernameResult.value
  }

  const userId = id || UniqueEntityID.create()

  const semesterResult = Semester.create(1)
  if (semesterResult.isLeft()) {
    throw semesterResult.value
  }

  const profile = StudentProfile.create(
    {
      semester: semesterResult.value,
    },
    userId,
  )

  const email = Email.create(`user_${Math.random().toString(36).substring(7)}@alu.ufc.br`)

  const user = User.create(
    {
      name: 'John Doe',
      username: usernameResult.value,
      email,
      passwordHash: await hasher.hash('123456'),
      about: 'Eu sou um estudante de Sistemas e Mídias Digitais.',
      profileUrl: 'https://boxy.com/test.png',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      profile,
      ...override,
    },
    userId,
  )

  return user
}
