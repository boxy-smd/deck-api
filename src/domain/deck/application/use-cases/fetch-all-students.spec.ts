import type { Student } from '@/domain/deck/enterprise/entities/student.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentTrailsRepository } from 'test/repositories/student-trails-repository.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { FetchAllStudentsUseCase } from './fetch-all-students.ts'

let studentsRepository: InMemoryStudentsRepository
let studentTrailsRepository: InMemoryStudentTrailsRepository
let student: Student

let sut: FetchAllStudentsUseCase

describe('fetch all students use case', () => {
  beforeEach(async () => {
    studentTrailsRepository = new InMemoryStudentTrailsRepository()
    studentsRepository = new InMemoryStudentsRepository(studentTrailsRepository)
    student = await makeStudent()

    sut = new FetchAllStudentsUseCase(studentsRepository)
  })

  it('should be able to fetch students', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute()

    expect(result).toBeInstanceOf(Array<Student>)
    expect(result).toHaveLength(1)
  })

  it('should be able to fetch students with empty array', async () => {
    const result = await sut.execute()

    expect(result).toEqual([])
  })
})
