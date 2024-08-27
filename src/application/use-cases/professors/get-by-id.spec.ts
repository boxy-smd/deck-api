import { beforeEach, describe, expect, it } from 'vitest'

import { Professor } from '@/domain/entities/professor.entity.ts'
import { InMemoryProfessorsRepository } from '@/infra/database/in-memory/repositories/professors-repository.ts'
import { ProfessorNotFoundError } from './errors/professor-not-found.error.ts'
import { GetProfessorByIdUseCase } from './get-by-id.ts'

let professorsRepository: InMemoryProfessorsRepository
let sut: GetProfessorByIdUseCase

describe('get professor by id use case', () => {
  beforeEach(() => {
    professorsRepository = new InMemoryProfessorsRepository()
    sut = new GetProfessorByIdUseCase(professorsRepository)
  })

  it('should be able to get a professor by id', async () => {
    const professor = Professor.create({
      name: 'Henrique Pequeno',
    })

    const createdProfessor = await professorsRepository.create(professor)

    const result = await sut.execute(createdProfessor.id)

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Professor)
  })

  it('should be able to get a professor by id with non-existent id', async () => {
    const result = await sut.execute('non-existent-id')

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      ProfessorNotFoundError,
    )
  })
})
