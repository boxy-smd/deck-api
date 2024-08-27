import type {
  UpdateTrailUseCaseRequest,
  UpdateTrailUseCaseResponse,
} from '@/application/dtos/trails/update-dtos.ts'
import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { TrailNotFoundError } from './errors/trail-not-found.error.ts'

export class UpdateTrailUseCase {
  constructor(private trailsRepository: TrailsRepository) {}

  async execute({
    id,
    name,
  }: UpdateTrailUseCaseRequest): Promise<UpdateTrailUseCaseResponse> {
    const isNameEmpty = !name

    if (isNameEmpty) {
      return left(new InvalidCredentialsError())
    }

    const trailNotExists = !(await this.trailsRepository.findById(id))

    if (trailNotExists) {
      return left(new TrailNotFoundError())
    }

    const trail = await this.trailsRepository.update(id, {
      name,
    })

    const isTrailNotFound = !trail

    if (isTrailNotFound) {
      return left(new TrailNotFoundError())
    }

    return right(trail)
  }
}
