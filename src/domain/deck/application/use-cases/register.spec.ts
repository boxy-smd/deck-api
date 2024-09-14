import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists.error.ts'
import { FakeHasher } from 'test/cryptography/fake-hasher.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { Student } from '../../enterprise/entities/student.ts'
import { RegisterUseCase } from './register.ts'

let studentsRepository: InMemoryStudentsRepository
let trailsRepository: InMemoryTrailsRepository
let hasher: FakeHasher

let student: Student

let sut: RegisterUseCase

describe('register use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    trailsRepository = new InMemoryTrailsRepository()
    hasher = new FakeHasher()

    student = await makeStudent()

    sut = new RegisterUseCase(studentsRepository, trailsRepository, hasher)
  })

  it('should be able to register a user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
      trailsIds: [],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Student)
  })

  it('should not be able to register a user with an existing email', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: student.email.value,
      password: '123456',
      semester: 1,
      trailsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should not be able to register a user with an existing username', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      name: 'John Doe',
      username: student.username,
      email: 'johndoe@alu.ufc.br',
      password: '123456',
      semester: 1,
      trailsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
