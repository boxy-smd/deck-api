import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import type { Trail } from '@/domain/entities/trail.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import { TrailNotFoundError } from './errors/trail-not-found.error.ts'

interface UpdateTrailUseCaseRequest {
  id: string
  name: string
}

type UpdateTrailUseCaseResponse = Either<
  InvalidCredentialsError | TrailNotFoundError,
  Trail
>

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
