import { beforeEach, describe, expect, it } from 'vitest'

import { Subject } from '@/domain/entities/subject.entity.ts'
import { InMemorySubjectsRepository } from '@/infra/database/in-memory/repositories/subjects-repository.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { CreateSubjectUseCase } from './create.ts'

let subjectsRepository: InMemorySubjectsRepository
let sut: CreateSubjectUseCase

describe('create subject use case', () => {
  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new CreateSubjectUseCase(subjectsRepository)
  })

  it('should be able to create a subject', async () => {
    const result = await sut.execute({
      name: 'Introdução a Sistemas e Mídias Digitais',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Subject)
  })

  it('should not be able to create a subject with no name', async () => {
    const result = await sut.execute({
      name: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to create a subject with the same name', async () => {
    await sut.execute({
      name: 'Introdução a Sistemas e Mídias Digitais',
    })

    const result = await sut.execute({
      name: 'Introdução a Sistemas e Mídias Digitais',
    })

    expect(result.isLeft()).toBe(true)
  })
})
