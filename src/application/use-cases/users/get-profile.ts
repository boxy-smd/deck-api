import type { UsersRepository } from '@/application/repositories/users-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import type { User } from '@/domain/entities/user.entity.ts'
import { UserNotFoundError } from './errors/user-not-found.error.ts'

interface GetProfileUseCaseRequest {
  userId: string
}

type GetProfileUseCaseResponse = Either<UserNotFoundError, User>

export class GetProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new UserNotFoundError())
    }

    return right(user)
  }
}
