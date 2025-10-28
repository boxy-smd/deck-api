import { type Either, left, right } from '@/shared/either.ts'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found.error.ts'
import type { User } from '../../enterprise/entities/user.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'

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
