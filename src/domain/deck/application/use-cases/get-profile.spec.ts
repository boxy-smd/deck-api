import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentTrailsRepository } from 'test/repositories/student-trails-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { Student } from '../../enterprise/entities/student.ts'
import { GetProfileUseCase } from './get-profile.ts'

let studentsRepository: InMemoryStudentsRepository
let studentTrailsRepository: InMemoryStudentTrailsRepository
let student: Student

let sut: GetProfileUseCase

describe('get profile use case', () => {
  beforeEach(async () => {
    studentTrailsRepository = new InMemoryStudentTrailsRepository()
    studentsRepository = new InMemoryStudentsRepository(studentTrailsRepository)
    student = await makeStudent()

    sut = new GetProfileUseCase(studentsRepository)
  })

  it('should be able to get a student profile', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({
      studentId: student.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(Student)
  })

  it('should not be able to get a student with no id', async () => {
    const result = await sut.execute({
      studentId: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get a student with no student', async () => {
    const result = await sut.execute({
      studentId: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
