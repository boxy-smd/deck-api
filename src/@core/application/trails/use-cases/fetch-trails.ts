import { Injectable } from '@nestjs/common'
import type { Trail } from '@/@core/domain/projects/entities/trail'
import { TrailsRepository } from '../repositories/trails-repository'
import { isSelectableTrail } from '../utils/is-selectable-trail'

type FetchTrailsUseCaseResponse = Trail[]

@Injectable()
export class FetchTrailsUseCase {
  constructor(private readonly trailsRepository: TrailsRepository) {}

  async execute(): Promise<FetchTrailsUseCaseResponse> {
    const trails = await this.trailsRepository.findAll()
    return trails.filter(isSelectableTrail)
  }
}
