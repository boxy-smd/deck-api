import type { Student } from '@/domain/deck/enterprise/entities/student.ts'
import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import { FetchStudentsUseCase } from './fetch-students.ts'

let studentsRepository: InMemoryStudentsRepository

let student: Student

let sut: FetchStudentsUseCase

describe('fetch students use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()

    student = await makeStudent()

    sut = new FetchStudentsUseCase(studentsRepository)
  })

  it('should be able to fetch students', async () => {
    await studentsRepository.create(student)

    const result = await sut.execute({})

    expect(result).toBeInstanceOf(Array<Student>)
    expect(result).toHaveLength(1)
  })

  it('should be able to fetch students with name', async () => {
    const otherStudent = await makeStudent({
      name: 'Other Student',
    })

    await studentsRepository.create(otherStudent)
    await studentsRepository.create(student)

    const result = await sut.execute({ name: student.name })

    expect(result).toBeInstanceOf(Array<Student>)
    expect(result).toHaveLength(1)
    expect(result[0].name).toEqual(student.name)
  })

  it('should be able to fetch students with username', async () => {
    const otherStudent = await makeStudent({
      username: 'other_student',
    })

    await studentsRepository.create(otherStudent)
    await studentsRepository.create(student)

    const result = await sut.execute({ name: student.username })

    expect(result).toBeInstanceOf(Array<Student>)
    expect(result).toHaveLength(1)
    expect(result[0].username).toEqual(student.username)
  })

  it('should be able to fetch students with empty array', async () => {
    const result = await sut.execute({})

    expect(result).toEqual([])
  })
})
