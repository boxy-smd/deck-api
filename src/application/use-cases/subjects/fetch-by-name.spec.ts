import { Subject } from '@/domain/entities/subject.entity.ts'
import { InMemorySubjectsRepository } from '@/infra/database/in-memory/repositories/subjects-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchSubjectsByNameUseCase } from './fetch-by-name.ts'

let subjectsRepository: InMemorySubjectsRepository
let sut: FetchSubjectsByNameUseCase

describe('fetch subjects by name use case', () => {
  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new FetchSubjectsByNameUseCase(subjectsRepository)
  })

  it('should be able to fetch subjects by name', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    await subjectsRepository.create(subject)

    const result = await sut.execute('Introdução a Sistemas e Mídias Digitais')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch subjects by name with partial name', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    await subjectsRepository.create(subject)

    const result = await sut.execute('Introdução')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch subjects by name with case insensitive name', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    await subjectsRepository.create(subject)

    const result = await sut.execute('introdução a sistemas e mídias digitais')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch an empty array when no subjects are found', async () => {
    const result = await sut.execute('Introdução a Sistemas e Mídias Digitais')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch an empty array when no subjects are found with partial name', async () => {
    const result = await sut.execute('Introdução')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch all subjects when name is empty', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    await subjectsRepository.create(subject)

    const result = await sut.execute('')

    expect(result).toBeInstanceOf(Array<Subject>)
  })
})
