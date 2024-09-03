@/domain/deck/enterprise/entities/trail.entity.tsion/repositories/trails-repository.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'

type FetchTrailsUseCaseResponse = Trail[]

export class FetchTrailsUseCase {
  constructor(private readonly trailsRepository: TrailsRepository) {}

  async execute(): Promise<FetchTrailsUseCaseResponse> {
    return await this.trailsRepository.fetch()
  }
}
