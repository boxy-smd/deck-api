import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/@shared/kernel/either'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'

interface ResetPasswordUseCaseRequest {
  token: string
  newPassword: string
}

type ResetPasswordUseCaseResponse = Either<ResourceNotFoundError | Error, null>

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    token,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const user = await this.usersRepository.findByPasswordResetToken(token)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return left(new Error('Token expired'))
    }

    const passwordHash = await this.hashGenerator.hash(newPassword)

    user.updatePassword(passwordHash)
    user.clearPasswordResetToken()

    await this.usersRepository.save(user)

    return right(null)
  }
}
