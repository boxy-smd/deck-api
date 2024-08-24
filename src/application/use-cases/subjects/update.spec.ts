import { Subject } from '@/domain/entities/subject.entity.ts'
import { InMemorySubjectsRepository } from '@/infra/database/in-memory/repositories/subjects-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { SubjectNotFoundError } from './errors/subject-not-found.error.ts'
import { UpdateSubjectUseCase } from './update.ts'

let subjectsRepository: InMemorySubjectsRepository
let sut: UpdateSubjectUseCase

describe('update subject use case', () => {
  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new UpdateSubjectUseCase(subjectsRepository)
  })

  it('should be able to update a subject', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    const createdSubject = await subjectsRepository.create(subject)

    const result = await sut.execute({
      id: createdSubject.id,
      name: 'Introdução a Sistemas e Mídias Digitais 2',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Subject)
    expect(result.isRight() && result.value.name).toBe(
      'Introdução a Sistemas e Mídias Digitais 2',
    )
  })

  it('should be not able to update a subject with non-existent id', async () => {
    const result = await sut.execute({
      id: 'non-existent-id',
      name: 'Introdução a Sistemas e Mídias Digitais 2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(SubjectNotFoundError)
  })

  it('should be able to update a subject with empty name', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    const createdSubject = await subjectsRepository.create(subject)

    const result = await sut.execute({
      id: createdSubject.id,
      name: '',
      code: 'ISMD-2',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Subject)
  })

  it('should be able to update a subject with empty code', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    const createdSubject = await subjectsRepository.create(subject)

    const result = await sut.execute({
      id: createdSubject.id,
      name: 'Introdução a Sistemas e Mídias Digitais 2',
      code: '',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Subject)
  })

  it('should be not able to update a subject with empty name and code', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    const createdSubject = await subjectsRepository.create(subject)

    const result = await sut.execute({
      id: createdSubject.id,
      name: '',
      code: '',
    })

    expect(result.isLeft()).toBe(true)
  })
})
