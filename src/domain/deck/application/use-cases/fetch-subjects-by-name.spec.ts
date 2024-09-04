import { Subject } from '@/domain/deck/enterprise/entities/subject.entity.ts'
import { InMemorySubjectsRepository } from 'test/repositories/subjects-repository.ts'
import { FetchSubjectsByNameUseCase } from './fetch-subjects-by-name.ts'

let subjectsRepository: InMemorySubjectsRepository
let sut: FetchSubjectsByNameUseCase
let subjects: Subject[]

describe('Fetch subjects by name use case', () => {
  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    subjects = [
      Subject.create({
        name: 'Interação Humano-Computador I',
      }),
      Subject.create({
        name: 'Interação Humano-Computador II',
      }),
      Subject.create({
        name: 'Comunicação Visual I',
      }),
    ]

    sut = new FetchSubjectsByNameUseCase(subjectsRepository)
  })

  it('should be able to fetch subjects by name', async () => {
    await subjectsRepository.create(subjects[0])
    await subjectsRepository.create(subjects[1])
    await subjectsRepository.create(subjects[2])

    const result = await sut.execute({ name: 'Interação Humano-Computador' })

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Interação Humano-Computador I',
        }),
        expect.objectContaining({
          name: 'Interação Humano-Computador II',
        }),
      ]),
    )
  })

  it('should return an empty array if no subjects are found', async () => {
    const result = await sut.execute({ name: 'Interação Humano-Computador I' })

    expect(result).toHaveLength(0)
  })
})
