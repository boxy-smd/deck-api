import { Either, left, right } from '@/@shared/kernel/either'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../repositories/users-repository'
import { EmailService } from '../../services/email-service'
import { ResourceNotFoundError } from '@/@shared/kernel/errors/resource-not-found.error'

interface ForgotPasswordUseCaseRequest {
  email: string
}

type ForgotPasswordUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute({
    email,
  }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const token = randomUUID()
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // 1 hour expiration

    user.setPasswordResetToken(token, expires)

    await this.usersRepository.save(user)

    await this.emailService.send({
      to: user.email.value,
      subject: 'Recuperação de senha',
      body: `Seu token de recuperação de senha é: ${token}`,
    })

    return right(null)
  }
}
