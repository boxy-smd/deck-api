import type { Trail } from '@/domain/entities/trail.entity.ts'
import type { TrailsRepository } from '@/domain/repositories/trails-repository.ts'

type FetchTrailsUseCaseResponse = Trail[]

export class FetchTrailsUseCase {
  constructor(private readonly trailsRepository: TrailsRepository) {}

  async execute(): Promise<FetchTrailsUseCaseResponse> {
    return await this.trailsRepository.fetch()
  }
}
