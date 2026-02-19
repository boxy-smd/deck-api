import { makeTrail } from 'test/factories/make-trail'
import { InMemoryTrailsRepository } from 'test/repositories/trails-repository'
import type { Trail } from '@/@core/domain/projects/entities/trail'
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

  it('should not return non-selectable SMD trail', async () => {
    const smdTrail = makeTrail({ name: 'SMD' })

    await trailsRepository.create(trail)
    await trailsRepository.create(smdTrail)

    const result = await sut.execute()

    expect(result).toHaveLength(1)
    expect(result.some(item => item.name === 'SMD')).toBe(false)
  })

  it('should be able to fetch trails with empty array', async () => {
    const result = await sut.execute()

    expect(result).toEqual([])
  })
})
