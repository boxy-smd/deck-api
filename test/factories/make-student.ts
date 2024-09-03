import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  Student,
  type StudentProps,
} from '@/domain/community/enterprise/student.entity.ts'
import { Email } from '@/domain/community/enterprise/value-objects/email.ts'
import { Base64Encrypter } from 'test/cryptography/base64-encrypter.ts'

export async function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const encrypter = new Base64Encrypter()
  const email = Email.create('johndoe@alu.ufc.br')

  if (email.isLeft()) {
    throw new Error('Invalid email')
  }

  const student = Student.create(
    {
      name: 'John Doe',
      username: 'johndoe',
      email: email.value,
      passwordHash: await Student.hashPassword('123456', encrypter),
      semester: 3,
      trails: [],
      ...override,
    },
    id,
  )

  return student
}
