import { beforeEach, describe, expect, it } from 'vitest'

import { Subject } from '@/domain/entities/subject.entity.ts'
import { InMemorySubjectsRepository } from '@/infra/database/in-memory/repositories/subjects-repository.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
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

  it('should be not able to update a subject with empty name', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
    })

    const createdSubject = await subjectsRepository.create(subject)
    const result = await sut.execute({
      id: createdSubject.id,
      name: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
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
})
