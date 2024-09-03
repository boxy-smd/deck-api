import { InvalidCredentialsError } from '@/core/errors/invalid-credentials.error.ts'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists.ts'
import { Base64Encrypter } from 'test/cryptography/base64-encrypter.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { Student } from '../../enterprise/student.entity.ts'
import { RegisterUseCase } from './register.ts'

let studentsRepository: InMemoryStudentsRepository
let trailsRepository: InMemoryTrailsRepository
let sut: RegisterUseCase
let student: Student

describe('register use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    const bcryptEncrypter = new Base64Encrypter()
    student = await makeStudent()

    sut = new RegisterUseCase(
      studentsRepository,
      trailsRepository,
      bcryptEncrypter,
    )
  })

  it('should be able to register a user', async () => {
    const result = await sut.execute({
      name: student.name,
      username: student.username,
      email: student.email.value,
      password: '123456',
      semester: student.semester,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Student)
  })

  it('should not be able to register a user with no name', async () => {
    const result = await sut.execute({
      name: '',
      username: student.username,
      email: student.email.value,
      password: '123456',
      semester: student.semester,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to register a user with no username', async () => {
    const result = await sut.execute({
      name: student.name,
      username: '',
      email: student.email.value,
      password: '123456',
      semester: student.semester,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to register a user with no email', async () => {
    const result = await sut.execute({
      name: student.name,
      username: student.username,
      email: '',
      password: '123456',
      semester: student.semester,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to register a user with no password', async () => {
    const result = await sut.execute({
      name: student.name,
      username: student.username,
      email: student.email.value,
      password: '',
      semester: student.semester,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to register a user with no semester', async () => {
    const result = await sut.execute({
      name: student.name,
      username: student.username,
      email: student.email.value,
      password: '123456',
      semester: 0,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to register a user with an existing email', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      name: student.name,
      username: student.username,
      email: student.email.value,
      password: '123456',
      semester: student.semester,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should not be able to register a user with an existing username', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      name: student.name,
      username: student.username,
      email: 'otheremail@alu.ufc.br',
      password: '123456',
      semester: student.semester,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
