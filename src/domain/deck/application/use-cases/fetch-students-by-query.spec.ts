import { makeStudent } from 'test/factories/make-student.ts'
import { InMemoryStudentsRepository } from 'test/repositories/students-repository.ts'
import type { Student } from '../../enterprise/entities/student.ts'
import { FetchStudentsByQueryUseCase } from './fetch-students-by-query.ts'

let studentsRepository: InMemoryStudentsRepository

let students: Student[]

let sut: FetchStudentsByQueryUseCase

describe('fetch students by query use case', () => {
  beforeEach(async () => {
    studentsRepository = new InMemoryStudentsRepository()

    students = [
      await makeStudent({
        name: 'David Silva',
        username: 'davidsilva',
      }),
      await makeStudent({
        name: 'David Cópia',
        username: 'davidcopia',
      }),
      await makeStudent({
        name: 'Amanda Coelho',
        username: 'amandacoelho',
      }),
    ]

    sut = new FetchStudentsByQueryUseCase(studentsRepository)
  })

  it('should be able to fetch students by name', async () => {
    await studentsRepository.create(students[0])
    await studentsRepository.create(students[1])
    await studentsRepository.create(students[2])

    const result = await sut.execute({ name: 'David' })

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'David Silva',
        }),
        expect.objectContaining({
          name: 'David Cópia',
        }),
      ]),
    )
  })

  it('should be able to fetch students by username', async () => {
    await studentsRepository.create(students[0])
    await studentsRepository.create(students[1])
    await studentsRepository.create(students[2])

    const result = await sut.execute({ username: 'david' })

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: 'davidsilva',
        }),
        expect.objectContaining({
          username: 'davidcopia',
        }),
      ]),
    )
  })

  it('should be able to fetch students by name and username', async () => {
    await studentsRepository.create(students[0])
    await studentsRepository.create(students[1])
    await studentsRepository.create(students[2])

    const result = await sut.execute({ name: 'David', username: 'davids' })

    expect(result).toHaveLength(1)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'David Silva',
          username: 'davidsilva',
        }),
      ]),
    )
  })

  it('should return an empty array if no students are found', async () => {
    const result = await sut.execute({ name: 'David' })

    expect(result).toHaveLength(0)
  })
})
