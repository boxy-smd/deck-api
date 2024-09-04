import { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter.ts'
import { FakeHasher } from 'test/cryptography/fake-hasher.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/students-repository.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { LoginUseCase } from './login.ts'

let studentsRepository: InMemoryStudentsRepository
let student: Student
let encrypter: FakeEncrypter
let hasher: FakeHasher

let sut: LoginUseCase

describe('login use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    encrypter = new FakeEncrypter()
    hasher = new FakeHasher()
    student = await makeStudent()

    sut = new LoginUseCase(studentsRepository, hasher, encrypter)
  })

  it('should be able to login a student', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      email: student.email.value,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value.accessToken).toEqual(
      JSON.stringify({ sub: student.id.toString() }),
    )
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
