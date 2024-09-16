import { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import { FakeHasher } from 'test/cryptography/fake-hasher.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/students-repository.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { LoginUseCase } from './login.ts'

let studentsRepository: InMemoryStudentsRepository
let hasher: FakeHasher

let student: Student

let sut: LoginUseCase

describe('login use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    hasher = new FakeHasher()

    student = await makeStudent()

    await studentsRepository.create(student)

    sut = new LoginUseCase(studentsRepository, hasher)
  })

  it('should be able to login a student', async () => {
    const result = await sut.execute({
      email: student.email.value,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toMatchObject({
      id: student.id.toString(),
    })
  })

  it('should not be able to login an unregistered student', async () => {
    const result = await sut.execute({
      email: 'janedoe@alu.ufc.br',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to login a student with wrong password', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      email: student.email.value,
      password: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
