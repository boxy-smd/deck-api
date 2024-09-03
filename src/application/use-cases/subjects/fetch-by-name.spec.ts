

import { Subject } from '@/domain/deck/enterprise/entities/subject.entity.ts'
import { InMemorySubjectsRepository } from '../../../../test/repositories/subjects-repository.ts'
import { FetchSubjectsByNameUseCase } from './fetch-by-name.ts'

let subjectsRepository: InMemorySubjectsRepository
let sut: FetchSubjectsByNameUseCase

describe('Fetch subjects by name use case', () => {
  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new FetchSubjectsByNameUseCase(subjectsRepository)
  })

  it('should be able to fetch subjects by name', async () => {
    const ihc1 = Subject.create({
      name: 'Interação Humano-Computador I',
    })
    const ihc2 = Subject.create({
      name: 'Interação Humano-Computador II',
    })
    const cv = Subject.create({
      name: 'Comunicação Visual I',
    })

    await subjectsRepository.create(ihc1)
    await subjectsRepository.create(ihc2)
    await subjectsRepository.create(cv)

    const result = await sut.execute({ name: 'Interação Humano-Computador' })

    expect(result).toHaveLength(2)
    expect(result).toEqual(expect.arrayContaining([ihc1, ihc2]))
  })

  it('should return an empty array if no subjects are found', async () => {
    const result = await sut.execute({ name: 'Interação Humano-Computador I' })

    expect(result).toHaveLength(0)
  })
})
