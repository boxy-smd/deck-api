import { beforeEach, describe, expect, it } from 'vitest'

import { Professor } from '@/domain/entities/professor.entity.ts'
import { InMemoryProfessorsRepository } from '@/infra/database/in-memory/repositories/professors-repository.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { CreateProfessorUseCase } from './create.ts'

let professorsRepository: InMemoryProfessorsRepository
let sut: CreateProfessorUseCase

describe('create professor use case', () => {
  beforeEach(() => {
    professorsRepository = new InMemoryProfessorsRepository()
    sut = new CreateProfessorUseCase(professorsRepository)
  })

  it('should be able to create a professor', async () => {
    const result = await sut.execute({
      name: 'Henrique Pequeno',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Professor)
  })

  it('should not be able to create a professor with no name', async () => {
    const result = await sut.execute({
      name: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
