import type { GetTrailByIdUseCaseResponse } from '@/application/dtos/trails/get-by-id-dtos.ts'
import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { TrailNotFoundError } from './errors/trail-not-found.error.ts'

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
