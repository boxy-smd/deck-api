import { makeTrail } from 'test/factories/make-trail'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import type { Trail } from '../../enterprise/entities/trail'
import type { TrailsRepository } from '../repositories/trails-repository'
import { FetchTrailsUseCase } from './fetch-trails'

let trailsRepository: TrailsRepository

let trail: Trail

let sut: FetchTrailsUseCase

describe('fetch trails use case', () => {
  beforeEach(() => {
    trailsRepository = new InMemoryTrailsRepository()

    trail = makeTrail()

    sut = new FetchTrailsUseCase(trailsRepository)
  })

  it('should be able to fetch trails', async () => {
    await trailsRepository.create(trail)

    const result = await sut.execute()

    expect(result).toBeInstanceOf(Array<Trail>)
    expect(result).toHaveLength(1)
  })

  it('should be able to fetch trails with empty array', async () => {
    const result = await sut.execute()

    expect(result).toEqual([])
  })
})
