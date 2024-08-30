import { beforeEach, describe, expect, it } from 'vitest'

import { Trail } from '@/domain/entities/trail.entity.ts'
import { InMemoryTrailsRepository } from '@/infra/database/in-memory/repositories/trails-repository.ts'
import { FetchTrailsUseCase } from './fetch.ts'

let trailsRepository: InMemoryTrailsRepository
let sut: FetchTrailsUseCase

describe('fetch trails use case', () => {
  beforeEach(() => {
    trailsRepository = new InMemoryTrailsRepository()
    sut = new FetchTrailsUseCase(trailsRepository)
  })

  it('should be able to fetch trails', async () => {
    const trail = Trail.create({
      name: 'Sistemas Multimídia',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await trailsRepository.create(trail)

    const result = await sut.execute()

    expect(result).toBeInstanceOf(Array)
  })

  it('should be able to fetch trails with empty array', async () => {
    const result = await sut.execute()

    expect(result).toEqual([])
  })
})
