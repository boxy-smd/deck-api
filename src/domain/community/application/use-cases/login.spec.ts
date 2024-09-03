import { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import { Base64Encrypter } from 'test/cryptography/base64-encrypter.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/students-repository.ts'
import { Student } from '../../enterprise/student.entity.ts'
import { LoginUseCase } from './login.ts'

let studentsRepository: InMemoryStudentsRepository
let sut: LoginUseCase
let student: Student

describe('login use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    const encrypter = new Base64Encrypter()
    student = await makeStudent()

    sut = new LoginUseCase(studentsRepository, encrypter)
  })

  it('should be able to login a student', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      email: student.email.value,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Student)
  })

  it('should not be able to login a student with no email', async () => {
    const result = await sut.execute({
      email: '',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to login a student with no password', async () => {
    const result = await sut.execute({
      email: student.email.value,
      password: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
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
