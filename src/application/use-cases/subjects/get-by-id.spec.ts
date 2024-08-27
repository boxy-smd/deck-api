import { beforeEach, describe, expect, it } from 'vitest'

import { Subject } from '@/domain/entities/subject.entity.ts'
import { InMemorySubjectsRepository } from '@/infra/database/in-memory/repositories/subjects-repository.ts'
import { SubjectNotFoundError } from './errors/subject-not-found.error.ts'
import { GetSubjectByIdUseCase } from './get-by-id.ts'

let subjectsRepository: InMemorySubjectsRepository
let sut: GetSubjectByIdUseCase

describe('get subject by id use case', () => {
  beforeEach(() => {
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new GetSubjectByIdUseCase(subjectsRepository)
  })

  it('should be able to get a subject by id', async () => {
    const subject = Subject.create({
      name: 'Introdução a Sistemas e Mídias Digitais',
    })

    const createdSubject = await subjectsRepository.create(subject)

    const result = await sut.execute(createdSubject.id)

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Subject)
  })

  it('should be able to get a subject by id with non-existent id', async () => {
    const result = await sut.execute('non-existent-id')

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(SubjectNotFoundError)
  })
})
