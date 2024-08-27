import { beforeEach, describe, expect, it } from 'vitest'

import { Trail } from '@/domain/entities/trail.entity.ts'
import { InMemoryTrailsRepository } from '@/infra/database/in-memory/repositories/trails-repository.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { TrailNotFoundError } from './errors/trail-not-found.error.ts'
import { UpdateTrailUseCase } from './update.ts'

let trailsRepository: InMemoryTrailsRepository
let sut: UpdateTrailUseCase

describe('update trail use case', () => {
  beforeEach(() => {
    trailsRepository = new InMemoryTrailsRepository()
    sut = new UpdateTrailUseCase(trailsRepository)
  })

  it('should be able to update a trail', async () => {
    const trail = Trail.create({
      name: 'Sistemas Multimídia',
    })

    const createdTrail = await trailsRepository.create(trail)

    const result = await sut.execute({
      id: createdTrail.id,
      name: 'Audiovisual',
    })

    expect(result.isRight()).toBe(true)
    // expect(result.isRight() && result.value).toBeInstanceOf(Trail)
    expect(result.isRight() && result.value.name).toBe('Audiovisual')
  })

  it('should be not able to update a trail with empty name', async () => {
    const trail = Trail.create({
      name: 'Sistemas Multimídia',
    })

    const createdTrail = await trailsRepository.create(trail)

    const result = await sut.execute({
      id: createdTrail.id,
      name: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should be not able to update a trail with non-existent id', async () => {
    const result = await sut.execute({
      id: 'non-existent-id',
      name: 'Audiovisual',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isLeft() && result.value).toBeInstanceOf(TrailNotFoundError)
  })
})
