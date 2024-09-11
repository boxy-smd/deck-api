import { ResourceNotFoundError } from '@/core/errors/resource-not-found.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryCommentsRepository } from 'test/repositories/comments-repository.ts'
import { InMemoryProjectsRepository } from 'test/repositories/projects-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { StudentProfile } from '../../enterprise/entities/value-objects/student-profile.ts'
import { GetProfileUseCase } from './get-profile.ts'

let studentsRepository: InMemoryStudentsRepository
let subjectsRepository: InMemorySubjectsRepository
let commentsRepository: InMemoryCommentsRepository
let projectRepository: InMemoryProjectsRepository

let student: Student

let sut: GetProfileUseCase

describe('get profile use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    commentsRepository = new InMemoryCommentsRepository(studentsRepository)
    projectRepository = new InMemoryProjectsRepository(
      studentsRepository,
      subjectsRepository,
      commentsRepository,
    )
    student = await makeStudent()

    sut = new GetProfileUseCase(studentsRepository, projectRepository)
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
