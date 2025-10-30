import type { Trail } from '@/@core/domain/projects/entities/trail'
import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { Injectable } from '@nestjs/common'
import type { TrailsRepository } from '../../projects/repositories/trails-repository'
import { type UserDTO, UserDTOMapper } from '../dtos/user.dto'
import type { UsersRepository } from '../repositories/users-repository'

interface GetProfileUseCaseRequest {
  username: string
}

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, UserDTO>

@Injectable()
export class GetProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private trailsRepository: TrailsRepository,
  ) {}

  async execute({
    username,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const trails: Trail[] = []

    if (user.profile) {
      for (const trailId of user.profile.trailsIds) {
        const trail = await this.trailsRepository.findById(trailId.toString())

        if (trail) {
          trails.push(trail)
        }
      }
    }

    const userDetails = UserDTOMapper.toDTO(user, trails)

    return right(userDetails)
  }
}
