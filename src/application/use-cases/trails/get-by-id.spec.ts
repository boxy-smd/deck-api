import { beforeEach, describe, expect, it } from 'vitest'

import { Trail } from '@/domain/entities/trail.entity.ts'
import { InMemoryTrailsRepository } from '@/infra/database/in-memory/repositories/trails-repository.ts'
import { TrailNotFoundError } from './errors/trail-not-found.error.ts'
import { GetTrailByIdUseCase } from './get-by-id.ts'

let trailsRepository: InMemoryTrailsRepository
let sut: GetTrailByIdUseCase

describe('get trail by id use case', () => {
  beforeEach(() => {
    trailsRepository = new InMemoryTrailsRepository()
    sut = new GetTrailByIdUseCase(trailsRepository)
  })

  it('should be able to get a trail by id', async () => {
    const trail = Trail.create({
      name: 'Sistemas Multimídia',
    })

    const createdTrail = await trailsRepository.create(trail)

    const result = await sut.execute(createdTrail.id)

    expect(result.isRight()).toBe(true)
    expect(result.isRight() && result.value).toBeInstanceOf(Trail)
  })

  it('should be able to get a trail by id with non-existent id', async () => {
    const result = await sut.execute('non-existent-id')

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(TrailNotFoundError)
  })
})
