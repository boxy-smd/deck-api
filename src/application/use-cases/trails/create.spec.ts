import { beforeEach, describe, expect, it } from 'vitest'

import { Trail } from '@/domain/entities/trail.entity.ts'
import { InMemoryTrailsRepository } from '@/infra/database/in-memory/repositories/trails-repository.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { CreateTrailUseCase } from './create.ts'

let trailsRepository: InMemoryTrailsRepository
let sut: CreateTrailUseCase

describe('create trail use case', () => {
  beforeEach(() => {
    trailsRepository = new InMemoryTrailsRepository()
    sut = new CreateTrailUseCase(trailsRepository)
  })

  it('should be able to create a trail', async () => {
    const result = await sut.execute({
      name: 'Sistemas Multimídia',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Trail)
  })

  it('should not be able to create a trail with no name', async () => {
    const result = await sut.execute({
      name: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
