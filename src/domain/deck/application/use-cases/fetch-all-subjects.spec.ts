import type { Subject } from '@/domain/deck/enterprise/entities/subject.ts'
import { makeSubject } from 'test/factories/make-subject.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { FetchAllSubjectsUseCase } from './fetch-all-subjects.ts'

let subjectsRepository: InMemorySubjectsRepository
let sut: FetchAllSubjectsUseCase
let subject: Subject

describe('fetch all subjects use case', () => {
  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    subject = makeSubject()

    sut = new FetchAllSubjectsUseCase(subjectsRepository)
  })

  it('should be able to fetch subjects', async () => {
    await subjectsRepository.create(subject)

    const result = await sut.execute()

    expect(result).toBeInstanceOf(Array<Subject>)
    expect(result).toHaveLength(1)
  })

  it('should be able to fetch subjects with empty array', async () => {
    const result = await sut.execute()

    expect(result).toEqual([])
  })
})
