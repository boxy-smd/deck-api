import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import { Trail } from '@/domain/entities/trail.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'

interface CreateTrailUseCaseRequest {
  name: string
}

export type CreateTrailUseCaseResponse = Either<InvalidCredentialsError, Trail>

export class CreateTrailUseCase {
  constructor(private trailsRepository: TrailsRepository) {}

  async execute({
    name,
  }: CreateTrailUseCaseRequest): Promise<CreateTrailUseCaseResponse> {
    const isNameEmpty = !name

    if (isNameEmpty) {
      return left(new InvalidCredentialsError())
    }

    const trail = Trail.create({
      name,
    })

    await this.trailsRepository.create(trail)

    return right(trail)
  }
}
