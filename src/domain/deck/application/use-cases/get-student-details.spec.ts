import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { StudentProfile } from '../../enterprise/entities/value-objects/student-profile.ts'
import { GetStudentDetailsUseCase } from './get-student-details.ts'

let studentsRepository: InMemoryStudentsRepository

let student: Student

let sut: GetStudentDetailsUseCase

describe('get student details use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()

    student = await makeStudent()

    sut = new GetStudentDetailsUseCase(studentsRepository)
  })

  it('should be able to get the student details', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      studentId: student.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentProfile)
  })

  it('should not be able to get a student with no id', async () => {
    const result = await sut.execute({
      studentId: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get a student with an invalid id', async () => {
    const result = await sut.execute({
      studentId: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
