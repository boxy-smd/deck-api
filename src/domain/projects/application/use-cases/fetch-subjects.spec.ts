import { makeSubject } from 'test/factories/make-subject'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository'
import type { Subject } from '../../enterprise/entities/subject'
import type { SubjectsRepository } from '../repositories/subjects-repository'
import { FetchSubjectsUseCase } from './fetch-subjects'

let subjectsRepository: SubjectsRepository

let subject: Subject

let sut: FetchSubjectsUseCase

describe('fetch subjects use case', () => {
  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    subject = makeSubject()

    sut = new FetchSubjectsUseCase(subjectsRepository)
  })

  it('should be able to fetch subjects', async () => {
    await subjectsRepository.create(subject)

    const result = await sut.execute({})

    expect(result).toBeInstanceOf(Array<Subject>)
    expect(result).toHaveLength(1)
  })

  it('should be able to fetch subjects with name', async () => {
    await subjectsRepository.create(subject)

    const result = await sut.execute({ name: subject.name })

    expect(result).toBeInstanceOf(Array<Subject>)
    expect(result).toHaveLength(1)
  })

  it('should be able to fetch subjects with empty array', async () => {
    const result = await sut.execute({})

    expect(result).toEqual([])
  })
})
