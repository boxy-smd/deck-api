import { Subject } from '@/domain/entities/subject.entity.ts'
import { InMemorySubjectsRepository } from '@/infra/database/in-memory/repositories/subjects-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { CreateSubjectUseCase } from './create.ts'
import { SubjectAlreadyExistsError } from './errors/subject-already-exists.error.ts'

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
      code: 'ISMD',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Subject)
  })

  it('should not be able to create a subject with no name', async () => {
    const result = await sut.execute({
      name: '',
      code: 'ISMD',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to create a subject with no code', async () => {
    const result = await sut.execute({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to create a subject with no name and no code', async () => {
    const result = await sut.execute({
      name: '',
      code: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to create a subject with a code that is already in use', async () => {
    await sut.execute({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    const result = await sut.execute({
      name: 'Introdução a Sistemas e Mídias Digitais',
      code: 'ISMD',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      SubjectAlreadyExistsError,
    )
  })
})
