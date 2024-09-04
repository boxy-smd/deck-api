import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists.ts'
import { FakeHasher } from 'test/cryptography/fake-hasher.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentTrailsRepository } from 'test/repositories/student-trails-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { Student } from '../../enterprise/entities/student.ts'
import { RegisterUseCase } from './register.ts'

let studentsRepository: InMemoryStudentsRepository
let studentTrailsRepository: InMemoryStudentTrailsRepository
let trailsRepository: InMemoryTrailsRepository
let student: Student
let hasher: FakeHasher

let sut: RegisterUseCase

describe('register use case', () => {
  beforeEach(async () => {
    studentTrailsRepository = new InMemoryStudentTrailsRepository()
    studentsRepository = new InMemoryStudentsRepository(studentTrailsRepository)
    trailsRepository = new InMemoryTrailsRepository()
    student = await makeStudent()
    hasher = new FakeHasher()

    sut = new RegisterUseCase(studentsRepository, trailsRepository, hasher)
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
