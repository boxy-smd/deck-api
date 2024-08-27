import type {
  CreateTrailUseCaseRequest,
  CreateTrailUseCaseResponse,
} from '@/application/dtos/trails/create-dtos.ts'
import type { TrailsRepository } from '@/application/repositories/trails-repository.ts'
import { left, right } from '@/domain/core/logic/either.ts'
import { Trail } from '@/domain/entities/trail.entity.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'

export class CreateTrailUseCase {
  constructor(private trailsRepository: TrailsRepository) {}

  async execute({
    name,
  }: CreateTrailUseCaseRequest): Promise<CreateTrailUseCaseResponse> {
    const isNameEmpty = !name

    if (isNameEmpty) {
      return left(new InvalidCredentialsError())
    }

    const trail = Trail.create({
      name,
    })

    await this.trailsRepository.create(trail)

    return right(trail)
  }
}
