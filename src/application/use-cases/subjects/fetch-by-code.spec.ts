import { Subject } from '@/domain/entities/subject.entity.ts'
import { InMemorySubjectsRepository } from '@/infra/database/in-memory/repositories/subjects-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchSubjectsByCodeUseCase } from './fetch-by-code.ts'

let subjectsRepository: InMemorySubjectsRepository
let sut: FetchSubjectsByCodeUseCase

describe('fetch subjects by code use case', () => {
  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new FetchSubjectsByCodeUseCase(subjectsRepository)
  })

  it('should be able to fetch subjects by code', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    await subjectsRepository.create(subject)

    const result = await sut.execute('ISMD')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch subjects by code with partial code', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    await subjectsRepository.create(subject)

    const result = await sut.execute('ISM')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch subjects by code with case insensitive code', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    await subjectsRepository.create(subject)

    const result = await sut.execute('ismd')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch an empty array when no subjects are found', async () => {
    const result = await sut.execute('ISMD')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch an empty array when no subjects are found with partial code', async () => {
    const result = await sut.execute('ISM')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch an empty array when no subjects are found with case insensitive code', async () => {
    const result = await sut.execute('ismd')

    expect(result).toBeInstanceOf(Array<Subject>)
  })

  it('should be able to fetch all subjects when code is empty', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    await subjectsRepository.create(subject)

    const result = await sut.execute('')

    expect(result).toBeInstanceOf(Array<Subject>)
  })
})
