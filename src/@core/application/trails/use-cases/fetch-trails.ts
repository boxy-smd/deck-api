import { Injectable } from '@nestjs/common'
import type { Trail } from '@/@core/domain/projects/entities/trail'
import { TrailsRepository } from '../repositories/trails-repository'

type FetchTrailsUseCaseResponse = Trail[]

@Injectable()
export class FetchTrailsUseCase {
  constructor(private readonly trailsRepository: TrailsRepository) {}

  async execute(): Promise<FetchTrailsUseCaseResponse> {
    return await this.trailsRepository.findAll()
  }
}
