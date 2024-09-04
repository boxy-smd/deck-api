import type { UniqueEntityID } from '@/core/entities/unique-entity-id.ts'
import {
  Student,
  type StudentProps,
} from '@/domain/deck/enterprise/entities/student.ts'
import { Email } from '@/domain/deck/enterprise/entities/value-objects/email.ts'
import { FakeHasher } from 'test/cryptography/fake-hasher.ts'

export async function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const hasher = new FakeHasher()

  const student = Student.create(
    {
      name: 'John Doe',
      username: 'johndoe',
      email: Email.create('johndoe@alu.ufc.br'),
      passwordHash: await hasher.hash('123456'),
      semester: 3,
      about: 'I am a student at UFC',
      profileUrl: 'https://boxy.com/test.png',
      ...override,
    },
    id,
  )

  return student
}
