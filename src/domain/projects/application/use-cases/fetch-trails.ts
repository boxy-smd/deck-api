import type { Trail } from '../../enterprise/entities/trail.ts'
import type { TrailsRepository } from '../repositories/trails-repository.ts'

type FetchTrailsUseCaseResponse = Trail[]

export class FetchTrailsUseCase {
  constructor(private readonly trailsRepository: TrailsRepository) {}

  async execute(): Promise<FetchTrailsUseCaseResponse> {
    return await this.trailsRepository.findAll()
  }
}
