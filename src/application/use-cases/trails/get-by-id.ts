import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'
import { TrailNotFoundError } from './errors/trail-not-found.error.ts'

type GetTrailByIdUseCaseResponse = Either<TrailNotFoundError, Trail>

export class GetTrailByIdUseCase {
  constructor(private trailsRepository: TrailsRepository) {}

  async execute(id: string): Promise<GetTrailByIdUseCaseResponse> {
    const trail = await this.trailsRepository.findById(id)
    const isTrailNotFound = !trail

    if (isTrailNotFound) {
      return left(new TrailNotFoundError())
    }

    return right(trail)
  }
}
