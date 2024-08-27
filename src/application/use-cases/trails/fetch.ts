import type { FetchTrailsUseCaseResponse } from '@/application/dtos/trails/fetch-dtos.ts'
import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'

export class FetchTrailsUseCase {
  constructor(private readonly trailsRepository: TrailsRepository) {}

  async execute(): Promise<FetchTrailsUseCaseResponse> {
    return await this.trailsRepository.fetch()
  }
}
