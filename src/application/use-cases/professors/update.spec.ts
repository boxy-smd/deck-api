import { beforeEach, describe, expect, it } from 'vitest'

import { Professor } from '@/domain/entities/professor.entity.ts'
import { InMemoryProfessorsRepository } from '@/infra/database/in-memory/repositories/professors-repository.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { ProfessorNotFoundError } from './errors/professor-not-found.error.ts'
import { UpdateProfessorUseCase } from './update.ts'

let professorsRepository: InMemoryProfessorsRepository
let sut: UpdateProfessorUseCase

describe('update professor use case', () => {
  beforeEach(() => {
    professorsRepository = new InMemoryProfessorsRepository()
    sut = new UpdateProfessorUseCase(professorsRepository)
  })

  it('should be able to update a professor', async () => {
    const professor = Professor.create({
      name: 'Henrique Pequeno',
    })

    const createdProfessor = await professorsRepository.create(professor)

    const result = await sut.execute({
      id: createdProfessor.id,
      name: 'Henrique Sergio',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Professor)
    expect(result.isRight() && result.value.name).toBe('Henrique Sergio')
  })

  it('should be not able to update a professor with empty name', async () => {
    const professor = Professor.create({
      name: 'Henrique Pequeno',
    })

    const createdProfessor = await professorsRepository.create(professor)

    const result = await sut.execute({
      id: createdProfessor.id,
      name: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to update a professor with non-existent id', async () => {
    const result = await sut.execute({
      id: 'non-existent-id',
      name: 'Henrique Sergio',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      ProfessorNotFoundError,
    )
  })
})
