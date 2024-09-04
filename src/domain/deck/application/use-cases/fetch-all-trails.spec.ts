import type { Trail } from '@/domain/deck/enterprise/entities/trail.ts'
import { makeTrail } from 'test/factories/make-trail.ts'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository.ts'
import { FetchAllTrailsUseCase } from './fetch-all-trails.ts'

let trailsRepository: InMemoryTrailsRepository

let trail: Trail

let sut: FetchAllTrailsUseCase

describe('fetch all trails use case', () => {
  beforeEach(() => {
    trailsRepository = new InMemoryTrailsRepository()

    trail = makeTrail()

    sut = new FetchAllTrailsUseCase(trailsRepository)
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
