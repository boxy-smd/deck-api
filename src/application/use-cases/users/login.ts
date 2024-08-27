import type { UsersRepository } from '@/application/repositories/users-repository.ts'
import { type Either, left, right } from '@/domain/core/logic/either.ts'
import type { User } from '@/domain/entities/user.entity.ts'
import type { EmailBadFormattedError } from '@/domain/value-objects/errors/email-bad-formatted.error.ts'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error.ts'
import type { Encrypter } from './cryptography/encrypter.ts'

interface LoginUseCaseRequest {
  email: string
  password: string
}

type LoginUseCaseResponse = Either<
  InvalidCredentialsError | EmailBadFormattedError,
  User
>

export class LoginUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  public async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const isEmptyCredentials = !(email && password)

    if (isEmptyCredentials) return left(new InvalidCredentialsError())

    const user = await this.usersRepository.findByEmail(email)
    const isUserNotFound = !user

    if (isUserNotFound) return left(new InvalidCredentialsError())

    const isPasswordValid = await this.encrypter.compare(
      password,
      user.passwordHash,
    )

    if (isPasswordValid) return right(user)

    return left(new InvalidCredentialsError())
  }
}
