import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { StudentProfile } from '../../enterprise/entities/value-objects/student-profile.ts'
import { GetProfileUseCase } from './get-profile.ts'

let studentsRepository: InMemoryStudentsRepository

let student: Student

let sut: GetProfileUseCase

describe('get profile use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()

    student = await makeStudent()

    sut = new GetProfileUseCase(studentsRepository)
  })

  it('should be able to get a student profile', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      username: student.username,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentProfile)
  })

  it('should not be able to get a student with no id', async () => {
    const result = await sut.execute({
      username: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get a student with no student', async () => {
    const result = await sut.execute({
      username: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
