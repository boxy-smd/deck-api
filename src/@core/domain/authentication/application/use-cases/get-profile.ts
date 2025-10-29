import { type Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import type { User } from '../../enterprise/entities/user'
import type { UsersRepository } from '../repositories/users-repository'

interface GetProfileUseCaseRequest {
  username: string
}

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, User>

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    username,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const profile = await this.usersRepository.findByUsername(username)

    if (!profile) {
      return left(new ResourceNotFoundError('Student not found.'))
    }

    return right(profile)
  }
}
